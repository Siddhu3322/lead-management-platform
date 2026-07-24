package com.leadplatform.leadmanagement.dto;

import com.leadplatform.leadmanagement.entity.Role;

public record AuthResponse(
        Long id,
        String name,
        String email,
        Role role,
        String message
) {
}