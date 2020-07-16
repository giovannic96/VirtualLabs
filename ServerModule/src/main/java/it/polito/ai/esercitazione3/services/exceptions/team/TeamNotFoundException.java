package it.polito.ai.esercitazione3.services.exceptions.team;

public class TeamNotFoundException extends TeamServiceException {
    public TeamNotFoundException(String message) {
        super(message + " Error type: TEAM NOT FOUND");
    }
}
