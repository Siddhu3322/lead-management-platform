package com.leadplatform.leadmanagement.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.leadplatform.leadmanagement.dto.LeadRequest;
import com.leadplatform.leadmanagement.dto.LeadResponse;
import com.leadplatform.leadmanagement.dto.PagedResponse;
import com.leadplatform.leadmanagement.entity.LeadSource;
import com.leadplatform.leadmanagement.entity.LeadStatus;
import com.leadplatform.leadmanagement.service.LeadService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/leads")
@RequiredArgsConstructor
public class LeadController {

    private final LeadService leadService;

    @PostMapping
    public ResponseEntity<LeadResponse> createLead(
            @Valid @RequestBody LeadRequest request,
        Authentication authentication) {

        LeadResponse response = 
                leadService.createLead(request, authentication);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<PagedResponse<LeadResponse>> getAllLeads(

            @RequestParam(required = false)
            String search,

            @RequestParam(required = false)
            LeadStatus status,

            @RequestParam(required = false)
            LeadSource source,

            @RequestParam(required = false)
            Long assignedToId,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size,

            @RequestParam(defaultValue = "createdAt")
            String sortBy,

            @RequestParam(defaultValue = "desc")
            String sortDirection) {

        PagedResponse<LeadResponse> response =
                leadService.getAllLeads(
                        search,
                        status,
                        source,
                        assignedToId,
                        page,
                        size,
                        sortBy,
                        sortDirection
                );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeadResponse> getLeadById(
            @PathVariable Long id) {

        LeadResponse response =
                leadService.getLeadById(id);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LeadResponse> updateLead(
            @PathVariable Long id,
            @Valid @RequestBody LeadRequest request,
            Authentication authentication) {

        LeadResponse response =
                leadService.updateLead(
                        id, 
                        request,
                        authentication
                );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLead(
            @PathVariable Long id,
            Authentication authentication) {

        leadService.deleteLead(id, authentication);

        return ResponseEntity.noContent().build();
    }
}