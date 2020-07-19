package it.polito.ai.virtualLabs.repositories;

import it.polito.ai.virtualLabs.entities.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

}
