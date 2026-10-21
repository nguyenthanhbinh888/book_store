package com.bookstore.controller;

import com.bookstore.dto.ApiResponse;
import com.bookstore.dto.SupplierResponse;
import com.bookstore.service.SupplierService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/suppliers")
public class AdminSupplierController {

    private final SupplierService supplierService;

    public AdminSupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SupplierResponse>>> getAllSuppliers() {
        List<SupplierResponse> response = supplierService.getAllSuppliers();
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
