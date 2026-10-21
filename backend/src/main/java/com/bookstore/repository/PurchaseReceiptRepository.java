package com.bookstore.repository;

import com.bookstore.entity.PurchaseReceipt;
import com.bookstore.entity.PurchaseReceiptStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PurchaseReceiptRepository extends JpaRepository<PurchaseReceipt, Long> {
    Optional<PurchaseReceipt> findByReceiptCode(String receiptCode);

    @EntityGraph(attributePaths = {"supplier", "createdBy", "details.book"})
    Optional<PurchaseReceipt> findWithDetailsById(Long id);

    @Query("SELECT pr FROM PurchaseReceipt pr WHERE " +
           "(:status IS NULL OR pr.status = :status) AND " +
           "(:keyword IS NULL OR LOWER(pr.receiptCode) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<PurchaseReceipt> searchReceipts(
        @Param("keyword") String keyword,
        @Param("status") PurchaseReceiptStatus status,
        Pageable pageable
    );
}
