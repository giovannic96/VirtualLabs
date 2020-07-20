package it.polito.ai.virtualLabs.services.exceptions.professor;

import it.polito.ai.virtualLabs.services.exceptions.team.TeamServiceException;

public class ProfessorNotFoundException extends TeamServiceException {
    public ProfessorNotFoundException(String message) {
        super(message + " Error type: PROFESSOR NOT FOUND");
    }
}
