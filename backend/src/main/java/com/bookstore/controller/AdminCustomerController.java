package com.bookstore.controller;

import com.bookstore.dto.ApiResponse;
import com.bookstore.dto.PageResponse;
import com.bookstore.dto.UserResponse;
import com.bookstore.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/customers")
public class AdminCustomerController {

    private final UserService userService;

    public AdminCustomerController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<UserResponse>>> getCustomers(
        @RequestParam(required = false) String keyword,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        PageResponse<UserResponse> response = userService.getCustomers(keyword, page, size);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
