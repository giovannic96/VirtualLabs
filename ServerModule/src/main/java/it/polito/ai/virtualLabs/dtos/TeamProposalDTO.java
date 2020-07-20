package it.polito.ai.virtualLabs.dtos;

import it.polito.ai.virtualLabs.entities.TeamProposal;
import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;

@Data
public class TeamProposalDTO {
    @Id
    String id;
    LocalDateTime expiryDate;
    TeamProposal.TeamProposalStatus status;
}
