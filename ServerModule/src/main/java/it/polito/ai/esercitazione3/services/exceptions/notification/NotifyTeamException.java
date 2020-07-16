package it.polito.ai.esercitazione3.services.exceptions.notification;

public class NotifyTeamException extends RuntimeException {
    public NotifyTeamException(String message) {
        super("[NotifyTeamException] " + message);
    }
}
