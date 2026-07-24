package com.leadplatform.leadmanagement.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.leadplatform.leadmanagement.dto.LeadActivityResponse;
import com.leadplatform.leadmanagement.service.LeadActivityService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/leads/{leadId}/activities")
@RequiredArgsConstructor
public class LeadActivityController {

    private final LeadActivityService leadActivityService;

    @GetMapping
    public ResponseEntity<List<LeadActivityResponse>> getActivities(
            @PathVariable Long leadId) {

        return ResponseEntity.ok(
                leadActivityService.getActivitiesByLeadId(leadId)
        );
    }
}