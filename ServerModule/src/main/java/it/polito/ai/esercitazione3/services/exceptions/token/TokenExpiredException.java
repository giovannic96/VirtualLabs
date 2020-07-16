package it.polito.ai.esercitazione3.services.exceptions.token;

import it.polito.ai.esercitazione3.services.exceptions.notification.NotificationServiceException;

public class TokenExpiredException extends NotificationServiceException {
    public TokenExpiredException(String message) {
        super(message + " Error type: TOKEN EXPIRED");
    }
}
