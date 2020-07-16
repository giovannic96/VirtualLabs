package it.polito.ai.esercitazione3.services.exceptions.course;

import it.polito.ai.esercitazione3.services.exceptions.team.TeamServiceException;

public class CourseNotEnabledException extends TeamServiceException {
    public CourseNotEnabledException(String message) {
        super(message + " Error type: COURSE NOT ENABLED");
    }
}