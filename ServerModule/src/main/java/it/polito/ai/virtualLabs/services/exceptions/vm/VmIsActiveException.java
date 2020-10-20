package it.polito.ai.virtualLabs.services.exceptions.vm;

import it.polito.ai.virtualLabs.services.exceptions.team.TeamServiceException;

public class VmIsActiveException extends TeamServiceException {
    public VmIsActiveException(String message) {
        super(message + " Error type: VM IS ACTIVE");
    }
}
