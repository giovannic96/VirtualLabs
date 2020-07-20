package it.polito.ai.virtualLabs.repositories;

import it.polito.ai.virtualLabs.entities.TeamProposal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeamProposalRepository extends JpaRepository<TeamProposal, Long> {

}
