package com.leadplatform.leadmanagement.repository;

import org.springframework.data.jpa.domain.Specification;

import com.leadplatform.leadmanagement.entity.Lead;
import com.leadplatform.leadmanagement.entity.LeadSource;
import com.leadplatform.leadmanagement.entity.LeadStatus;

public final class LeadSpecification {

    private LeadSpecification() {
    }

    public static Specification<Lead> hasSearchTerm(String search) {
        return (root, query, criteriaBuilder) -> {

            if (search == null || search.isBlank()) {
                return criteriaBuilder.conjunction();
            }

            String value = "%" + search.trim().toLowerCase() + "%";

            return criteriaBuilder.or(
                    criteriaBuilder.like(
                            criteriaBuilder.lower(root.get("fullName")),
                            value
                    ),
                    criteriaBuilder.like(
                            criteriaBuilder.lower(root.get("email")),
                            value
                    ),
                    criteriaBuilder.like(
                            criteriaBuilder.lower(root.get("company")),
                            value
                    )
            );
        };
    }

    public static Specification<Lead> hasStatus(LeadStatus status) {
        return (root, query, criteriaBuilder) -> {

            if (status == null) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.equal(root.get("status"), status);
        };
    }

    public static Specification<Lead> hasSource(LeadSource source) {
        return (root, query, criteriaBuilder) -> {

            if (source == null) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.equal(root.get("source"), source);
        };
    }

    public static Specification<Lead> isAssignedTo(Long assignedToId) {
        return (root, query, criteriaBuilder) -> {

            if (assignedToId == null) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.equal(
                    root.get("assignedTo").get("id"),
                    assignedToId
            );
        };
    }
}