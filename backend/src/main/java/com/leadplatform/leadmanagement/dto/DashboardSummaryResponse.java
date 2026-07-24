package com.leadplatform.leadmanagement.dto;

public record DashboardSummaryResponse(
        long totalLeads,
        long newLeads,
        long contactedLeads,
        long qualifiedLeads,
        long wonLeads,
        long lostLeads,
        double conversionRate
) {
}