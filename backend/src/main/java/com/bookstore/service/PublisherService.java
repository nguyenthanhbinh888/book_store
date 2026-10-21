package com.bookstore.service;

import com.bookstore.dto.PageResponse;
import com.bookstore.dto.PublisherRequest;
import com.bookstore.dto.PublisherResponse;
import com.bookstore.entity.Publisher;
import com.bookstore.exception.ResourceNotFoundException;
import com.bookstore.repository.PublisherRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PublisherService {

    private final PublisherRepository publisherRepository;

    public PublisherService(PublisherRepository publisherRepository) {
        this.publisherRepository = publisherRepository;
    }

    @Transactional(readOnly = true)
    public List<PublisherResponse> getAllPublishersList() {
        return publisherRepository.findAllByOrderByNameAsc().stream()
            .map(PublisherResponse::fromEntity)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PageResponse<PublisherResponse> getAllPublishers(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        Page<Publisher> publisherPage = publisherRepository.searchPublishers(keyword, pageable);
        List<PublisherResponse> content = publisherPage.getContent().stream()
            .map(PublisherResponse::fromEntity)
            .collect(Collectors.toList());
        return PageResponse.of(publisherPage, content);
    }

    @Transactional(readOnly = true)
    public PublisherResponse getPublisherById(Long id) {
        Publisher publisher = publisherRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhà xuất bản với ID: " + id));
        return PublisherResponse.fromEntity(publisher);
    }

    @Transactional
    public PublisherResponse createPublisher(PublisherRequest request) {
        Publisher publisher = new Publisher();
        publisher.setName(request.getName().trim());
        publisher.setAddress(request.getAddress());
        publisher.setPhone(request.getPhone());

        Publisher saved = publisherRepository.save(publisher);
        return PublisherResponse.fromEntity(saved);
    }

    @Transactional
    public PublisherResponse updatePublisher(Long id, PublisherRequest request) {
        Publisher publisher = publisherRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhà xuất bản với ID: " + id));

        publisher.setName(request.getName().trim());
        publisher.setAddress(request.getAddress());
        publisher.setPhone(request.getPhone());

        Publisher updated = publisherRepository.save(publisher);
        return PublisherResponse.fromEntity(updated);
    }
}
