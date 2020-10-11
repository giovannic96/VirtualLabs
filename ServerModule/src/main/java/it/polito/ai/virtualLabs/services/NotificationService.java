package it.polito.ai.virtualLabs.services;

import it.polito.ai.virtualLabs.dtos.ProfessorDTO;
import it.polito.ai.virtualLabs.entities.Student;
import org.springframework.mail.MailException;

import javax.mail.MessagingException;
import java.util.List;
import java.util.Optional;

public interface NotificationService {
    void sendMessage(String address, String subject, String body) throws MailException, MessagingException;
    void sendMessageToTeam(ProfessorDTO from, List<String> to, String subject, String body) throws MailException;
    boolean acceptByToken(Long teamProposalId, String token); //to confirm group participation
    boolean rejectByToken(Long teamProposalId, String token); //to express refusal participation
    boolean acceptById(Long teamProposalId, String studentId);
    boolean rejectById(Long teamProposalId, String studentId);
    String getTokenByStudentId(Long tpId, String studId);
    Optional<Student> getStudentByToken(String token);
    void notifyTeam(Long teamProposalId, List<String> memberIds) throws MessagingException;
}
