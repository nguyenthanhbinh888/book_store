package com.bookstore.dto;

import com.bookstore.entity.PurchaseReceipt;
import com.bookstore.entity.PurchaseReceiptStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class PurchaseReceiptResponse {
    private Long id;
    private String receiptCode;
    private SupplierResponse supplier;
    private UserResponse createdBy;
    private PurchaseReceiptStatus status;
    private String note;
    private BigDecimal totalCost;
    private List<PurchaseReceiptDetailResponse> details;
    private LocalDateTime createdAt;
    private LocalDateTime confirmedAt;

    public PurchaseReceiptResponse() {}

    public static PurchaseReceiptResponse fromEntity(PurchaseReceipt receipt) {
        if (receipt == null) return null;
        PurchaseReceiptResponse response = new PurchaseReceiptResponse();
        response.setId(receipt.getId());
        response.setReceiptCode(receipt.getReceiptCode());
        response.setSupplier(SupplierResponse.fromEntity(receipt.getSupplier()));
        response.setCreatedBy(UserResponse.fromEntity(receipt.getCreatedBy()));
        response.setStatus(receipt.getStatus());
        response.setNote(receipt.getNote());
        response.setTotalCost(receipt.getTotalCost());
        if (receipt.getDetails() != null) {
            response.setDetails(receipt.getDetails().stream()
                .map(PurchaseReceiptDetailResponse::fromEntity)
                .collect(Collectors.toList()));
        }
        response.setCreatedAt(receipt.getCreatedAt());
        response.setConfirmedAt(receipt.getConfirmedAt());
        return response;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getReceiptCode() { return receiptCode; }
    public void setReceiptCode(String receiptCode) { this.receiptCode = receiptCode; }

    public SupplierResponse getSupplier() { return supplier; }
    public void setSupplier(SupplierResponse supplier) { this.supplier = supplier; }

    public UserResponse getCreatedBy() { return createdBy; }
    public void setCreatedBy(UserResponse createdBy) { this.createdBy = createdBy; }

    public PurchaseReceiptStatus getStatus() { return status; }
    public void setStatus(PurchaseReceiptStatus status) { this.status = status; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public BigDecimal getTotalCost() { return totalCost; }
    public void setTotalCost(BigDecimal totalCost) { this.totalCost = totalCost; }

    public List<PurchaseReceiptDetailResponse> getDetails() { return details; }
    public void setDetails(List<PurchaseReceiptDetailResponse> details) { this.details = details; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getConfirmedAt() { return confirmedAt; }
    public void setConfirmedAt(LocalDateTime confirmedAt) { this.confirmedAt = confirmedAt; }
}
