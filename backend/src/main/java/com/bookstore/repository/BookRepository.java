package com.bookstore.repository;

import com.bookstore.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    @EntityGraph(attributePaths = {"category", "publisher", "authors"})
    Optional<Book> findWithDetailsById(Long id);

    boolean existsByIsbn(String isbn);
    boolean existsByIsbnAndIdNot(String isbn, Long id);

    @Query("SELECT DISTINCT b FROM Book b " +
           "LEFT JOIN b.category c " +
           "LEFT JOIN b.authors a " +
           "WHERE (:active IS NULL OR b.active = :active) " +
           "AND (:categoryId IS NULL OR c.id = :categoryId) " +
           "AND (:keyword IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "     OR LOWER(b.isbn) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "     OR LOWER(a.name) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Book> searchBooks(
        @Param("keyword") String keyword,
        @Param("categoryId") Long categoryId,
        @Param("active") Boolean active,
        Pageable pageable
    );

    long countByActiveTrue();

    @Query("SELECT b FROM Book b WHERE b.active = true AND b.stockQuantity <= :threshold ORDER BY b.stockQuantity ASC")
    List<Book> findLowStockBooks(@Param("threshold") int threshold, Pageable pageable);
}
