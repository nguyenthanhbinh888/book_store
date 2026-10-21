package com.bookstore.dto;

import com.bookstore.entity.Supplier;

import java.time.LocalDateTime;

public class SupplierResponse {
    private Long id;
    private String name;
    private String contactName;
    private String phone;
    private String email;
    private String address;
    private LocalDateTime createdAt;

    public SupplierResponse() {}

    public static SupplierResponse fromEntity(Supplier supplier) {
        if (supplier == null) return null;
        SupplierResponse response = new SupplierResponse();
        response.setId(supplier.getId());
        response.setName(supplier.getName());
        response.setContactName(supplier.getContactName());
        response.setPhone(supplier.getPhone());
        response.setEmail(supplier.getEmail());
        response.setAddress(supplier.getAddress());
        response.setCreatedAt(supplier.getCreatedAt());
        return response;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getContactName() { return contactName; }
    public void setContactName(String contactName) { this.contactName = contactName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
