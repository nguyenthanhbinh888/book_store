package com.bookstore.dto;

import com.bookstore.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;

public class OrderStatusUpdateRequest {
    @NotNull(message = "Trạng thái đơn hàng không được để trống")
    private OrderStatus status;

    public OrderStatusUpdateRequest() {}

    public OrderStatusUpdateRequest(OrderStatus status) {
        this.status = status;
    }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
}
