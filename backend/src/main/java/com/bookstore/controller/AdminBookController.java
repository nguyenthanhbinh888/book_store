package com.bookstore.controller;

import com.bookstore.dto.*;
import com.bookstore.security.CustomUserDetails;
import com.bookstore.service.BookService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/books")
public class AdminBookController {

    private final BookService bookService;

    public AdminBookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<AdminBookResponse>>> getAdminBooks(
        @RequestParam(required = false) String keyword,
        @RequestParam(required = false) Long categoryId,
        @RequestParam(required = false) Boolean active,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "createdAt") String sortBy,
        @RequestParam(defaultValue = "desc") String sortDir
    ) {
        PageResponse<AdminBookResponse> response = bookService.getAdminBooks(
            keyword, categoryId, active, page, size, sortBy, sortDir
        );
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminBookResponse>> getBookById(@PathVariable Long id) {
        AdminBookResponse response = bookService.getAdminBookById(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AdminBookResponse>> createBook(
        @Valid @RequestBody BookRequest request,
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        AdminBookResponse response = bookService.createBook(request, userDetails.getUser());
        return new ResponseEntity<>(ApiResponse.ok("Thêm sách mới thành công!", response), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminBookResponse>> updateBook(
        @PathVariable Long id,
        @Valid @RequestBody BookRequest request
    ) {
        AdminBookResponse response = bookService.updateBook(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật thông tin sách thành công!", response));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<AdminBookResponse>> updateStatus(
        @PathVariable Long id,
        @Valid @RequestBody StatusUpdateRequest request
    ) {
        AdminBookResponse response = bookService.updateStatus(id, request.getActive());
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật trạng thái sách thành công!", response));
    }
}
