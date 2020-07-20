package it.polito.ai.virtualLabs.services.exceptions.report;

import it.polito.ai.virtualLabs.services.exceptions.team.TeamServiceException;

public class ReportNotFoundException extends TeamServiceException {
    public ReportNotFoundException(String message) {
        super(message + " Error type: REPORT NOT FOUND");
    }
}
