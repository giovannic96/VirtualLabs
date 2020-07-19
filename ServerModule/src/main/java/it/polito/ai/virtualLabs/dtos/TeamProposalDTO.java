package it.polito.ai.virtualLabs.dtos;

import it.polito.ai.virtualLabs.entities.TeamProposal;
import lombok.Data;
import javax.persistence.*;
import java.util.Calendar;

@Data
public class TeamProposalDTO {
    @Id
    String id;
    Calendar expiryDate;
    TeamProposal.TeamProposalStatus status;
}
