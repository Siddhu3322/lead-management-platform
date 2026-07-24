package com.leadplatform.leadmanagement.dto;

import java.time.LocalDateTime;

import com.leadplatform.leadmanagement.entity.LeadSource;
import com.leadplatform.leadmanagement.entity.LeadStatus;

public record LeadResponse(
        Long id,
        String fullName,
        String email,
        String phone,
        String company,
        LeadStatus status,
        LeadSource source,
        Long assignedToId,
        String assignedToName,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}