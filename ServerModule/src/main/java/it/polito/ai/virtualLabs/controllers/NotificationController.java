package it.polito.ai.virtualLabs.controllers;

import it.polito.ai.virtualLabs.dtos.MessageDTO;
import it.polito.ai.virtualLabs.services.NotificationService;
import it.polito.ai.virtualLabs.services.exceptions.student.StudentNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.mail.MailException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@Controller
@RequestMapping("notification")
public class NotificationController {

    @Autowired
    NotificationService notificationService;

    @PostMapping("/private/sendMessage")
    @ResponseStatus(HttpStatus.OK)
    public void sendMessage(@RequestBody MessageDTO data) {
        // TODO get name and surname of the professor who is sending the message via getAuthorities()
        try {
            notificationService.sendMessageToTeam("Name Surname", data.getTo(), data.getSubject(), data.getBody());
        } catch(MailException ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Error in sending the email to a student");
        } catch(StudentNotFoundException ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A student was not found in our system");
        }
    }

    @PostMapping("/acceptByToken")
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    public boolean acceptByToken(@RequestParam Long tpId, @RequestParam String token) {
        if(!notificationService.acceptByToken(tpId, token))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Error in accepting the team proposal with id: " + tpId);
        return true;
    }

    @PostMapping("/rejectByToken")
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    public boolean rejectByToken(@RequestParam Long tpId, @RequestParam String token) {
        if(!notificationService.rejectByToken(tpId, token))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Error in rejecting the team proposal with id: " + tpId);
        return true;
    }

    @PostMapping("/acceptById")
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    public boolean acceptById(@RequestParam Long tpId, @RequestParam String studentId) {
        if(!notificationService.acceptById(tpId, studentId))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Error in accepting the team proposal with id: " + tpId);
        return true;
    }

    @PostMapping("/rejectById")
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    public boolean rejectById(@RequestParam Long tpId, @RequestParam String studentId) {
        if(!notificationService.rejectById(tpId, studentId))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Error in rejecting the team proposal with id: " + tpId);
        return true;
    }
}
