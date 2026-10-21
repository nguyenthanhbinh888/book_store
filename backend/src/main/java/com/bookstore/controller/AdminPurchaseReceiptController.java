package com.bookstore.controller;

import com.bookstore.dto.ApiResponse;
import com.bookstore.dto.CreatePurchaseReceiptRequest;
import com.bookstore.dto.PageResponse;
import com.bookstore.dto.PurchaseReceiptResponse;
import com.bookstore.entity.PurchaseReceiptStatus;
import com.bookstore.security.CustomUserDetails;
import com.bookstore.service.PurchaseReceiptService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/purchase-receipts")
public class AdminPurchaseReceiptController {

    private final PurchaseReceiptService purchaseReceiptService;

    public AdminPurchaseReceiptController(PurchaseReceiptService purchaseReceiptService) {
        this.purchaseReceiptService = purchaseReceiptService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<PurchaseReceiptResponse>>> getReceipts(
        @RequestParam(required = false) String keyword,
        @RequestParam(required = false) PurchaseReceiptStatus status,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        PageResponse<PurchaseReceiptResponse> response = purchaseReceiptService.getReceipts(keyword, status, page, size);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PurchaseReceiptResponse>> getReceiptById(@PathVariable Long id) {
        PurchaseReceiptResponse response = purchaseReceiptService.getReceiptById(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PurchaseReceiptResponse>> createReceipt(
        @Valid @RequestBody CreatePurchaseReceiptRequest request,
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        PurchaseReceiptResponse response = purchaseReceiptService.createReceipt(request, userDetails.getUser());
        return new ResponseEntity<>(ApiResponse.ok("Tạo phiếu nhập thành công (DRAFT)!", response), HttpStatus.CREATED);
    }

    @PostMapping("/{id}/confirm")
    public ResponseEntity<ApiResponse<PurchaseReceiptResponse>> confirmReceipt(
        @PathVariable Long id,
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        PurchaseReceiptResponse response = purchaseReceiptService.confirmReceipt(id, userDetails.getUser());
        return ResponseEntity.ok(ApiResponse.ok("Xác nhận nhập kho thành công! Tồn kho đã được cập nhật.", response));
    }
}
