package com.leadplatform.leadmanagement.service;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.leadplatform.leadmanagement.dto.LeadNoteRequest;
import com.leadplatform.leadmanagement.dto.LeadNoteResponse;
import com.leadplatform.leadmanagement.entity.ActivityType;
import com.leadplatform.leadmanagement.entity.Lead;
import com.leadplatform.leadmanagement.entity.LeadNote;
import com.leadplatform.leadmanagement.entity.User;
import com.leadplatform.leadmanagement.repository.LeadNoteRepository;
import com.leadplatform.leadmanagement.repository.LeadRepository;
import com.leadplatform.leadmanagement.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class LeadNoteService {

    private final LeadNoteRepository leadNoteRepository;
    private final LeadRepository leadRepository;
    private final UserRepository userRepository;
    private final LeadActivityService leadActivityService;

    public LeadNoteResponse createNote(
            Long leadId,
            LeadNoteRequest request,
            Authentication authentication) {

        Lead lead = findLeadById(leadId);
        User currentUser = findCurrentUser(authentication);

        LeadNote note = LeadNote.builder()
                .content(request.content().trim())
                .lead(lead)
                .createdBy(currentUser)
                .build();

        LeadNote savedNote = leadNoteRepository.save(note);

        leadActivityService.recordActivity(
                lead,
                ActivityType.NOTE_ADDED,
                "Note added: " + savedNote.getContent(),
                currentUser
        );

        return mapToResponse(savedNote);
    }

    @Transactional(readOnly = true)
    public List<LeadNoteResponse> getNotesByLeadId(Long leadId) {

        findLeadById(leadId);

        return leadNoteRepository
                .findByLeadIdOrderByCreatedAtDesc(leadId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public void deleteNote(
            Long leadId,
            Long noteId,
            Authentication authentication) {

        LeadNote note = leadNoteRepository.findById(noteId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Lead note not found with ID: " + noteId
                        )
                );

        if (!note.getLead().getId().equals(leadId)) {
            throw new IllegalArgumentException(
                    "This note does not belong to lead ID: " + leadId
            );
        }

        User currentUser = findCurrentUser(authentication);

        boolean isAdmin =
                currentUser.getRole() == com.leadplatform.leadmanagement.entity.Role.ADMIN;

        boolean isNoteOwner =
                note.getCreatedBy()
                        .getId()
                        .equals(currentUser.getId());

        if (!isAdmin && !isNoteOwner) {
            throw new IllegalArgumentException(
                    "You are not allowed to delete this note"
            );
        }

        leadActivityService.recordActivity(
                note.getLead(),
                ActivityType.NOTE_DELETED,
                "Note deleted: " + note.getContent(),
                currentUser
        );

        leadNoteRepository.delete(note);
    }

    private Lead findLeadById(Long leadId) {

        return leadRepository.findById(leadId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Lead not found with ID: " + leadId
                        )
                );
    }

    private User findCurrentUser(Authentication authentication) {

        if (authentication == null
                || authentication.getName() == null
                || authentication.getName().isBlank()) {

            throw new IllegalArgumentException(
                    "Authenticated user could not be identified"
            );
        }

        String email = authentication
                .getName()
                .trim()
                .toLowerCase();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Authenticated user not found"
                        )
                );
    }

    private LeadNoteResponse mapToResponse(LeadNote note) {

        return new LeadNoteResponse(
                note.getId(),
                note.getLead().getId(),
                note.getContent(),
                note.getCreatedBy().getId(),
                note.getCreatedBy().getName(),
                note.getCreatedAt()
        );
    }
}