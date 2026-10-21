package com.bookstore.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class PurchaseReceiptItemRequest {
    @NotNull(message = "Mã sách không được để trống")
    private Long bookId;

    @NotNull(message = "Số lượng nhập không được để trống")
    @Min(value = 1, message = "Số lượng nhập phải lớn hơn 0")
    private Integer quantity;

    @NotNull(message = "Đơn giá nhập không được để trống")
    @DecimalMin(value = "0.0", inclusive = true, message = "Đơn giá nhập không được âm")
    private BigDecimal unitCost;

    public PurchaseReceiptItemRequest() {}

    public Long getBookId() { return bookId; }
    public void setBookId(Long bookId) { this.bookId = bookId; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getUnitCost() { return unitCost; }
    public void setUnitCost(BigDecimal unitCost) { this.unitCost = unitCost; }
}
