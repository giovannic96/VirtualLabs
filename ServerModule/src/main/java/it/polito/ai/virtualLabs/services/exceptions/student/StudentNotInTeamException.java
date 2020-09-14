package it.polito.ai.virtualLabs.services.exceptions.student;

import it.polito.ai.virtualLabs.services.exceptions.team.TeamServiceException;

public class StudentNotInTeamException extends TeamServiceException {
    public StudentNotInTeamException(String message) {
        super(message + " Error type: STUDENT NOT IN TEAM");
    }
}
