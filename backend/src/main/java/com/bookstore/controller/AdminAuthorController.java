package com.bookstore.controller;

import com.bookstore.dto.*;
import com.bookstore.service.AuthorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/authors")
public class AdminAuthorController {

    private final AuthorService authorService;

    public AdminAuthorController(AuthorService authorService) {
        this.authorService = authorService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<AuthorResponse>>> getAllAuthors(
        @RequestParam(required = false) String keyword,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        PageResponse<AuthorResponse> response = authorService.getAllAuthors(keyword, page, size);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<AuthorResponse>>> getAllAuthorsList() {
        List<AuthorResponse> list = authorService.getAllAuthorsList();
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AuthorResponse>> getAuthorById(@PathVariable Long id) {
        AuthorResponse response = authorService.getAuthorById(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AuthorResponse>> createAuthor(@Valid @RequestBody AuthorRequest request) {
        AuthorResponse response = authorService.createAuthor(request);
        return new ResponseEntity<>(ApiResponse.ok("Tạo tác giả thành công!", response), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AuthorResponse>> updateAuthor(
        @PathVariable Long id,
        @Valid @RequestBody AuthorRequest request
    ) {
        AuthorResponse response = authorService.updateAuthor(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật tác giả thành công!", response));
    }
}
