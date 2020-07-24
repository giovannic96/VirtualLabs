package it.polito.ai.virtualLabs.services;

import it.polito.ai.virtualLabs.dtos.TeamDTO;
import it.polito.ai.virtualLabs.dtos.TeamProposalDTO;
import it.polito.ai.virtualLabs.entities.Course;
import it.polito.ai.virtualLabs.entities.Student;
import it.polito.ai.virtualLabs.entities.Team;
import it.polito.ai.virtualLabs.entities.TeamProposal;
import it.polito.ai.virtualLabs.repositories.CourseRepository;
import it.polito.ai.virtualLabs.repositories.TeamProposalRepository;
import it.polito.ai.virtualLabs.repositories.TeamRepository;
import it.polito.ai.virtualLabs.repositories.UserRepository;
import it.polito.ai.virtualLabs.services.exceptions.course.CourseNotEnabledException;
import it.polito.ai.virtualLabs.services.exceptions.course.CourseNotFoundException;
import it.polito.ai.virtualLabs.services.exceptions.student.StudentAlreadyTeamedUpException;
import it.polito.ai.virtualLabs.services.exceptions.student.StudentNotEnrolledException;
import it.polito.ai.virtualLabs.services.exceptions.student.StudentNotFoundException;
import it.polito.ai.virtualLabs.services.exceptions.team.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    JavaMailSender emailSender;
    @Autowired
    TeamRepository teamRepository;
    @Autowired
    TeamProposalRepository teamProposalRepository;
    @Autowired
    CourseRepository courseRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    TeamService teamService;

    @Override
    public void sendMessage(String address, String subject, String body) throws MailException {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(address);
        message.setSubject(subject);
        message.setText(body);
        emailSender.send(message);
    }

    @Override
    public boolean accept(Long teamProposalId, String token) {
        if(!teamProposalRepository.existsById(teamProposalId))
            throw new TeamProposalNotFoundException("The proposal with id '" + teamProposalId + "' was not found");

        //check if any of the students is already teamed up in another team
        TeamProposal tp = teamProposalRepository.getOne(teamProposalId);
        for(Student s : tp.getStudents()) {
            for(Team t : s.getTeams()) {
                if(t.getCourse().getName().equals(tp.getCourse().getName())) {
                    tp.setStatus(TeamProposal.TeamProposalStatus.REJECTED);
                    tp.setStatusDesc(s.getName() + " " + s.getSurname() + " is already enrolled in another team");
                    throw new StudentAlreadyTeamedUpException("The student with id '" + s.getId() + "' is already teamed up");
                }
            }
        }

        //check the team proposal
        if(!checkProposal(tp, token))
            return false;

        //remove token
        tp.removeToken(token);

        //check if ALL students have accepted the team proposal
        if(tp.getTokens().size() == 0) {
            tp.setStatus(TeamProposal.TeamProposalStatus.CONFIRMED);
            tp.setStatusDesc("All students accepted the proposal");

            //create the team
            Team team = new Team();
            team.setName(tp.getTeamName());
            team.setCourse(tp.getCourse());
            teamRepository.saveAndFlush(team);
            for(Student s : tp.getStudents())
                s.addToTeam(team);
        } else
            tp.setStatusDesc("Other students must accept the proposal yet");

        teamProposalRepository.saveAndFlush(tp);
        return true;
    }

    @Override
    public boolean reject(Long teamProposalId, String token) {
        if(!teamProposalRepository.existsById(teamProposalId))
            throw new TeamProposalNotFoundException("The proposal with id '" + teamProposalId + "' was not found");

        //check the team proposal
        TeamProposal tp = teamProposalRepository.getOne(teamProposalId);
        if(!checkProposal(tp, token))
            return false;

        //remove token
        tp.getTokens().clear();

        //reject the team proposal and add status description
        tp.setStatus(TeamProposal.TeamProposalStatus.REJECTED);
        String username = new String(Base64.getDecoder().decode(token)).split("\\|")[1];
        Student s = userRepository.getStudentByUsername(username);
        tp.setStatusDesc(s.getName() + " " + s.getSurname() + " rejected the proposal");

        teamProposalRepository.saveAndFlush(tp);
        return true;
    }

    @Override
    public void notifyTeam(Long teamProposalId, List<String> studentIds) {

        TeamProposal proposal = teamProposalRepository.getOne(teamProposalId);
        for(String id : studentIds) {
            String username = userRepository.getStudentById(id).getUsername();
            String token = hashToken(username);

            sendMessage(username, "VirtualLabs Invitation", calcBody(teamProposalId, token));

            proposal.addToken(token);
        }


    }

    private String hashToken(String username) {
        String randomString = UUID.randomUUID().toString()+"|"+username;
        return Base64.getEncoder().encodeToString(randomString.getBytes());
    }

    private boolean checkProposal(TeamProposal tp, String token) {
        //check if team proposal is already expired
        if(tp.getExpiryDate().isBefore(LocalDateTime.now()))
            return false;

        //check if team proposal was already accepted or rejected
        if(tp.getStatus() != TeamProposal.TeamProposalStatus.PENDING)
            if(tp.getStatus() == TeamProposal.TeamProposalStatus.CONFIRMED)
                throw new TeamProposalAlreadyAcceptedException("The proposal with id '"+tp.getId()+"' was already accepted");
            else
                throw new TeamProposalRejectedException("The proposal with id '"+tp.getId()+"' was already rejected");

        //check if the course exists
        String courseName = tp.getCourse().getName();
        if(!courseRepository.existsById(courseName))
            throw new CourseNotFoundException("The course named '" + courseName + "' was not found");

        //check if course is enabled
        Course course = courseRepository.getOne(courseName);
        if(!course.isEnabled())
            throw new CourseNotEnabledException("The course named '" + courseName + "' is not enabled");

        //check if student ids are duplicated or invalid
        List<String> distinctStudentsId = tp.getStudents()
                .stream()
                .map(Student::getId)
                .distinct()
                .collect(Collectors.toList());
        for(String studentId : distinctStudentsId) {
            if(!userRepository.studentExistsById(studentId))
                throw new StudentNotFoundException("The student with id '" + studentId + "' was not found");
            Student student = userRepository.getStudentById(studentId);
            if(!student.getCourses().contains(course))
                throw new StudentNotEnrolledException("The student with id '" + studentId +"' is not enrolled to the course named '" + courseName +"'");
        }

        //check if token exists
        if(!tp.getTokens().contains(token))
            throw new TokenNotFoundException("The token '" + token + "' was not found");

        return true;
    }

    private String calcBody(Long tpId, String token) {
        final String confirmURL = "http://localhost:8080/API/notification/accept/?tpId="+tpId+"&token="+token;
        final String rejectURL = "http://localhost:8080/API/notification/reject/?tpId="+tpId+"&token="+token;
        final String confirmBody = "Click here to confirm the proposal: ";
        final String rejectBody = "Click here to reject the proposal: ";

        return confirmBody + confirmURL + "\n\n" + rejectBody + rejectURL;
    }
}
