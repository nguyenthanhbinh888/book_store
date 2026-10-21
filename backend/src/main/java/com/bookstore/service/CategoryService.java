package com.bookstore.service;

import com.bookstore.dto.CategoryRequest;
import com.bookstore.dto.CategoryResponse;
import com.bookstore.dto.PageResponse;
import com.bookstore.entity.Category;
import com.bookstore.exception.ConflictException;
import com.bookstore.exception.ResourceNotFoundException;
import com.bookstore.repository.CategoryRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getActiveCategories() {
        return categoryRepository.findByActiveTrueOrderByNameAsc().stream()
            .map(CategoryResponse::fromEntity)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PageResponse<CategoryResponse> getAllCategories(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        Page<Category> categoryPage = categoryRepository.searchCategories(keyword, pageable);
        List<CategoryResponse> content = categoryPage.getContent().stream()
            .map(CategoryResponse::fromEntity)
            .collect(Collectors.toList());
        return PageResponse.of(categoryPage, content);
    }

    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với ID: " + id));
        return CategoryResponse.fromEntity(category);
    }

    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        if (categoryRepository.existsByNameIgnoreCase(request.getName().trim())) {
            throw new ConflictException("Tên danh mục đã tồn tại trong hệ thống.");
        }

        Category category = new Category();
        category.setName(request.getName().trim());
        category.setDescription(request.getDescription());
        category.setActive(request.getActive() != null ? request.getActive() : true);

        Category saved = categoryRepository.save(category);
        return CategoryResponse.fromEntity(saved);
    }

    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với ID: " + id));

        if (categoryRepository.existsByNameIgnoreCaseAndIdNot(request.getName().trim(), id)) {
            throw new ConflictException("Tên danh mục đã tồn tại ở bản ghi khác.");
        }

        category.setName(request.getName().trim());
        category.setDescription(request.getDescription());
        if (request.getActive() != null) {
            category.setActive(request.getActive());
        }

        Category updated = categoryRepository.save(category);
        return CategoryResponse.fromEntity(updated);
    }

    @Transactional
    public CategoryResponse updateStatus(Long id, Boolean active) {
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với ID: " + id));

        category.setActive(active);
        Category updated = categoryRepository.save(category);
        return CategoryResponse.fromEntity(updated);
    }
}
