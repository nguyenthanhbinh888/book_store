package com.bookstore.dto;

import com.bookstore.entity.Author;
import java.time.LocalDateTime;

public class AuthorResponse {
    private Long id;
    private String name;
    private String biography;
    private LocalDateTime createdAt;

    public AuthorResponse() {}

    public AuthorResponse(Long id, String name, String biography, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.biography = biography;
        this.createdAt = createdAt;
    }

    public static AuthorResponse fromEntity(Author author) {
        if (author == null) return null;
        return new AuthorResponse(
            author.getId(),
            author.getName(),
            author.getBiography(),
            author.getCreatedAt()
        );
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getBiography() { return biography; }
    public void setBiography(String biography) { this.biography = biography; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
