package it.polito.ai.virtualLabs.controllers;

import it.polito.ai.virtualLabs.dtos.*;
import it.polito.ai.virtualLabs.services.NotificationService;
import it.polito.ai.virtualLabs.services.TeamService;
import it.polito.ai.virtualLabs.services.VmService;
import it.polito.ai.virtualLabs.services.exceptions.student.StudentNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.mail.MailException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.mail.AuthenticationFailedException;
import javax.mail.MessagingException;
import java.util.*;

@RestController
@RequestMapping("API/teams")
public class TeamController {

    @Autowired
    TeamService teamService;
    @Autowired
    VmService vmService;
    @Autowired
    NotificationService notificationService;

    @GetMapping("/{teamId}")
    public TeamDTO getOne(@PathVariable Long teamId) {
        Optional<TeamDTO> team = teamService.getTeam(teamId);

        if(!team.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "The team with id '" + teamId + "' was not found");

        return ModelHelper.enrich(team.get());
    }

    @GetMapping("/{teamId}/course")
    public CourseDTO course(@PathVariable Long teamId) {
        Optional<CourseDTO> course = teamService.getCourseForTeam(teamId);

        if(!course.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "The course of the team with id '" + teamId + "' was not found");

        return ModelHelper.enrich(course.get());
    }

    @GetMapping("/{teamId}/members")
    public List<StudentDTO> members(@PathVariable Long teamId) {
        List<StudentDTO> members = teamService.getTeamMembers(teamId);
        for(StudentDTO s : members)
            ModelHelper.enrich(s);
        return members;
    }

    @GetMapping("/{teamId}/vms")
    public List<VmDTO> vmsForTeam(@PathVariable Long teamId) {
        List<VmDTO> vms = vmService.getTeamVms(teamId);
        for(VmDTO vm : vms)
            ModelHelper.enrich(vm);
        return vms;
    }

    @GetMapping("/teamProposals/{teamProposalId}")
    public TeamProposalDTO getOneProposal(@PathVariable Long teamProposalId) {
        Optional<TeamProposalDTO> teamProposal = teamService.getTeamProposal(teamProposalId);
        if(!teamProposal.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "The team proposal with id '" + teamProposalId + "' was not found");
        return ModelHelper.enrich(teamProposal.get());
    }

    @GetMapping("/teamProposals/{teamProposalId}/course")
    public CourseDTO teamProposalCourse(@PathVariable Long teamProposalId) {
        Optional<CourseDTO> course = teamService.getTeamProposalCourse(teamProposalId);
        if(!course.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "The course of the proposal with id '" + teamProposalId + "' was not found");
        return ModelHelper.enrich(course.get());
    }

    @GetMapping("/teamProposals/{teamProposalId}/members")
    public List<StudentDTO> teamProposalMembers(@PathVariable Long teamProposalId) {
        List<StudentDTO> members = teamService.getTeamProposalMembers(teamProposalId);
        for(StudentDTO s : members)
            ModelHelper.enrich(s);
        return members;
    }

    @PostMapping("/addTeamProposal")
    @ResponseStatus(HttpStatus.OK)
    public Long addTeamProposal(@RequestBody Map<String, Object> input,
                                @AuthenticationPrincipal UserDetails userDetails) {
        if(!input.containsKey("teamName")
                || !input.containsKey("courseName")
                || !input.containsKey("studentIds"))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);

        String teamName = (String)input.get("teamName");
        String courseName = (String)input.get("courseName");
        List<String> studentIds = (List<String>)input.get("studentIds");

        try {
            return teamService.proposeTeam(courseName, teamName, studentIds, userDetails.getUsername());
        } catch (MessagingException e) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, e.getMessage());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, e.getMessage());
        }
    }

    @PostMapping("/{teamId}/createVm")
    @ResponseStatus(HttpStatus.CREATED)
    public VmDTO createVm(@PathVariable Long teamId,
                          @RequestBody VmDTO vmDTO,
                          @RequestParam boolean allOwners,
                          @AuthenticationPrincipal UserDetails userDetails) {
        Optional<TeamDTO> teamDTO = teamService.getTeam(teamId);
        if(!teamDTO.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "The team with id: '" + teamId + "' was not found");

        Optional<StudentDTO> student = teamService.getStudentByUsername(userDetails.getUsername());
        if(!student.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "The student with email: '" + userDetails.getUsername() + "' was not found");

        String studentId = student.get().getId();
        Long generatedId = vmService.createVm(vmDTO, studentId, teamId, allOwners);
        if(generatedId == 0)
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Cannot create vm: current resources are not enough");

        return ModelHelper.enrich(vmService.getVm(generatedId).get());
    }

    @PostMapping("/sendMessageToTeam")
    @ResponseStatus(HttpStatus.OK)
    public void sendMessage(@RequestBody MessageDTO data, @AuthenticationPrincipal UserDetails userDetails) {
        Optional<ProfessorDTO> prof = teamService.getProfessorByUsername(userDetails.getUsername());
        if(!prof.isPresent())
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Error on getting information about user: " + userDetails.getUsername());

        try {
            notificationService.sendMessageToTeam(prof.get(), data.getTo(), data.getSubject(), data.getBody());
        } catch(MailException ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Error in sending the email to a student");
        } catch(StudentNotFoundException ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A student was not found in our system");
        }
    }

    @DeleteMapping("/{teamId}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteTeam(@PathVariable Long teamId) {
        Optional<TeamDTO> team = teamService.getTeam(teamId);

        if(!team.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);

        teamService.deleteTeam(teamId);
    }

    @DeleteMapping("/teamProposals/{teamProposalId}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteTeamProposal(@PathVariable Long teamProposalId,
                                    @AuthenticationPrincipal UserDetails userDetails) {
        Optional<StudentDTO> creator = teamService.getStudentByUsername(userDetails.getUsername());
        Optional<TeamProposalDTO> proposal = teamService.getTeamProposal(teamProposalId);

        if(!creator.isPresent() || !proposal.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);

        if(!creator.get().getId().equals(proposal.get().getCreatorId()))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);

        teamService.deleteTeamProposal(teamProposalId);
    }
}
