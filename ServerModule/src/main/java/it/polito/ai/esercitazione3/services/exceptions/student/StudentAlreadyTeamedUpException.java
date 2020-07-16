package it.polito.ai.esercitazione3.services.exceptions.student;

import it.polito.ai.esercitazione3.services.exceptions.team.TeamServiceException;

public class StudentAlreadyTeamedUpException extends TeamServiceException {
    public StudentAlreadyTeamedUpException(String message) {
        super(message + " Error type: STUDENT ALREADY TEAMED UP");
    }
}