package it.polito.ai.virtualLabs.services;

import it.polito.ai.virtualLabs.dtos.TeamDTO;
import it.polito.ai.virtualLabs.dtos.TeamProposalDTO;
import org.springframework.mail.MailException;

import javax.mail.MessagingException;
import java.util.List;

public interface NotificationService {
    void sendMessage(String address, String subject, String body) throws MailException, MessagingException;
    boolean accept(Long teamProposalId, String token); //to confirm group participation
    boolean reject(Long teamProposalId, String token); //to express refusal participation
    void notifyTeam(Long teamProposalId, List<String> memberIds) throws MessagingException;
}
