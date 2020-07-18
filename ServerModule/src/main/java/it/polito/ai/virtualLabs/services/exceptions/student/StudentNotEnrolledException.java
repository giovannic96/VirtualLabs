package it.polito.ai.virtualLabs.services.exceptions.student;

import it.polito.ai.virtualLabs.services.exceptions.team.TeamServiceException;

public class StudentNotEnrolledException extends TeamServiceException {
    public StudentNotEnrolledException(String message) {
        super(message + " Error type: STUDENT NOT ENROLLED");
    }
}
