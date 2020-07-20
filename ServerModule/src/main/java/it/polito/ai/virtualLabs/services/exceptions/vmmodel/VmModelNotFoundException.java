package it.polito.ai.virtualLabs.services.exceptions.vmmodel;

import it.polito.ai.virtualLabs.services.exceptions.team.TeamServiceException;

public class VmModelNotFoundException extends TeamServiceException {
    public VmModelNotFoundException(String message) {
        super(message + " Error type: VM_MODEL NOT FOUND");
    }
}
