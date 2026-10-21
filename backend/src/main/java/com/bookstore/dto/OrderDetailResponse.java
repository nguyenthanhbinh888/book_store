package com.bookstore.dto;

import com.bookstore.entity.OrderDetail;

import java.math.BigDecimal;

public class OrderDetailResponse {
    private Long id;
    private Long bookId;
    private String bookTitleSnapshot;
    private String coverImageUrl;
    private BigDecimal unitPrice;
    private Integer quantity;
    private BigDecimal lineTotal;

    public OrderDetailResponse() {}

    public static OrderDetailResponse fromEntity(OrderDetail detail) {
        if (detail == null) return null;
        OrderDetailResponse response = new OrderDetailResponse();
        response.setId(detail.getId());
        if (detail.getBook() != null) {
            response.setBookId(detail.getBook().getId());
            response.setCoverImageUrl(detail.getBook().getCoverImageUrl());
        }
        response.setBookTitleSnapshot(detail.getBookTitleSnapshot());
        response.setUnitPrice(detail.getUnitPrice());
        response.setQuantity(detail.getQuantity());
        response.setLineTotal(detail.getLineTotal());
        return response;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getBookId() { return bookId; }
    public void setBookId(Long bookId) { this.bookId = bookId; }

    public String getBookTitleSnapshot() { return bookTitleSnapshot; }
    public void setBookTitleSnapshot(String bookTitleSnapshot) { this.bookTitleSnapshot = bookTitleSnapshot; }

    public String getCoverImageUrl() { return coverImageUrl; }
    public void setCoverImageUrl(String coverImageUrl) { this.coverImageUrl = coverImageUrl; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getLineTotal() { return lineTotal; }
    public void setLineTotal(BigDecimal lineTotal) { this.lineTotal = lineTotal; }
}
