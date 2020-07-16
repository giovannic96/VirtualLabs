package it.polito.ai.esercitazione3.services.exceptions.team;

public class TeamServiceException extends RuntimeException {
    public TeamServiceException(String message) {
        super("[TeamServiceException] " + message);
    }
}
