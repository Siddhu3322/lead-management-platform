package com.leadplatform.leadmanagement.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.leadplatform.leadmanagement.dto.DashboardSummaryResponse;
import com.leadplatform.leadmanagement.entity.LeadStatus;
import com.leadplatform.leadmanagement.repository.LeadRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final LeadRepository leadRepository;

    public DashboardSummaryResponse getSummary() {

        long totalLeads = leadRepository.count();
        long newLeads = leadRepository.countByStatus(LeadStatus.NEW);
        long contactedLeads =
                leadRepository.countByStatus(LeadStatus.CONTACTED);
        long qualifiedLeads =
                leadRepository.countByStatus(LeadStatus.QUALIFIED);
        long wonLeads = leadRepository.countByStatus(LeadStatus.WON);
        long lostLeads = leadRepository.countByStatus(LeadStatus.LOST);

        double conversionRate = totalLeads == 0
                ? 0.0
                : (wonLeads * 100.0) / totalLeads;

        conversionRate =
                Math.round(conversionRate * 100.0) / 100.0;

        return new DashboardSummaryResponse(
                totalLeads,
                newLeads,
                contactedLeads,
                qualifiedLeads,
                wonLeads,
                lostLeads,
                conversionRate
        );
    }
}