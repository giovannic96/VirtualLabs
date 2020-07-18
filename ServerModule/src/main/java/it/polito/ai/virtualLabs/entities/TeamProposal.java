package it.polito.ai.virtualLabs.entities;

import lombok.Data;

import javax.persistence.*;
import java.util.Calendar;

enum TeamProposalStatus {
    PENDING,
    CONFIRMED,
    REJECTED
}

@Data
@Entity
public class TeamProposal {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private String id;

    @Temporal(TemporalType.TIMESTAMP)
    private Calendar expiryDate;

    @Enumerated(EnumType.STRING)
    private TeamProposalStatus status;
}
