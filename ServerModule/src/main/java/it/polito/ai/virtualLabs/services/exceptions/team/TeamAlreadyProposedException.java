package it.polito.ai.virtualLabs.services.exceptions.team;

public class TeamAlreadyProposedException extends TeamServiceException {
    public TeamAlreadyProposedException(String message) {
        super(message + " Error type: TEAM PROPOSAL already submitted");
    }
}
