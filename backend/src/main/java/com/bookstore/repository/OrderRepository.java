package com.bookstore.repository;

import com.bookstore.entity.Order;
import com.bookstore.entity.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    @EntityGraph(attributePaths = {"customer", "details.book"})
    Optional<Order> findWithDetailsById(Long id);

    @EntityGraph(attributePaths = {"customer", "details.book"})
    Optional<Order> findWithDetailsByIdAndCustomerId(Long id, Long customerId);

    Optional<Order> findByOrderCode(String orderCode);

    Page<Order> findByCustomerIdOrderByCreatedAtDesc(Long customerId, Pageable pageable);

    @Query("SELECT o FROM Order o WHERE " +
           "(:status IS NULL OR o.status = :status) AND " +
           "(:keyword IS NULL OR LOWER(o.orderCode) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(o.recipientName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(o.recipientPhone) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Order> searchOrders(
        @Param("keyword") String keyword,
        @Param("status") OrderStatus status,
        Pageable pageable
    );

    long countByStatus(OrderStatus status);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status = :status")
    BigDecimal sumTotalRevenueByStatus(@Param("status") OrderStatus status);

    @EntityGraph(attributePaths = {"customer"})
    List<Order> findTop5ByOrderByCreatedAtDesc();
}
