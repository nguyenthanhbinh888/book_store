package com.bookstore.repository;

import com.bookstore.entity.InventoryTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryTransactionRepository extends JpaRepository<InventoryTransaction, Long> {

    @EntityGraph(attributePaths = {"book", "createdBy"})
    Page<InventoryTransaction> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @EntityGraph(attributePaths = {"book", "createdBy"})
    @Query("SELECT it FROM InventoryTransaction it WHERE " +
           "(:bookId IS NULL OR it.book.id = :bookId) AND " +
           "(:type IS NULL OR it.transactionType = :type) " +
           "ORDER BY it.createdAt DESC")
    Page<InventoryTransaction> searchTransactions(
        @Param("bookId") Long bookId,
        @Param("type") String type,
        Pageable pageable
    );

    List<InventoryTransaction> findByBookIdOrderByCreatedAtDesc(Long bookId);
}
