package it.polito.ai.virtualLabs.controllers;

import it.polito.ai.virtualLabs.services.NotificationService;
import it.polito.ai.virtualLabs.services.exceptions.token.TokenExpiredException;
import it.polito.ai.virtualLabs.services.exceptions.token.TokenNotFoundException;
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

    @GetMapping("/confirm/{token}")
    public String confirm(@PathVariable String token) {
        try {
            if(notificationService.confirm(token))
                return "confirmPage";
        } catch(TokenNotFoundException | TokenExpiredException ex) {
            return "home";
        }
        return "home";
    }

    @GetMapping("/reject/{token}")
    public String reject(@PathVariable String token) {
        try {
            if(notificationService.reject(token))
                return "rejectPage";
        } catch(TokenNotFoundException | TokenExpiredException ex) {
            return "home";
        }
        return "home";
    }

}
