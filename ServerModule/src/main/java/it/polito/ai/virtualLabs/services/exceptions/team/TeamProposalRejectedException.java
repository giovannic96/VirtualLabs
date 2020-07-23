package it.polito.ai.virtualLabs.services.exceptions.team;

public class TeamProposalRejectedException extends TeamServiceException {
    public TeamProposalRejectedException(String message) {
        super(message + " Error type: TEAM PROPOSAL already rejected");
    }
}
