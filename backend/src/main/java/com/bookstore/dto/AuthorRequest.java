package com.bookstore.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthorRequest {
    @NotBlank(message = "Tên tác giả không được để trống")
    @Size(max = 150, message = "Tên tác giả tối đa 150 ký tự")
    private String name;

    private String biography;

    public AuthorRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getBiography() { return biography; }
    public void setBiography(String biography) { this.biography = biography; }
}
