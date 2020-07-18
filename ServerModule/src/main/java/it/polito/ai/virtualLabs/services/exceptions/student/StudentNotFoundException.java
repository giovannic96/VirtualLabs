package it.polito.ai.virtualLabs.services.exceptions.student;

import it.polito.ai.virtualLabs.services.exceptions.team.TeamServiceException;

public class StudentNotFoundException extends TeamServiceException {
    public StudentNotFoundException(String message) {
        super(message + " Error type: STUDENT NOT FOUND");
    }
}
