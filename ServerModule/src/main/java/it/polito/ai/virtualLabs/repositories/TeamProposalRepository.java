package it.polito.ai.virtualLabs.repositories;

import it.polito.ai.virtualLabs.entities.TeamProposal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TeamProposalRepository extends JpaRepository<TeamProposal, Long> {
    Optional<TeamProposal> findByTeamNameAndCourseName(String teamName, String courseName);
}
