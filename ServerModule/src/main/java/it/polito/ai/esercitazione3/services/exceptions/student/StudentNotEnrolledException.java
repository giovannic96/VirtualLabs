package it.polito.ai.esercitazione3.services.exceptions.student;

import it.polito.ai.esercitazione3.services.exceptions.team.TeamServiceException;

public class StudentNotEnrolledException extends TeamServiceException {
    public StudentNotEnrolledException(String message) {
        super(message + " Error type: STUDENT NOT ENROLLED");
    }
}