package it.polito.ai.virtualLabs.services.exceptions.professor;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class ProfessorPrivacyException extends ResponseStatusException {
    public ProfessorPrivacyException(String message) {
        super(HttpStatus.UNAUTHORIZED, message);
    }
}
