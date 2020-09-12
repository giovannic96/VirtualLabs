package it.polito.ai.virtualLabs.services.exceptions.team;

public class TeamServiceException extends RuntimeException {
    public TeamServiceException(String message) {
        System.err.println(message);
    }
}
