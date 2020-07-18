package it.polito.ai.virtualLabs.services.exceptions.token;

import it.polito.ai.virtualLabs.services.exceptions.notification.NotificationServiceException;

public class TokenNotFoundException extends NotificationServiceException {
    public TokenNotFoundException(String message) {
        super(message + " Error type: TOKEN NOT FOUND");
    }
}
