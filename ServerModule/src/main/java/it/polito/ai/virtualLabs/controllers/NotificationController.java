package it.polito.ai.virtualLabs.controllers;

import it.polito.ai.virtualLabs.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("API/notification")
public class NotificationController {

    @Autowired
    NotificationService notificationService;

    @PutMapping("/accept")
    @ResponseStatus(HttpStatus.OK)
    public void accept(@RequestParam Long tpId, @RequestParam String token) {
        notificationService.accept(tpId, token);
    }

    @PutMapping("/reject")
    @ResponseStatus(HttpStatus.OK)
    public void reject(@RequestParam Long tpId, @RequestParam String token) {
        notificationService.reject(tpId, token);
    }

}
