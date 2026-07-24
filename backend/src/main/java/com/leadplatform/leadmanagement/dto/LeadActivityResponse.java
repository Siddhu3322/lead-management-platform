package com.leadplatform.leadmanagement.dto;

import java.time.LocalDateTime;

import com.leadplatform.leadmanagement.entity.ActivityType;

public record LeadActivityResponse(
        Long id,
        Long leadId,
        ActivityType activityType,
        String description,
        Long performedById,
        String performedByName,
        LocalDateTime createdAt
) {
}