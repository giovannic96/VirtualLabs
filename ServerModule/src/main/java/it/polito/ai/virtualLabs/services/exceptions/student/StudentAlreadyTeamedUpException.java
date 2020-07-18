package it.polito.ai.virtualLabs.services.exceptions.student;

import it.polito.ai.virtualLabs.services.exceptions.team.TeamServiceException;

public class StudentAlreadyTeamedUpException extends TeamServiceException {
    public StudentAlreadyTeamedUpException(String message) {
        super(message + " Error type: STUDENT ALREADY TEAMED UP");
    }
}
