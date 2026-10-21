package com.bookstore.service;

import com.bookstore.dto.BookResponse;
import com.bookstore.dto.DashboardSummaryResponse;
import com.bookstore.dto.OrderResponse;
import com.bookstore.entity.OrderStatus;
import com.bookstore.repository.BookRepository;
import com.bookstore.repository.OrderRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final BookRepository bookRepository;
    private final OrderRepository orderRepository;

    public DashboardService(BookRepository bookRepository, OrderRepository orderRepository) {
        this.bookRepository = bookRepository;
        this.orderRepository = orderRepository;
    }

    @Transactional(readOnly = true)
    public DashboardSummaryResponse getDashboardSummary() {
        long activeBookCount = bookRepository.countByActiveTrue();
        long totalOrderCount = orderRepository.count();
        long pendingOrderCount = orderRepository.countByStatus(OrderStatus.PENDING);
        BigDecimal totalRevenue = orderRepository.sumTotalRevenueByStatus(OrderStatus.COMPLETED);

        List<OrderResponse> recentOrders = orderRepository.findTop5ByOrderByCreatedAtDesc().stream()
            .map(OrderResponse::fromEntity)
            .collect(Collectors.toList());

        List<BookResponse> lowStockBooks = bookRepository.findLowStockBooks(10, PageRequest.of(0, 8)).stream()
            .map(BookResponse::fromEntity)
            .collect(Collectors.toList());

        return new DashboardSummaryResponse(
            activeBookCount,
            totalOrderCount,
            pendingOrderCount,
            totalRevenue != null ? totalRevenue : BigDecimal.ZERO,
            recentOrders,
            lowStockBooks
        );
    }
}
