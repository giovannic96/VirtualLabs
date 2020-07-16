package it.polito.ai.esercitazione3.services.exceptions.token;

import it.polito.ai.esercitazione3.services.exceptions.notification.NotificationServiceException;

public class TokenNotFoundException extends NotificationServiceException {
    public TokenNotFoundException(String message) {
        super(message + " Error type: TOKEN NOT FOUND");
    }
}
