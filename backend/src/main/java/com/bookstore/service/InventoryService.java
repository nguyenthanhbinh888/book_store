package com.bookstore.service;

import com.bookstore.dto.InventoryTransactionResponse;
import com.bookstore.dto.PageResponse;
import com.bookstore.entity.InventoryTransaction;
import com.bookstore.repository.InventoryTransactionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InventoryService {

    private final InventoryTransactionRepository inventoryTransactionRepository;

    public InventoryService(InventoryTransactionRepository inventoryTransactionRepository) {
        this.inventoryTransactionRepository = inventoryTransactionRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<InventoryTransactionResponse> getTransactions(Long bookId, String type, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<InventoryTransaction> transactionPage = inventoryTransactionRepository.searchTransactions(bookId, type, pageable);
        List<InventoryTransactionResponse> content = transactionPage.getContent().stream()
            .map(InventoryTransactionResponse::fromEntity)
            .collect(Collectors.toList());
        return PageResponse.of(transactionPage, content);
    }
}
