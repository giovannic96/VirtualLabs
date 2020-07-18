package it.polito.ai.virtualLabs.services.exceptions.notification;

public class NotificationServiceException extends RuntimeException {
    public NotificationServiceException(String message) {
        super("[NotificationServiceException] " + message);
    }
}
