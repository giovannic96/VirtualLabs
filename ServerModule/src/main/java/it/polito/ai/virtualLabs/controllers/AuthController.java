package it.polito.ai.virtualLabs.controllers;

import it.polito.ai.virtualLabs.dtos.UserDTO;
import it.polito.ai.virtualLabs.repositories.UserRepository;
import it.polito.ai.virtualLabs.services.AuthService;
import it.polito.ai.virtualLabs.services.NotificationService;
import it.polito.ai.virtualLabs.services.exceptions.team.TokenNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.mail.MessagingException;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static java.util.stream.Collectors.toList;
import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final String CONFIRMATION_PATH = "https://localhost:4200/registration_confirm";

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    AuthService authService;

    @Autowired
    NotificationService notificationService;

    @GetMapping("/me")
    public ResponseEntity currentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if(userDetails == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found");

        Map<Object, Object> model = new HashMap<>();
        model.put("roles", userDetails.getAuthorities()
                .stream()
                .map(a -> ((GrantedAuthority) a).getAuthority())
                .collect(toList())
        );

        Optional<UserDTO> user = authService.getUserByUsername(userDetails.getUsername());
        user.ifPresent(userDTO -> model.put("user", ModelHelper.enrich(userDTO)));

        return ok(model);
    }

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody UserDTO data) {
        try {
            String username = data.getUsername();
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, data.getPassword()));
            return ok(authService.assignToken(username, true));
        } catch (AuthenticationException e) {
            throw new BadCredentialsException("Invalid username/password supplied");
        }
    }

    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.OK)
    public boolean signup(@RequestBody UserDTO data) {
        Optional<UserDTO> userOpt = authService.getUserByUsername(data.getUsername());

        if(!userOpt.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User with username '" + data.getUsername() + "' was not found");

        UserDTO user = userOpt.get();

        if(authService.checkIfRegistered(user.getId()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User with username '" + user.getUsername() + "' cannot be registered");

        String token = authService.assignRegistrationToken(user.getId());
        authService.setNewPassword(user.getId(), data.getPassword());

        String subject = "Virtual Labs registration confirm";
        String message = "Hello " + user.getName() + "\nClick on th link below to confirm your registration on Virtual Labs!\n\n" +
                "Confirmation link: " + CONFIRMATION_PATH + "?token=" + token;

        try {
            notificationService.sendMessage(data.getUsername(), subject, message);
        } catch(MessagingException ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Error in sending the email for registration");
        }
        return true;
    }

    @PostMapping("/confirmRegistration")
    @ResponseStatus(HttpStatus.OK)
    public void confirmRegistration(@RequestParam String token) {
        if(!this.authService.completeRegistration(token))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Token provided was not valid");
    }

    @PostMapping("/refreshToken")
    @ResponseStatus(HttpStatus.OK)
    public Map<String, String> refreshToken(@RequestBody String token) {
        try {
            if(authService.isRefreshTokenExpired(token))
                throw new ResponseStatusException(HttpStatus.NETWORK_AUTHENTICATION_REQUIRED, "Refresh token is expired");

            String decodedUsername = new String(Base64.getDecoder().decode(token)).split("\\|")[1];
            return authService.assignToken(decodedUsername, false);
        } catch(UsernameNotFoundException | TokenNotFoundException | IllegalStateException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, e.getMessage());
        }
    }
}
