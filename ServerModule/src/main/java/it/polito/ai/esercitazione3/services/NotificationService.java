package it.polito.ai.esercitazione3.services;

import it.polito.ai.esercitazione3.dtos.TeamDTO;
import it.polito.ai.esercitazione3.entities.Token;
import org.springframework.mail.MailException;

import javax.mail.SendFailedException;
import java.util.List;

public interface NotificationService {

    void sendMessage(String address, String subject, String body) throws MailException;
    boolean confirm(String token); //to confirm group participation
    boolean reject(String token); //to express refusal participation
    void notifyTeam(TeamDTO dto, List<String> memberIds);
}
