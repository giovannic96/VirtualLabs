package it.polito.ai.virtualLabs.services.exceptions.vmmodel;

import it.polito.ai.virtualLabs.services.exceptions.team.TeamServiceException;

public class VmModelResourcesExceededException extends TeamServiceException {
    public VmModelResourcesExceededException(String message) {
        super(message + " Error type: VM_MODEL RESOURCES EXCEED");
    }
}
