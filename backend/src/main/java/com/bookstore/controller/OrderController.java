package com.bookstore.controller;

import com.bookstore.dto.ApiResponse;
import com.bookstore.dto.CreateOrderRequest;
import com.bookstore.dto.OrderResponse;
import com.bookstore.dto.PageResponse;
import com.bookstore.security.CustomUserDetails;
import com.bookstore.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
        @Valid @RequestBody CreateOrderRequest request,
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        OrderResponse response = orderService.createOrder(request, userDetails.getUser());
        return new ResponseEntity<>(ApiResponse.ok("Đặt hàng COD thành công!", response), HttpStatus.CREATED);
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<PageResponse<OrderResponse>>> getMyOrders(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        PageResponse<OrderResponse> response = orderService.getCustomerOrders(userDetails.getId(), page, size);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/my/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getMyOrderById(
        @PathVariable Long id,
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        OrderResponse response = orderService.getCustomerOrderById(userDetails.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/my/{id}/cancel")
    public ResponseEntity<ApiResponse<OrderResponse>> cancelMyOrder(
        @PathVariable Long id,
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        OrderResponse response = orderService.cancelCustomerOrder(userDetails.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Hủy đơn hàng thành công, tồn kho đã được hoàn lại!", response));
    }
}
