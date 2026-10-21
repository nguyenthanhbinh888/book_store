package com.bookstore.controller;

import com.bookstore.dto.ApiResponse;
import com.bookstore.dto.OrderResponse;
import com.bookstore.dto.OrderStatusUpdateRequest;
import com.bookstore.dto.PageResponse;
import com.bookstore.entity.OrderStatus;
import com.bookstore.security.CustomUserDetails;
import com.bookstore.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/orders")
public class AdminOrderController {

    private final OrderService orderService;

    public AdminOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<OrderResponse>>> getAdminOrders(
        @RequestParam(required = false) String keyword,
        @RequestParam(required = false) OrderStatus status,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "createdAt") String sortBy,
        @RequestParam(defaultValue = "desc") String sortDir
    ) {
        PageResponse<OrderResponse> response = orderService.getAdminOrders(keyword, status, page, size, sortBy, sortDir);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(@PathVariable Long id) {
        OrderResponse response = orderService.getAdminOrderById(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
        @PathVariable Long id,
        @Valid @RequestBody OrderStatusUpdateRequest request,
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        OrderResponse response = orderService.updateOrderStatus(id, request.getStatus(), userDetails.getUser());
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật trạng thái đơn hàng thành công!", response));
    }
}
