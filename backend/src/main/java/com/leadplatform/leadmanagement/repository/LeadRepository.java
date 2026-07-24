package com.leadplatform.leadmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.leadplatform.leadmanagement.entity.Lead;
import com.leadplatform.leadmanagement.entity.LeadStatus;

public interface LeadRepository extends
        JpaRepository<Lead, Long>,
        JpaSpecificationExecutor<Lead> {

    long countByStatus(LeadStatus status);
}