package it.polito.ai.virtualLabs.services.exceptions.student;

import it.polito.ai.virtualLabs.services.exceptions.team.TeamServiceException;

public class StudentPrivacyException extends TeamServiceException {
    public StudentPrivacyException(String message) {
        super(message + " Error type: STUDENT HAS NOT RIGHTS");
    }
}
