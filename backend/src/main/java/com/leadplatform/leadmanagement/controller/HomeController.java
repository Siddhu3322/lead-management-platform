package com.leadplatform.leadmanagement.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, String> home() {
        return Map.of(
                "message",
                "Lead Management Platform API is running"
        );
    }

    @GetMapping("/api/test")
    public Map<String, String> protectedTest() {
        return Map.of(
                "message",
                "This is a protected endpoint"
        );
    }
}