package com.bookstore.dto;

import com.bookstore.entity.InventoryTransaction;

import java.time.LocalDateTime;

public class InventoryTransactionResponse {
    private Long id;
    private Long bookId;
    private String bookTitle;
    private String transactionType;
    private String referenceType;
    private Long referenceId;
    private Integer quantityChange;
    private String note;
    private String createdByName;
    private LocalDateTime createdAt;

    public InventoryTransactionResponse() {}

    public static InventoryTransactionResponse fromEntity(InventoryTransaction it) {
        if (it == null) return null;
        InventoryTransactionResponse response = new InventoryTransactionResponse();
        response.setId(it.getId());
        if (it.getBook() != null) {
            response.setBookId(it.getBook().getId());
            response.setBookTitle(it.getBook().getTitle());
        }
        response.setTransactionType(it.getTransactionType());
        response.setReferenceType(it.getReferenceType());
        response.setReferenceId(it.getReferenceId());
        response.setQuantityChange(it.getQuantityChange());
        response.setNote(it.getNote());
        if (it.getCreatedBy() != null) {
            response.setCreatedByName(it.getCreatedBy().getFullName());
        }
        response.setCreatedAt(it.getCreatedAt());
        return response;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getBookId() { return bookId; }
    public void setBookId(Long bookId) { this.bookId = bookId; }

    public String getBookTitle() { return bookTitle; }
    public void setBookTitle(String bookTitle) { this.bookTitle = bookTitle; }

    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }

    public String getReferenceType() { return referenceType; }
    public void setReferenceType(String referenceType) { this.referenceType = referenceType; }

    public Long getReferenceId() { return referenceId; }
    public void setReferenceId(Long referenceId) { this.referenceId = referenceId; }

    public Integer getQuantityChange() { return quantityChange; }
    public void setQuantityChange(Integer quantityChange) { this.quantityChange = quantityChange; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public String getCreatedByName() { return createdByName; }
    public void setCreatedByName(String createdByName) { this.createdByName = createdByName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
