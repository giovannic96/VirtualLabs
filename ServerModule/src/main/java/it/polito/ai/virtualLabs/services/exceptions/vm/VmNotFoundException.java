package it.polito.ai.virtualLabs.services.exceptions.vm;

import it.polito.ai.virtualLabs.services.exceptions.team.TeamServiceException;

public class VmNotFoundException extends TeamServiceException {
    public VmNotFoundException(String message) {
        super(message + " Error type: VM NOT FOUND");
    }
}
