package com.bookstore.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class CreatePurchaseReceiptRequest {
    @NotNull(message = "Nhà cung cấp không được để trống")
    private Long supplierId;

    private String note;

    @NotEmpty(message = "Phiếu nhập phải có ít nhất 1 sản phẩm")
    @Valid
    private List<PurchaseReceiptItemRequest> items;

    public CreatePurchaseReceiptRequest() {}

    public Long getSupplierId() { return supplierId; }
    public void setSupplierId(Long supplierId) { this.supplierId = supplierId; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public List<PurchaseReceiptItemRequest> getItems() { return items; }
    public void setItems(List<PurchaseReceiptItemRequest> items) { this.items = items; }
}
