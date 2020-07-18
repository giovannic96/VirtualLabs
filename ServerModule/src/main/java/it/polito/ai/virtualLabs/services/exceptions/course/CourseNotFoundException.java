package it.polito.ai.virtualLabs.services.exceptions.course;

import it.polito.ai.virtualLabs.services.exceptions.team.TeamServiceException;

public class CourseNotFoundException extends TeamServiceException {
    public CourseNotFoundException(String message) {
        super(message + " Error type: COURSE NOT FOUND");
    }
}
