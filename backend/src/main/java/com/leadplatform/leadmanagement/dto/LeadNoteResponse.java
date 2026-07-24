package com.leadplatform.leadmanagement.dto;

import java.time.LocalDateTime;

public record LeadNoteResponse(
        Long id,
        Long leadId,
        String content,
        Long createdById,
        String createdByName,
        LocalDateTime createdAt
) {
}