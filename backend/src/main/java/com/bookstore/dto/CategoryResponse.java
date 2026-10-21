package com.bookstore.dto;

import com.bookstore.entity.Category;
import java.time.LocalDateTime;

public class CategoryResponse {
    private Long id;
    private String name;
    private String description;
    private Boolean active;
    private LocalDateTime createdAt;

    public CategoryResponse() {}

    public CategoryResponse(Long id, String name, String description, Boolean active, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.active = active;
        this.createdAt = createdAt;
    }

    public static CategoryResponse fromEntity(Category category) {
        if (category == null) return null;
        return new CategoryResponse(
            category.getId(),
            category.getName(),
            category.getDescription(),
            category.getActive(),
            category.getCreatedAt()
        );
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
