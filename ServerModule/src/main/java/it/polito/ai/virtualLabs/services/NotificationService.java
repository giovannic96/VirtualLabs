package it.polito.ai.virtualLabs.services;

import it.polito.ai.virtualLabs.dtos.TeamDTO;
import org.springframework.mail.MailException;

import java.util.List;

public interface NotificationService {

    void sendMessage(String address, String subject, String body) throws MailException;
    boolean confirm(String token); //to confirm group participation
    boolean reject(String token); //to express refusal participation
    void notifyTeam(TeamDTO dto, List<String> memberIds);
}
