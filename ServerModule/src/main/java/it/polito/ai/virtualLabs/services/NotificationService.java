package it.polito.ai.virtualLabs.services;

import it.polito.ai.virtualLabs.dtos.TeamDTO;
import it.polito.ai.virtualLabs.dtos.TeamProposalDTO;
import org.springframework.mail.MailException;

import javax.mail.MessagingException;
import java.util.List;

public interface NotificationService {
    void sendMessage(String address, String subject, String body) throws MailException, MessagingException;
    void sendMessageToTeam(String from, List<String> to, String subject, String body) throws MailException;
    boolean acceptByToken(Long teamProposalId, String token); //to confirm group participation
    boolean rejectByToken(Long teamProposalId, String token); //to express refusal participation
    boolean acceptById(Long teamProposalId, String studentId);
    boolean rejectById(Long teamProposalId, String studentId);
    String getTokenByStudentId(Long tpId, String studId);
    void notifyTeam(Long teamProposalId, List<String> memberIds) throws MessagingException;
}
