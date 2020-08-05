package it.polito.ai.virtualLabs.controllers;

import it.polito.ai.virtualLabs.dtos.*;
import it.polito.ai.virtualLabs.services.TeamService;
import it.polito.ai.virtualLabs.services.VmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.swing.text.html.Option;
import java.util.*;

@RestController
@RequestMapping("API/teams")
public class TeamController {

    @Autowired
    TeamService teamService;
    @Autowired
    VmService vmService;

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
    public TeamProposalDTO addTeamProposal(@RequestBody Map<String, Object> input,
                                           @AuthenticationPrincipal UserDetails userDetails) {
        if(!input.containsKey("teamName")
                || !input.containsKey("courseName")
                || !input.containsKey("studentIds"))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);

        String teamName = (String)input.get("teamName");
        String courseName = (String)input.get("courseName");

        List<String> studentIds = (List<String>)input.get("studentIds");
        return ModelHelper.enrich(teamService.proposeTeam(courseName, teamName, studentIds, userDetails.getUsername()));
    }

    @PostMapping("/{teamId}/createVm")
    @ResponseStatus(HttpStatus.CREATED)
    public VmDTO createVm(@PathVariable Long teamId,
                          @RequestBody VmDTO vmDTO,
                          @AuthenticationPrincipal UserDetails userDetails) {
        Optional<TeamDTO> teamDTO = teamService.getTeam(teamId);
        if(!teamDTO.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "The team with id: '" + teamId + "' was not found");

        Optional<StudentDTO> student = teamService.getStudentByUsername(userDetails.getUsername());
        if(!student.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "The student with email: '" + userDetails.getUsername() + "' was not found");

        String studentId = student.get().getId();
        if(!vmService.createVm(vmDTO, studentId, teamId))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Cannot create vm: current resources are not enough");

        return ModelHelper.enrich(vmDTO);
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
