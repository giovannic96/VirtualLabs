package it.polito.ai.virtualLabs.controllers;

import it.polito.ai.virtualLabs.dtos.StudentDTO;
import it.polito.ai.virtualLabs.dtos.TeamDTO;
import it.polito.ai.virtualLabs.dtos.TeamProposalDTO;
import it.polito.ai.virtualLabs.dtos.VmDTO;
import it.polito.ai.virtualLabs.services.TeamService;
import it.polito.ai.virtualLabs.services.VmService;
import org.hibernate.validator.constraints.URL;
import org.modelmapper.Converters;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@RequestMapping("API/teams")
public class TeamController {

    @Autowired
    TeamService teamService;
    @Autowired
    VmService vmService;

    @GetMapping("/{teamId}/vms")
    public List<VmDTO> vmsForTeam(@PathVariable Long teamId) {
        List<VmDTO> vms = vmService.getTeamVms(teamId);

        //TODO: da enrichare
        return vms;
    }

    @PostMapping("/addTeamProposal")
    @ResponseStatus(HttpStatus.OK)
    public TeamProposalDTO addTeamProposal(@RequestBody Map<String, Object> input) {
        if(!input.containsKey("teamName")
                || !input.containsKey("courseName")
                || !input.containsKey("studentIds"))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);

        String teamName = (String)input.get("teamName");
        String courseName = (String)input.get("courseName");

        List<String> studentIds = (List<String>)input.get("studentIds");
        return teamService.proposeTeam(courseName, teamName, studentIds);
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

        //TODO: to enrich
        return vmDTO;
    }
}
