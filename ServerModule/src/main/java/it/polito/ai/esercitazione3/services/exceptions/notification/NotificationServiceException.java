package it.polito.ai.esercitazione3.services.exceptions.notification;

public class NotificationServiceException extends RuntimeException {
    public NotificationServiceException(String message) {
        super("[NotificationServiceException] " + message);
    }
}
