package com.leadplatform.leadmanagement.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.leadplatform.leadmanagement.dto.LeadNoteRequest;
import com.leadplatform.leadmanagement.dto.LeadNoteResponse;
import com.leadplatform.leadmanagement.service.LeadNoteService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/leads/{leadId}/notes")
@RequiredArgsConstructor
public class LeadNoteController {

    private final LeadNoteService leadNoteService;

    @PostMapping
    public ResponseEntity<LeadNoteResponse> createNote(
            @PathVariable Long leadId,
            @Valid @RequestBody LeadNoteRequest request,
            Authentication authentication) {

        LeadNoteResponse response =
                leadNoteService.createNote(
                        leadId,
                        request,
                        authentication
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<LeadNoteResponse>> getNotes(
            @PathVariable Long leadId) {

        return ResponseEntity.ok(
                leadNoteService.getNotesByLeadId(leadId)
        );
    }

    @DeleteMapping("/{noteId}")
    public ResponseEntity<Void> deleteNote(
            @PathVariable Long leadId,
            @PathVariable Long noteId,
            Authentication authentication) {

        leadNoteService.deleteNote(
                leadId,
                noteId,
                authentication
        );

        return ResponseEntity.noContent().build();
    }
}