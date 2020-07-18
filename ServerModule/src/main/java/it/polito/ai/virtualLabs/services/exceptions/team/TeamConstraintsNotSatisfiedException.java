package it.polito.ai.virtualLabs.services.exceptions.team;

public class TeamConstraintsNotSatisfiedException extends TeamServiceException{
    public TeamConstraintsNotSatisfiedException(String message) {
        super(message + " Error type: TEAM CONSTRAINTS NOT SATISFIED");
    }
}
