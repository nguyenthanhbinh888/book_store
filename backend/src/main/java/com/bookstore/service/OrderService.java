package com.bookstore.service;

import com.bookstore.dto.*;
import com.bookstore.entity.*;
import com.bookstore.exception.BadRequestException;
import com.bookstore.exception.ResourceNotFoundException;
import com.bookstore.exception.UnauthorizedException;
import com.bookstore.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final BookRepository bookRepository;
    private final InventoryTransactionRepository inventoryTransactionRepository;

    public OrderService(
        OrderRepository orderRepository,
        OrderDetailRepository orderDetailRepository,
        BookRepository bookRepository,
        InventoryTransactionRepository inventoryTransactionRepository
    ) {
        this.orderRepository = orderRepository;
        this.orderDetailRepository = orderDetailRepository;
        this.bookRepository = bookRepository;
        this.inventoryTransactionRepository = inventoryTransactionRepository;
    }

    // -------------------------------------------------------------
    // KHÁCH HÀNG: ĐẶT HÀNG COD & XEM ĐƠN HÀNG
    // -------------------------------------------------------------

    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request, User customer) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new BadRequestException("Đơn hàng phải có ít nhất một sản phẩm.");
        }

        Order order = new Order();
        // Tạo mã đơn hàng duy nhất và dễ đọc: ORD-YYYYMMDD-XXXX
        String datePrefix = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String uniqueSuffix = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        order.setOrderCode("ORD-" + datePrefix + "-" + uniqueSuffix);
        order.setCustomer(customer);
        order.setRecipientName(request.getRecipientName().trim());
        order.setRecipientPhone(request.getRecipientPhone().trim());
        order.setShippingAddress(request.getShippingAddress().trim());
        order.setNote(request.getNote());
        order.setStatus(OrderStatus.PENDING);
        order.setPaymentMethod("COD");
        order.setPaymentStatus("UNPAID");

        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderDetail> details = new ArrayList<>();

        for (OrderItemRequest itemReq : request.getItems()) {
            if (itemReq.getQuantity() <= 0) {
                throw new BadRequestException("Số lượng sách phải lớn hơn 0.");
            }

            // Tải lại sách từ DB để lấy giá bán và tồn kho chính xác (không tin giá frontend)
            Book book = bookRepository.findById(itemReq.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sách với ID: " + itemReq.getBookId()));

            if (!Boolean.TRUE.equals(book.getActive())) {
                throw new BadRequestException("Cuốn sách '" + book.getTitle() + "' hiện đã ngừng kinh doanh.");
            }

            if (book.getStockQuantity() < itemReq.getQuantity()) {
                throw new BadRequestException("Sách '" + book.getTitle() + "' không đủ số lượng tồn kho (còn lại: " + book.getStockQuantity() + ").");
            }

            // Trừ tồn kho
            int newStock = book.getStockQuantity() - itemReq.getQuantity();
            book.setStockQuantity(newStock);
            bookRepository.save(book);

            BigDecimal lineTotal = book.getSellingPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            subtotal = subtotal.add(lineTotal);

            OrderDetail detail = new OrderDetail();
            detail.setOrder(order);
            detail.setBook(book);
            detail.setBookTitleSnapshot(book.getTitle());
            detail.setUnitPrice(book.getSellingPrice());
            detail.setQuantity(itemReq.getQuantity());
            detail.setLineTotal(lineTotal);
            details.add(detail);
        }

        order.setSubtotal(subtotal);
        order.setDiscountAmount(BigDecimal.ZERO);
        order.setTotalAmount(subtotal);
        order.setDetails(details);

        Order savedOrder = orderRepository.save(order);

        // Ghi lịch sử biến động kho cho từng sản phẩm
        for (OrderDetail detail : details) {
            InventoryTransaction it = new InventoryTransaction();
            it.setBook(detail.getBook());
            it.setTransactionType("ORDER");
            it.setReferenceType("ORDER");
            it.setReferenceId(savedOrder.getId());
            it.setQuantityChange(-detail.getQuantity());
            it.setNote("Trừ kho cho đơn hàng " + savedOrder.getOrderCode());
            it.setCreatedBy(customer);
            inventoryTransactionRepository.save(it);
        }

        return OrderResponse.fromEntity(savedOrder);
    }

    @Transactional(readOnly = true)
    public PageResponse<OrderResponse> getCustomerOrders(Long customerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Order> orderPage = orderRepository.findByCustomerIdOrderByCreatedAtDesc(customerId, pageable);
        List<OrderResponse> content = orderPage.getContent().stream()
            .map(OrderResponse::fromEntity)
            .collect(Collectors.toList());
        return PageResponse.of(orderPage, content);
    }

    @Transactional(readOnly = true)
    public OrderResponse getCustomerOrderById(Long customerId, Long orderId) {
        Order order = orderRepository.findWithDetailsById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng với ID: " + orderId));

        // Kiểm tra quyền sở hữu IDOR
        if (!order.getCustomer().getId().equals(customerId)) {
            throw new UnauthorizedException("Bạn không có quyền xem đơn hàng của người khác.");
        }

        return OrderResponse.fromEntity(order);
    }

    @Transactional
    public OrderResponse cancelCustomerOrder(Long customerId, Long orderId) {
        Order order = orderRepository.findWithDetailsById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng với ID: " + orderId));

        if (!order.getCustomer().getId().equals(customerId)) {
            throw new UnauthorizedException("Bạn không có quyền thao tác trên đơn hàng này.");
        }

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new BadRequestException("Chỉ có thể hủy đơn hàng khi đơn đang ở trạng thái 'Chờ xử lý' (PENDING).");
        }

        // Hoàn tồn kho đúng một lần
        for (OrderDetail detail : order.getDetails()) {
            Book book = detail.getBook();
            book.setStockQuantity(book.getStockQuantity() + detail.getQuantity());
            bookRepository.save(book);

            InventoryTransaction it = new InventoryTransaction();
            it.setBook(book);
            it.setTransactionType("ORDER_CANCEL");
            it.setReferenceType("ORDER");
            it.setReferenceId(order.getId());
            it.setQuantityChange(detail.getQuantity());
            it.setNote("Hoàn kho do khách hàng hủy đơn " + order.getOrderCode());
            it.setCreatedBy(order.getCustomer());
            inventoryTransactionRepository.save(it);
        }

        order.setStatus(OrderStatus.CANCELLED);
        order.setCancelledAt(LocalDateTime.now());
        Order updated = orderRepository.save(order);

        return OrderResponse.fromEntity(updated);
    }

    // -------------------------------------------------------------
    // QUẢN TRỊ VIÊN: QUẢN LÝ ĐƠN HÀNG
    // -------------------------------------------------------------

    @Transactional(readOnly = true)
    public PageResponse<OrderResponse> getAdminOrders(
        String keyword,
        OrderStatus status,
        int page,
        int size,
        String sortBy,
        String sortDir
    ) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir.toUpperCase()), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Order> orderPage = orderRepository.searchOrders(
            StringUtils.hasText(keyword) ? keyword.trim() : null,
            status,
            pageable
        );

        List<OrderResponse> content = orderPage.getContent().stream()
            .map(OrderResponse::fromEntity)
            .collect(Collectors.toList());

        return PageResponse.of(orderPage, content);
    }

    @Transactional(readOnly = true)
    public OrderResponse getAdminOrderById(Long id) {
        Order order = orderRepository.findWithDetailsById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng với ID: " + id));
        return OrderResponse.fromEntity(order);
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus newStatus, User adminUser) {
        Order order = orderRepository.findWithDetailsById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng với ID: " + orderId));

        OrderStatus currentStatus = order.getStatus();

        if (currentStatus == newStatus) {
            return OrderResponse.fromEntity(order);
        }

        // Không cho phép thay đổi nếu đơn đã bị CANCELLED
        if (currentStatus == OrderStatus.CANCELLED) {
            throw new BadRequestException("Đơn hàng đã bị hủy, không thể chuyển sang trạng thái khác.");
        }

        // Không cho phép thay đổi nếu đơn đã COMPLETED trừ khi chính sách đặc biệt
        if (currentStatus == OrderStatus.COMPLETED && newStatus != OrderStatus.CANCELLED) {
            throw new BadRequestException("Đơn hàng đã hoàn thành thành công.");
        }

        // Xử lý hoàn kho an toàn nếu chuyển sang CANCELLED
        if (newStatus == OrderStatus.CANCELLED) {
            for (OrderDetail detail : order.getDetails()) {
                Book book = detail.getBook();
                book.setStockQuantity(book.getStockQuantity() + detail.getQuantity());
                bookRepository.save(book);

                InventoryTransaction it = new InventoryTransaction();
                it.setBook(book);
                it.setTransactionType("ORDER_CANCEL");
                it.setReferenceType("ORDER");
                it.setReferenceId(order.getId());
                it.setQuantityChange(detail.getQuantity());
                it.setNote("Hoàn kho do quản trị viên hủy đơn " + order.getOrderCode());
                it.setCreatedBy(adminUser);
                inventoryTransactionRepository.save(it);
            }
            order.setCancelledAt(LocalDateTime.now());
        }

        // Nếu chuyển sang COMPLETED thì cập nhật thanh toán COD thành PAID
        if (newStatus == OrderStatus.COMPLETED) {
            order.setPaymentStatus("PAID");
        }

        order.setStatus(newStatus);
        Order updated = orderRepository.save(order);
        return OrderResponse.fromEntity(updated);
    }
}
