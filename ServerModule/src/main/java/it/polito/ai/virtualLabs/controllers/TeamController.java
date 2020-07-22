package it.polito.ai.virtualLabs.controllers;

import it.polito.ai.virtualLabs.dtos.TeamDTO;
import it.polito.ai.virtualLabs.dtos.VmDTO;
import it.polito.ai.virtualLabs.services.TeamService;
import it.polito.ai.virtualLabs.services.VmService;
import org.hibernate.validator.constraints.URL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("API/teams")
public class TeamController {

    @Autowired
    TeamService teamService;
    @Autowired
    VmService vmService;

    @GetMapping("/teams/{teamId}/vms")
    public List<VmDTO> vmsForTeam(@PathVariable Long teamId) {
        List<VmDTO> vms = vmService.getTeamVms(teamId);

        //TODO: da enrichare
        return vms;
    }

    //@PostMapping("/addTeamProposal")
    //@PostMapping("/{teamId}/createVm")
}
