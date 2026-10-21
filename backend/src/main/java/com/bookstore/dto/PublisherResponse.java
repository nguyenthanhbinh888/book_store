package com.bookstore.dto;

import com.bookstore.entity.Publisher;
import java.time.LocalDateTime;

public class PublisherResponse {
    private Long id;
    private String name;
    private String address;
    private String phone;
    private LocalDateTime createdAt;

    public PublisherResponse() {}

    public PublisherResponse(Long id, String name, String address, String phone, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.phone = phone;
        this.createdAt = createdAt;
    }

    public static PublisherResponse fromEntity(Publisher publisher) {
        if (publisher == null) return null;
        return new PublisherResponse(
            publisher.getId(),
            publisher.getName(),
            publisher.getAddress(),
            publisher.getPhone(),
            publisher.getCreatedAt()
        );
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
