package com.bookstore.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class PublisherRequest {
    @NotBlank(message = "Tên nhà xuất bản không được để trống")
    @Size(max = 150, message = "Tên nhà xuất bản tối đa 150 ký tự")
    private String name;

    private String address;
    private String phone;

    public PublisherRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
}
