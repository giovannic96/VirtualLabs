package it.polito.ai.virtualLabs.repositories;

import it.polito.ai.virtualLabs.entities.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    Optional<Report> findReportByAssignmentIdAndOwnerId(Long assignmentId, String studentId);
}
