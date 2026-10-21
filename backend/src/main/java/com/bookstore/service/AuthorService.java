package com.bookstore.service;

import com.bookstore.dto.AuthorRequest;
import com.bookstore.dto.AuthorResponse;
import com.bookstore.dto.PageResponse;
import com.bookstore.entity.Author;
import com.bookstore.exception.ResourceNotFoundException;
import com.bookstore.repository.AuthorRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthorService {

    private final AuthorRepository authorRepository;

    public AuthorService(AuthorRepository authorRepository) {
        this.authorRepository = authorRepository;
    }

    @Transactional(readOnly = true)
    public List<AuthorResponse> getAllAuthorsList() {
        return authorRepository.findAllByOrderByNameAsc().stream()
            .map(AuthorResponse::fromEntity)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PageResponse<AuthorResponse> getAllAuthors(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        Page<Author> authorPage = authorRepository.searchAuthors(keyword, pageable);
        List<AuthorResponse> content = authorPage.getContent().stream()
            .map(AuthorResponse::fromEntity)
            .collect(Collectors.toList());
        return PageResponse.of(authorPage, content);
    }

    @Transactional(readOnly = true)
    public AuthorResponse getAuthorById(Long id) {
        Author author = authorRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tác giả với ID: " + id));
        return AuthorResponse.fromEntity(author);
    }

    @Transactional
    public AuthorResponse createAuthor(AuthorRequest request) {
        Author author = new Author();
        author.setName(request.getName().trim());
        author.setBiography(request.getBiography());

        Author saved = authorRepository.save(author);
        return AuthorResponse.fromEntity(saved);
    }

    @Transactional
    public AuthorResponse updateAuthor(Long id, AuthorRequest request) {
        Author author = authorRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tác giả với ID: " + id));

        author.setName(request.getName().trim());
        author.setBiography(request.getBiography());

        Author updated = authorRepository.save(author);
        return AuthorResponse.fromEntity(updated);
    }
}
