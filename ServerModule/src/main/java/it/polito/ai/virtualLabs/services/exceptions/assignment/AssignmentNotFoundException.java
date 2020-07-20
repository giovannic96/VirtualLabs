package it.polito.ai.virtualLabs.services.exceptions.assignment;

import it.polito.ai.virtualLabs.services.exceptions.team.TeamServiceException;

public class AssignmentNotFoundException extends TeamServiceException {
    public AssignmentNotFoundException(String message) {
        super(message + " Error type: ASSIGNMENT NOT FOUND");
    }
}
