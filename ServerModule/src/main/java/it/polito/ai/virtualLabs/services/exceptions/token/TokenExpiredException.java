package it.polito.ai.virtualLabs.services.exceptions.token;

import it.polito.ai.virtualLabs.services.exceptions.notification.NotificationServiceException;

public class TokenExpiredException extends NotificationServiceException {
    public TokenExpiredException(String message) {
        super(message + " Error type: TOKEN EXPIRED");
    }
}
