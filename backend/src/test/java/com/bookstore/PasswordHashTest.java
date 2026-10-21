package com.bookstore;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHashTest {
    @Test
    void printHashes() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        System.out.println("ADMIN_HASH=" + encoder.encode("Admin@123456"));
        System.out.println("CUSTOMER_HASH=" + encoder.encode("Customer@123456"));
    }
}
