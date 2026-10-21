package com.bookstore.service;

import com.bookstore.dto.SupplierResponse;
import com.bookstore.repository.SupplierRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    @Transactional(readOnly = true)
    public List<SupplierResponse> getAllSuppliers() {
        return supplierRepository.findAllByOrderByNameAsc().stream()
            .map(SupplierResponse::fromEntity)
            .collect(Collectors.toList());
    }
}
