package com.bookstore.dto;

import com.bookstore.entity.PurchaseReceiptDetail;

import java.math.BigDecimal;

public class PurchaseReceiptDetailResponse {
    private Long id;
    private Long bookId;
    private String bookTitle;
    private String coverImageUrl;
    private Integer quantity;
    private BigDecimal unitCost;
    private BigDecimal lineTotal;

    public PurchaseReceiptDetailResponse() {}

    public static PurchaseReceiptDetailResponse fromEntity(PurchaseReceiptDetail detail) {
        if (detail == null) return null;
        PurchaseReceiptDetailResponse response = new PurchaseReceiptDetailResponse();
        response.setId(detail.getId());
        if (detail.getBook() != null) {
            response.setBookId(detail.getBook().getId());
            response.setBookTitle(detail.getBook().getTitle());
            response.setCoverImageUrl(detail.getBook().getCoverImageUrl());
        }
        response.setQuantity(detail.getQuantity());
        response.setUnitCost(detail.getUnitCost());
        response.setLineTotal(detail.getLineTotal());
        return response;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getBookId() { return bookId; }
    public void setBookId(Long bookId) { this.bookId = bookId; }

    public String getBookTitle() { return bookTitle; }
    public void setBookTitle(String bookTitle) { this.bookTitle = bookTitle; }

    public String getCoverImageUrl() { return coverImageUrl; }
    public void setCoverImageUrl(String coverImageUrl) { this.coverImageUrl = coverImageUrl; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getUnitCost() { return unitCost; }
    public void setUnitCost(BigDecimal unitCost) { this.unitCost = unitCost; }

    public BigDecimal getLineTotal() { return lineTotal; }
    public void setLineTotal(BigDecimal lineTotal) { this.lineTotal = lineTotal; }
}
