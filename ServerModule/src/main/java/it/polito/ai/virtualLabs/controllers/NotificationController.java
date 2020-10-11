package it.polito.ai.virtualLabs.controllers;

import it.polito.ai.virtualLabs.dtos.MessageDTO;
import it.polito.ai.virtualLabs.dtos.ProfessorDTO;
import it.polito.ai.virtualLabs.dtos.StudentDTO;
import it.polito.ai.virtualLabs.services.AuthService;
import it.polito.ai.virtualLabs.services.NotificationService;
import it.polito.ai.virtualLabs.services.TeamService;
import it.polito.ai.virtualLabs.services.exceptions.student.StudentNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.mail.MailException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Controller
@RequestMapping("notification")
public class NotificationController {

    @Autowired
    NotificationService notificationService;
    @Autowired
    AuthService authService;
    @Autowired
    TeamService teamService;

    @PostMapping("/accept")
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    public boolean acceptByToken(@RequestParam Long tpId, @RequestParam String token) {
        if(!notificationService.acceptByToken(tpId, token))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Error in accepting the team proposal with id: " + tpId);
        return true;
    }

    @PostMapping("/reject")
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    public boolean rejectByToken(@RequestParam Long tpId, @RequestParam String token) {
        if(!notificationService.rejectByToken(tpId, token))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Error in rejecting the team proposal with id: " + tpId);
        return true;
    }

    @PostMapping("/protected/accept")
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    public boolean acceptByUsername(@RequestParam Long tpId, @AuthenticationPrincipal UserDetails userDetails) {
        Optional<StudentDTO> studentOpt = teamService.getStudentByUsername(userDetails.getUsername());
        if(!studentOpt.isPresent())
            throw new StudentNotFoundException("The student with username '" + userDetails.getUsername() + "' does not exist");
        String studentId = studentOpt.get().getId();
        if(!notificationService.acceptById(tpId, studentId))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Error in accepting the team proposal with id: " + tpId);
        return true;
    }

    @PostMapping("/protected/reject")
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    public boolean rejectByUsername(@RequestParam Long tpId, @AuthenticationPrincipal UserDetails userDetails) {
        Optional<StudentDTO> studentOpt = teamService.getStudentByUsername(userDetails.getUsername());
        if(!studentOpt.isPresent())
            throw new StudentNotFoundException("The student with username '" + userDetails.getUsername() + "' does not exist");
        String studentId = studentOpt.get().getId();
        if(!notificationService.rejectById(tpId, studentId))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Error in rejecting the team proposal with id: " + tpId);
        return true;
    }
}
