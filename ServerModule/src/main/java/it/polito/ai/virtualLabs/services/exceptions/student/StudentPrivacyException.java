package it.polito.ai.virtualLabs.services.exceptions.student;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class StudentPrivacyException extends ResponseStatusException {
    public StudentPrivacyException(String message) {
        super(HttpStatus.UNAUTHORIZED, message);
    }
}
