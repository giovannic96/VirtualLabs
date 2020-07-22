package it.polito.ai.virtualLabs.controllers;

import it.polito.ai.virtualLabs.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("notification")
public class NotificationController {

    @Autowired
    NotificationService notificationService;
/*
    @PutMapping("/confirm/{token}")
    public String confirm(@PathVariable String token) {
        try {
            if(notificationService.confirm(token))
                return "confirmPage";
        } catch(TokenNotFoundException | TokenExpiredException ex) {
            return "home";
        }
        return "home";
    }

    @PutMapping("/reject/{token}")
    public String reject(@PathVariable String token) {
        try {
            if(notificationService.reject(token))
                return "rejectPage";
        } catch(TokenNotFoundException | TokenExpiredException ex) {
            return "home";
        }
        return "home";
    }
*/
}
