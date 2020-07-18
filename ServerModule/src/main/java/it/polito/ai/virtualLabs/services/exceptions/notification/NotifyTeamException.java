package it.polito.ai.virtualLabs.services.exceptions.notification;

public class NotifyTeamException extends RuntimeException {
    public NotifyTeamException(String message) {
        super("[NotifyTeamException] " + message);
    }
}
