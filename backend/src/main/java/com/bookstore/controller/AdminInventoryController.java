package com.bookstore.controller;

import com.bookstore.dto.ApiResponse;
import com.bookstore.dto.InventoryTransactionResponse;
import com.bookstore.dto.PageResponse;
import com.bookstore.service.InventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/inventory")
public class AdminInventoryController {

    private final InventoryService inventoryService;

    public AdminInventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping("/transactions")
    public ResponseEntity<ApiResponse<PageResponse<InventoryTransactionResponse>>> getTransactions(
        @RequestParam(required = false) Long bookId,
        @RequestParam(required = false) String type,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "15") int size
    ) {
        PageResponse<InventoryTransactionResponse> response = inventoryService.getTransactions(bookId, type, page, size);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
