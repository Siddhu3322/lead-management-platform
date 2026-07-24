package com.leadplatform.leadmanagement.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.leadplatform.leadmanagement.entity.LeadNote;

public interface LeadNoteRepository extends JpaRepository<LeadNote, Long> {

    List<LeadNote> findByLeadIdOrderByCreatedAtDesc(Long leadId);
}