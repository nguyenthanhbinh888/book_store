package com.bookstore.controller;

import com.bookstore.dto.ApiResponse;
import com.bookstore.dto.BookResponse;
import com.bookstore.dto.PageResponse;
import com.bookstore.service.BookService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<BookResponse>>> getPublicBooks(
        @RequestParam(required = false) String keyword,
        @RequestParam(required = false) Long categoryId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "12") int size,
        @RequestParam(defaultValue = "createdAt") String sortBy,
        @RequestParam(defaultValue = "desc") String sortDir
    ) {
        PageResponse<BookResponse> response = bookService.getPublicBooks(
            keyword, categoryId, page, size, sortBy, sortDir
        );
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookResponse>> getBookById(@PathVariable Long id) {
        BookResponse response = bookService.getPublicBookById(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
