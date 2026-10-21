package com.bookstore.service;

import com.bookstore.dto.*;
import com.bookstore.entity.*;
import com.bookstore.exception.BadRequestException;
import com.bookstore.exception.ResourceNotFoundException;
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
public class PurchaseReceiptService {

    private final PurchaseReceiptRepository purchaseReceiptRepository;
    private final SupplierRepository supplierRepository;
    private final BookRepository bookRepository;
    private final InventoryTransactionRepository inventoryTransactionRepository;

    public PurchaseReceiptService(
        PurchaseReceiptRepository purchaseReceiptRepository,
        SupplierRepository supplierRepository,
        BookRepository bookRepository,
        InventoryTransactionRepository inventoryTransactionRepository
    ) {
        this.purchaseReceiptRepository = purchaseReceiptRepository;
        this.supplierRepository = supplierRepository;
        this.bookRepository = bookRepository;
        this.inventoryTransactionRepository = inventoryTransactionRepository;
    }

    @Transactional
    public PurchaseReceiptResponse createReceipt(CreatePurchaseReceiptRequest request, User adminUser) {
        Supplier supplier = supplierRepository.findById(request.getSupplierId())
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhà cung cấp với ID: " + request.getSupplierId()));

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new BadRequestException("Phiếu nhập phải có ít nhất một sản phẩm.");
        }

        PurchaseReceipt receipt = new PurchaseReceipt();
        String datePrefix = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String uniqueSuffix = UUID.randomUUID().toString().substring(0, 5).toUpperCase();
        receipt.setReceiptCode("PN-" + datePrefix + "-" + uniqueSuffix);
        receipt.setSupplier(supplier);
        receipt.setCreatedBy(adminUser);
        receipt.setStatus(PurchaseReceiptStatus.DRAFT);
        receipt.setNote(request.getNote());

        BigDecimal totalCost = BigDecimal.ZERO;
        List<PurchaseReceiptDetail> details = new ArrayList<>();

        for (PurchaseReceiptItemRequest itemReq : request.getItems()) {
            if (itemReq.getQuantity() <= 0) {
                throw new BadRequestException("Số lượng nhập phải lớn hơn 0.");
            }

            Book book = bookRepository.findById(itemReq.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sách với ID: " + itemReq.getBookId()));

            BigDecimal lineTotal = itemReq.getUnitCost().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            totalCost = totalCost.add(lineTotal);

            PurchaseReceiptDetail detail = new PurchaseReceiptDetail();
            detail.setPurchaseReceipt(receipt);
            detail.setBook(book);
            detail.setQuantity(itemReq.getQuantity());
            detail.setUnitCost(itemReq.getUnitCost());
            detail.setLineTotal(lineTotal);
            details.add(detail);
        }

        receipt.setTotalCost(totalCost);
        receipt.setDetails(details);

        PurchaseReceipt saved = purchaseReceiptRepository.save(receipt);
        return PurchaseReceiptResponse.fromEntity(saved);
    }

    @Transactional
    public PurchaseReceiptResponse confirmReceipt(Long receiptId, User adminUser) {
        PurchaseReceipt receipt = purchaseReceiptRepository.findWithDetailsById(receiptId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phiếu nhập với ID: " + receiptId));

        if (receipt.getStatus() != PurchaseReceiptStatus.DRAFT) {
            throw new BadRequestException("Không thể xác nhận phiếu nhập này vì trạng thái hiện tại là: " + receipt.getStatus());
        }

        // Tăng tồn kho trong transaction database và ghi lịch sử biến động kho
        for (PurchaseReceiptDetail detail : receipt.getDetails()) {
            Book book = detail.getBook();
            book.setStockQuantity(book.getStockQuantity() + detail.getQuantity());
            book.setCostPrice(detail.getUnitCost()); // Cập nhật giá nhập mới nhất
            bookRepository.save(book);

            InventoryTransaction it = new InventoryTransaction();
            it.setBook(book);
            it.setTransactionType("PURCHASE");
            it.setReferenceType("PURCHASE_RECEIPT");
            it.setReferenceId(receipt.getId());
            it.setQuantityChange(detail.getQuantity());
            it.setNote("Nhập kho từ phiếu nhập " + receipt.getReceiptCode());
            it.setCreatedBy(adminUser);
            inventoryTransactionRepository.save(it);
        }

        receipt.setStatus(PurchaseReceiptStatus.CONFIRMED);
        receipt.setConfirmedAt(LocalDateTime.now());
        PurchaseReceipt confirmed = purchaseReceiptRepository.save(receipt);

        return PurchaseReceiptResponse.fromEntity(confirmed);
    }

    @Transactional(readOnly = true)
    public PageResponse<PurchaseReceiptResponse> getReceipts(
        String keyword,
        PurchaseReceiptStatus status,
        int page,
        int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<PurchaseReceipt> receiptPage = purchaseReceiptRepository.searchReceipts(
            StringUtils.hasText(keyword) ? keyword.trim() : null,
            status,
            pageable
        );
        List<PurchaseReceiptResponse> content = receiptPage.getContent().stream()
            .map(PurchaseReceiptResponse::fromEntity)
            .collect(Collectors.toList());
        return PageResponse.of(receiptPage, content);
    }

    @Transactional(readOnly = true)
    public PurchaseReceiptResponse getReceiptById(Long id) {
        PurchaseReceipt receipt = purchaseReceiptRepository.findWithDetailsById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phiếu nhập với ID: " + id));
        return PurchaseReceiptResponse.fromEntity(receipt);
    }
}
