package com.leadplatform.leadmanagement.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.leadplatform.leadmanagement.entity.LeadActivity;

public interface LeadActivityRepository
        extends JpaRepository<LeadActivity, Long> {

    List<LeadActivity> findByLeadIdOrderByCreatedAtDesc(Long leadId);
}