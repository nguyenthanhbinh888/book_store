package com.bookstore.repository;

import com.bookstore.entity.PurchaseReceiptDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PurchaseReceiptDetailRepository extends JpaRepository<PurchaseReceiptDetail, Long> {
    List<PurchaseReceiptDetail> findByPurchaseReceiptId(Long purchaseReceiptId);
}
