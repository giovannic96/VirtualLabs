package it.polito.ai.virtualLabs.services.exceptions.team;

public class TeamProposalAlreadyCreatedException extends TeamServiceException {
    public TeamProposalAlreadyCreatedException(String message) {
        super(message + " Error type: TEAM PROPOSAL already created");
    }
}
