package com.leadplatform.leadmanagement.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.leadplatform.leadmanagement.dto.LeadActivityResponse;
import com.leadplatform.leadmanagement.entity.ActivityType;
import com.leadplatform.leadmanagement.entity.Lead;
import com.leadplatform.leadmanagement.entity.LeadActivity;
import com.leadplatform.leadmanagement.entity.User;
import com.leadplatform.leadmanagement.repository.LeadActivityRepository;
import com.leadplatform.leadmanagement.repository.LeadRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class LeadActivityService {

    private final LeadActivityRepository leadActivityRepository;
    private final LeadRepository leadRepository;

    public void recordActivity(
            Lead lead,
            ActivityType activityType,
            String description,
            User performedBy) {

        LeadActivity activity = LeadActivity.builder()
                .lead(lead)
                .activityType(activityType)
                .description(description)
                .performedBy(performedBy)
                .build();

        leadActivityRepository.save(activity);
    }

    @Transactional(readOnly = true)
    public List<LeadActivityResponse> getActivitiesByLeadId(Long leadId) {

        if (!leadRepository.existsById(leadId)) {
            throw new IllegalArgumentException(
                    "Lead not found with ID: " + leadId
            );
        }

        return leadActivityRepository
                .findByLeadIdOrderByCreatedAtDesc(leadId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private LeadActivityResponse mapToResponse(LeadActivity activity) {

        Long performedById = null;
        String performedByName = null;

        if (activity.getPerformedBy() != null) {
            performedById = activity.getPerformedBy().getId();
            performedByName = activity.getPerformedBy().getName();
        }

        return new LeadActivityResponse(
                activity.getId(),
                activity.getLead().getId(),
                activity.getActivityType(),
                activity.getDescription(),
                performedById,
                performedByName,
                activity.getCreatedAt()
        );
    }
}