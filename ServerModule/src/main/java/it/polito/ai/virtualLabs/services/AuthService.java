package it.polito.ai.virtualLabs.services;

import it.polito.ai.virtualLabs.dtos.UserDTO;

import java.util.Optional;

public interface AuthService {

    Optional<UserDTO> getUserByUsername(String username);

    boolean checkIfRegistered(String id);
    String assignToken(String id);
    void setNewPassword(String id, String password);
    boolean completeRegistration(String token);
}
