package com.leadplatform.leadmanagement.service;

import java.util.List;
import java.util.Objects;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.leadplatform.leadmanagement.dto.LeadRequest;
import com.leadplatform.leadmanagement.dto.LeadResponse;
import com.leadplatform.leadmanagement.dto.PagedResponse;
import com.leadplatform.leadmanagement.entity.ActivityType;
import com.leadplatform.leadmanagement.entity.Lead;
import com.leadplatform.leadmanagement.entity.LeadSource;
import com.leadplatform.leadmanagement.entity.LeadStatus;
import com.leadplatform.leadmanagement.entity.User;
import com.leadplatform.leadmanagement.repository.LeadRepository;
import com.leadplatform.leadmanagement.repository.LeadSpecification;
import com.leadplatform.leadmanagement.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class LeadService {

    private final LeadRepository leadRepository;
    private final UserRepository userRepository;
    private final LeadActivityService leadActivityService;

    public LeadResponse createLead(
            LeadRequest request,
            Authentication authentication) {

        User assignedUser = getAssignedUser(request.assignedToId());
        User currentUser = findCurrentUser(authentication);

        Lead lead = Lead.builder()
                .fullName(request.fullName().trim())
                .email(request.email().trim().toLowerCase())
                .phone(trimOrNull(request.phone()))
                .company(trimOrNull(request.company()))
                .status(
                        request.status() != null
                                ? request.status()
                                : LeadStatus.NEW
                )
                .source(
                        request.source() != null
                                ? request.source()
                                : LeadSource.WEBSITE
                )
                .assignedTo(assignedUser)
                .build();

        Lead savedLead = leadRepository.save(lead);

        leadActivityService.recordActivity(
                savedLead,
                ActivityType.LEAD_CREATED,
                "Lead created",
                currentUser
        );

        if (assignedUser != null) {
            leadActivityService.recordActivity(
                    savedLead,
                    ActivityType.ASSIGNMENT_CHANGED,
                    "Lead assigned to " + assignedUser.getName(),
                    currentUser
            );
        }

        return mapToResponse(savedLead);
    }

    @Transactional(readOnly = true)
    public PagedResponse<LeadResponse> getAllLeads(
            String search,
            LeadStatus status,
            LeadSource source,
            Long assignedToId,
            int page,
            int size,
            String sortBy,
            String sortDirection) {

        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 100);

        String safeSortBy = resolveSortField(sortBy);

        Sort.Direction direction =
                "asc".equalsIgnoreCase(sortDirection)
                        ? Sort.Direction.ASC
                        : Sort.Direction.DESC;

        Pageable pageable = PageRequest.of(
                safePage,
                safeSize,
                Sort.by(direction, safeSortBy)
        );

        Specification<Lead> specification =
                Specification.where(
                                LeadSpecification.hasSearchTerm(search)
                        )
                        .and(LeadSpecification.hasStatus(status))
                        .and(LeadSpecification.hasSource(source))
                        .and(LeadSpecification.isAssignedTo(assignedToId));

        Page<Lead> leadPage =
                leadRepository.findAll(specification, pageable);

        List<LeadResponse> content = leadPage
                .getContent()
                .stream()
                .map(this::mapToResponse)
                .toList();

        return new PagedResponse<>(
                content,
                leadPage.getNumber(),
                leadPage.getSize(),
                leadPage.getTotalElements(),
                leadPage.getTotalPages(),
                leadPage.isFirst(),
                leadPage.isLast()
        );
    }

    @Transactional(readOnly = true)
    public LeadResponse getLeadById(Long id) {
        Lead lead = findLeadById(id);
        return mapToResponse(lead);
    }

    public LeadResponse updateLead(
            Long id,
            LeadRequest request,
            Authentication authentication) {

        Lead lead = findLeadById(id);
        User currentUser = findCurrentUser(authentication);
        User assignedUser = getAssignedUser(request.assignedToId());

        LeadStatus oldStatus = lead.getStatus();

        Long oldAssignedToId =
                lead.getAssignedTo() == null
                        ? null
                        : lead.getAssignedTo().getId();

        lead.setFullName(request.fullName().trim());
        lead.setEmail(request.email().trim().toLowerCase());
        lead.setPhone(trimOrNull(request.phone()));
        lead.setCompany(trimOrNull(request.company()));

        if (request.status() != null) {
            lead.setStatus(request.status());
        }

        if (request.source() != null) {
            lead.setSource(request.source());
        }

        lead.setAssignedTo(assignedUser);

        Lead updatedLead = leadRepository.save(lead);

        leadActivityService.recordActivity(
                updatedLead,
                ActivityType.LEAD_UPDATED,
                "Lead details updated",
                currentUser
        );

        if (!Objects.equals(oldStatus, updatedLead.getStatus())) {
            leadActivityService.recordActivity(
                    updatedLead,
                    ActivityType.STATUS_CHANGED,
                    "Status changed from "
                            + oldStatus
                            + " to "
                            + updatedLead.getStatus(),
                    currentUser
            );
        }

        Long newAssignedToId =
                updatedLead.getAssignedTo() == null
                        ? null
                        : updatedLead.getAssignedTo().getId();

        if (!Objects.equals(
                oldAssignedToId,
                newAssignedToId
        )) {

            String assignedToName =
                    updatedLead.getAssignedTo() == null
                            ? "Unassigned"
                            : updatedLead
                                    .getAssignedTo()
                                    .getName();

            leadActivityService.recordActivity(
                    updatedLead,
                    ActivityType.ASSIGNMENT_CHANGED,
                    "Assignment changed to "
                            + assignedToName,
                    currentUser
            );
        }

        return mapToResponse(updatedLead);
    }

    public void deleteLead(
            Long id,
            Authentication authentication) {

        Lead lead = findLeadById(id);

        /*
         * Do not create a LEAD_DELETED activity here.
         *
         * The activity would reference the Lead entity that is
         * immediately deleted, which causes Hibernate's
         * TransientPropertyValueException.
         */
        leadRepository.delete(lead);
        leadRepository.flush();
    }

    private Lead findLeadById(Long id) {

        return leadRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Lead not found with ID: " + id
                        )
                );
    }

    private User getAssignedUser(Long assignedToId) {

        if (assignedToId == null) {
            return null;
        }

        return userRepository.findById(assignedToId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Assigned user not found with ID: "
                                        + assignedToId
                        )
                );
    }

    private User findCurrentUser(
            Authentication authentication) {

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

    private LeadResponse mapToResponse(Lead lead) {

        Long assignedToId = null;
        String assignedToName = null;

        if (lead.getAssignedTo() != null) {
            assignedToId =
                    lead.getAssignedTo().getId();

            assignedToName =
                    lead.getAssignedTo().getName();
        }

        return new LeadResponse(
                lead.getId(),
                lead.getFullName(),
                lead.getEmail(),
                lead.getPhone(),
                lead.getCompany(),
                lead.getStatus(),
                lead.getSource(),
                assignedToId,
                assignedToName,
                lead.getCreatedAt(),
                lead.getUpdatedAt()
        );
    }

    private String resolveSortField(String sortBy) {

        if (sortBy == null || sortBy.isBlank()) {
            return "createdAt";
        }

        return switch (sortBy) {
            case "id",
                 "fullName",
                 "email",
                 "phone",
                 "company",
                 "status",
                 "source",
                 "createdAt",
                 "updatedAt" -> sortBy;

            default -> "createdAt";
        };
    }

    private String trimOrNull(String value) {

        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }
}