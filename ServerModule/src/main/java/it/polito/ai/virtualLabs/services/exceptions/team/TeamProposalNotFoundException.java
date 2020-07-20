package it.polito.ai.virtualLabs.services.exceptions.team;

public class TeamProposalNotFoundException extends TeamServiceException {
    public TeamProposalNotFoundException(String message) {
        super(message + " Error type: TEAM PROPOSAL NOT FOUND");
    }
}
