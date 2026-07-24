package com.leadplatform.leadmanagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LeadNoteRequest(

        @NotBlank(message = "Note content is required")
        @Size(max = 2000, message = "Note cannot exceed 2000 characters")
        String content
) {
}