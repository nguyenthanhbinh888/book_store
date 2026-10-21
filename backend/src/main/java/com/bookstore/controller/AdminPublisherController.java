package com.bookstore.controller;

import com.bookstore.dto.*;
import com.bookstore.service.PublisherService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/publishers")
public class AdminPublisherController {

    private final PublisherService publisherService;

    public AdminPublisherController(PublisherService publisherService) {
        this.publisherService = publisherService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<PublisherResponse>>> getAllPublishers(
        @RequestParam(required = false) String keyword,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        PageResponse<PublisherResponse> response = publisherService.getAllPublishers(keyword, page, size);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<PublisherResponse>>> getAllPublishersList() {
        List<PublisherResponse> list = publisherService.getAllPublishersList();
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PublisherResponse>> getPublisherById(@PathVariable Long id) {
        PublisherResponse response = publisherService.getPublisherById(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PublisherResponse>> createPublisher(@Valid @RequestBody PublisherRequest request) {
        PublisherResponse response = publisherService.createPublisher(request);
        return new ResponseEntity<>(ApiResponse.ok("Tạo nhà xuất bản thành công!", response), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PublisherResponse>> updatePublisher(
        @PathVariable Long id,
        @Valid @RequestBody PublisherRequest request
    ) {
        PublisherResponse response = publisherService.updatePublisher(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật nhà xuất bản thành công!", response));
    }
}
