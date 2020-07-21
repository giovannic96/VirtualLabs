package it.polito.ai.virtualLabs.dtos;

import it.polito.ai.virtualLabs.entities.TeamProposal;
import lombok.Data;
import org.springframework.hateoas.RepresentationModel;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
public class TeamProposalDTO extends RepresentationModel<TeamProposalDTO> {
    @Id
    Long id;
    LocalDateTime expiryDate;
    String teamName;
    TeamProposal.TeamProposalStatus status;
    String statusDesc;
    int missing;
}
