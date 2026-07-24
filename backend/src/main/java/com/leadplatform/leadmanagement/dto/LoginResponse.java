package com.leadplatform.leadmanagement.dto;

import com.leadplatform.leadmanagement.entity.Role;

public record LoginResponse(
        String token,
        String tokenType,
        Long userId,
        String name,
        String email,
        Role role
) {
}