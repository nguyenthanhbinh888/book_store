package com.bookstore.dto;

import com.bookstore.entity.Book;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class BookResponse {
    private Long id;
    private String isbn;
    private String title;
    private String description;
    private CategoryResponse category;
    private PublisherResponse publisher;
    private List<AuthorResponse> authors;
    private BigDecimal sellingPrice;
    private Integer stockQuantity;
    private String coverImageUrl;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public BookResponse() {}

    public static BookResponse fromEntity(Book book) {
        if (book == null) return null;
        BookResponse response = new BookResponse();
        response.setId(book.getId());
        response.setIsbn(book.getIsbn());
        response.setTitle(book.getTitle());
        response.setDescription(book.getDescription());
        response.setCategory(CategoryResponse.fromEntity(book.getCategory()));
        response.setPublisher(PublisherResponse.fromEntity(book.getPublisher()));
        if (book.getAuthors() != null) {
            response.setAuthors(book.getAuthors().stream()
                .map(AuthorResponse::fromEntity)
                .collect(Collectors.toList()));
        }
        response.setSellingPrice(book.getSellingPrice());
        response.setStockQuantity(book.getStockQuantity());
        response.setCoverImageUrl(book.getCoverImageUrl());
        response.setActive(book.getActive());
        response.setCreatedAt(book.getCreatedAt());
        response.setUpdatedAt(book.getUpdatedAt());
        return response;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public CategoryResponse getCategory() { return category; }
    public void setCategory(CategoryResponse category) { this.category = category; }

    public PublisherResponse getPublisher() { return publisher; }
    public void setPublisher(PublisherResponse publisher) { this.publisher = publisher; }

    public List<AuthorResponse> getAuthors() { return authors; }
    public void setAuthors(List<AuthorResponse> authors) { this.authors = authors; }

    public BigDecimal getSellingPrice() { return sellingPrice; }
    public void setSellingPrice(BigDecimal sellingPrice) { this.sellingPrice = sellingPrice; }

    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }

    public String getCoverImageUrl() { return coverImageUrl; }
    public void setCoverImageUrl(String coverImageUrl) { this.coverImageUrl = coverImageUrl; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
