package it.polito.ai.virtualLabs.services.exceptions.version;

import it.polito.ai.virtualLabs.services.exceptions.team.TeamServiceException;

public class VersionNotFoundException extends TeamServiceException {
    public VersionNotFoundException(String message) {
        super(message + " Error type: VERSION NOT FOUND");
    }
}
