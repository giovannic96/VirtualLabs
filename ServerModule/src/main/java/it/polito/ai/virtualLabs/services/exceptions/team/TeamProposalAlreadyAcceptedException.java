package it.polito.ai.virtualLabs.services.exceptions.team;

public class TeamProposalAlreadyAcceptedException extends TeamServiceException {
    public TeamProposalAlreadyAcceptedException(String message) {
        super(message + " Error type: TEAM PROPOSAL already accepted");
    }
}
