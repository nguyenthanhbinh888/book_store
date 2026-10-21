package com.bookstore;

import com.bookstore.dto.LoginRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthAndCatalogIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testPublicBooksListing() throws Exception {
        mockMvc.perform(get("/api/v1/books"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.content").isArray())
            .andExpect(jsonPath("$.data.content[0].costPrice").doesNotExist()); // Đảm bảo không lộ giá nhập
    }

    @Test
    void testPublicCategoriesListing() throws Exception {
        mockMvc.perform(get("/api/v1/categories"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    void testAdminLoginSuccess() throws Exception {
        LoginRequest loginRequest = new LoginRequest("admin@bookstore.local", "Admin@123456");

        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.token").isNotEmpty())
            .andExpect(jsonPath("$.data.user.role").value("ADMIN"))
            .andExpect(jsonPath("$.data.user.passwordHash").doesNotExist());
    }

    @Test
    void testCustomerLoginSuccess() throws Exception {
        LoginRequest loginRequest = new LoginRequest("customer@bookstore.local", "Customer@123456");

        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.token").isNotEmpty())
            .andExpect(jsonPath("$.data.user.role").value("CUSTOMER"));
    }

    @Test
    void testLoginWithWrongPasswordFails() throws Exception {
        LoginRequest loginRequest = new LoginRequest("admin@bookstore.local", "WrongPassword");

        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void testAdminEndpointDeniedForUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/v1/admin/dashboard/summary"))
            .andExpect(status().isForbidden());
    }
}
