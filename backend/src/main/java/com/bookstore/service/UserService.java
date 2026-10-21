package com.bookstore.service;

import com.bookstore.dto.PageResponse;
import com.bookstore.dto.UserResponse;
import com.bookstore.entity.User;
import com.bookstore.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<UserResponse> getCustomers(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<User> userPage = userRepository.searchUsers(
            StringUtils.hasText(keyword) ? keyword.trim() : null,
            pageable
        );
        List<UserResponse> content = userPage.getContent().stream()
            .map(UserResponse::fromEntity)
            .collect(Collectors.toList());
        return PageResponse.of(userPage, content);
    }
}
