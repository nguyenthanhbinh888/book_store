package com.bookstore.service;

import com.bookstore.dto.*;
import com.bookstore.entity.*;
import com.bookstore.exception.BadRequestException;
import com.bookstore.exception.ConflictException;
import com.bookstore.exception.ResourceNotFoundException;
import com.bookstore.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
    private final PublisherRepository publisherRepository;
    private final AuthorRepository authorRepository;
    private final InventoryTransactionRepository inventoryTransactionRepository;

    public BookService(
        BookRepository bookRepository,
        CategoryRepository categoryRepository,
        PublisherRepository publisherRepository,
        AuthorRepository authorRepository,
        InventoryTransactionRepository inventoryTransactionRepository
    ) {
        this.bookRepository = bookRepository;
        this.categoryRepository = categoryRepository;
        this.publisherRepository = publisherRepository;
        this.authorRepository = authorRepository;
        this.inventoryTransactionRepository = inventoryTransactionRepository;
    }

    // -------------------------------------------------------------
    // KHU VỰC CÔNG KHAI (KHÁCH HÀNG) - Tuyệt đối không trả costPrice
    // -------------------------------------------------------------

    @Transactional(readOnly = true)
    public PageResponse<BookResponse> getPublicBooks(
        String keyword,
        Long categoryId,
        int page,
        int size,
        String sortBy,
        String sortDir
    ) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir.toUpperCase()), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Book> bookPage = bookRepository.searchBooks(
            StringUtils.hasText(keyword) ? keyword.trim() : null,
            categoryId,
            true, // Chỉ lấy sách đang kinh doanh (active = true)
            pageable
        );

        List<BookResponse> content = bookPage.getContent().stream()
            .map(BookResponse::fromEntity)
            .collect(Collectors.toList());

        return PageResponse.of(bookPage, content);
    }

    @Transactional(readOnly = true)
    public BookResponse getPublicBookById(Long id) {
        Book book = bookRepository.findWithDetailsById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sách với ID: " + id));

        if (!Boolean.TRUE.equals(book.getActive())) {
            throw new ResourceNotFoundException("Sách này hiện đã ngừng kinh doanh.");
        }

        return BookResponse.fromEntity(book);
    }

    // -------------------------------------------------------------
    // KHU VỰC QUẢN TRỊ (ADMIN)
    // -------------------------------------------------------------

    @Transactional(readOnly = true)
    public PageResponse<AdminBookResponse> getAdminBooks(
        String keyword,
        Long categoryId,
        Boolean active,
        int page,
        int size,
        String sortBy,
        String sortDir
    ) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir.toUpperCase()), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Book> bookPage = bookRepository.searchBooks(
            StringUtils.hasText(keyword) ? keyword.trim() : null,
            categoryId,
            active,
            pageable
        );

        List<AdminBookResponse> content = bookPage.getContent().stream()
            .map(AdminBookResponse::fromEntity)
            .collect(Collectors.toList());

        return PageResponse.of(bookPage, content);
    }

    @Transactional(readOnly = true)
    public AdminBookResponse getAdminBookById(Long id) {
        Book book = bookRepository.findWithDetailsById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sách với ID: " + id));
        return AdminBookResponse.fromEntity(book);
    }

    @Transactional
    public AdminBookResponse createBook(BookRequest request, User currentUser) {
        if (StringUtils.hasText(request.getIsbn()) && bookRepository.existsByIsbn(request.getIsbn().trim())) {
            throw new ConflictException("Mã ISBN đã tồn tại cho một cuốn sách khác.");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với ID: " + request.getCategoryId()));

        Publisher publisher = null;
        if (request.getPublisherId() != null) {
            publisher = publisherRepository.findById(request.getPublisherId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhà xuất bản với ID: " + request.getPublisherId()));
        }

        Book book = new Book();
        book.setIsbn(StringUtils.hasText(request.getIsbn()) ? request.getIsbn().trim() : null);
        book.setTitle(request.getTitle().trim());
        book.setDescription(request.getDescription());
        book.setCategory(category);
        book.setPublisher(publisher);
        book.setSellingPrice(request.getSellingPrice());
        book.setCostPrice(request.getCostPrice());
        book.setStockQuantity(request.getStockQuantity() != null ? request.getStockQuantity() : 0);
        book.setCoverImageUrl(request.getCoverImageUrl());
        book.setActive(request.getActive() != null ? request.getActive() : true);

        if (request.getAuthorIds() != null && !request.getAuthorIds().isEmpty()) {
            List<Author> authors = authorRepository.findAllById(request.getAuthorIds());
            book.setAuthors(new HashSet<>(authors));
        }

        Book saved = bookRepository.save(book);

        // Ghi nhận biến động kho ban đầu nếu số lượng > 0
        if (saved.getStockQuantity() > 0) {
            InventoryTransaction it = new InventoryTransaction();
            it.setBook(saved);
            it.setTransactionType("ADJUSTMENT");
            it.setReferenceType("INITIAL_STOCK");
            it.setQuantityChange(saved.getStockQuantity());
            it.setNote("Khởi tạo tồn kho khi tạo mới sách");
            it.setCreatedBy(currentUser);
            inventoryTransactionRepository.save(it);
        }

        return AdminBookResponse.fromEntity(saved);
    }

    @Transactional
    public AdminBookResponse updateBook(Long id, BookRequest request) {
        Book book = bookRepository.findWithDetailsById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sách với ID: " + id));

        if (StringUtils.hasText(request.getIsbn()) && bookRepository.existsByIsbnAndIdNot(request.getIsbn().trim(), id)) {
            throw new ConflictException("Mã ISBN đã tồn tại cho một cuốn sách khác.");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với ID: " + request.getCategoryId()));

        Publisher publisher = null;
        if (request.getPublisherId() != null) {
            publisher = publisherRepository.findById(request.getPublisherId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhà xuất bản với ID: " + request.getPublisherId()));
        }

        book.setIsbn(StringUtils.hasText(request.getIsbn()) ? request.getIsbn().trim() : null);
        book.setTitle(request.getTitle().trim());
        book.setDescription(request.getDescription());
        book.setCategory(category);
        book.setPublisher(publisher);
        book.setSellingPrice(request.getSellingPrice());
        book.setCostPrice(request.getCostPrice());
        if (request.getActive() != null) {
            book.setActive(request.getActive());
        }
        book.setCoverImageUrl(request.getCoverImageUrl());

        if (request.getAuthorIds() != null) {
            List<Author> authors = authorRepository.findAllById(request.getAuthorIds());
            book.setAuthors(new HashSet<>(authors));
        }

        Book updated = bookRepository.save(book);
        return AdminBookResponse.fromEntity(updated);
    }

    @Transactional
    public AdminBookResponse updateStatus(Long id, Boolean active) {
        Book book = bookRepository.findWithDetailsById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sách với ID: " + id));

        book.setActive(active);
        Book updated = bookRepository.save(book);
        return AdminBookResponse.fromEntity(updated);
    }
}
