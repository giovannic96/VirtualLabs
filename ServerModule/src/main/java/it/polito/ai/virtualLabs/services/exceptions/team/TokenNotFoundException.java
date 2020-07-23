package it.polito.ai.virtualLabs.services.exceptions.team;

public class TokenNotFoundException extends TeamServiceException {
    public TokenNotFoundException(String message) {
        super(message + " Error type: TOKEN NOT FOUND");
    }
}
