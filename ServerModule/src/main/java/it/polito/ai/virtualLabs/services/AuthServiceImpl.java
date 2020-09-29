package it.polito.ai.virtualLabs.services;

import it.polito.ai.virtualLabs.dtos.ReportDTO;
import it.polito.ai.virtualLabs.dtos.UserDTO;
import it.polito.ai.virtualLabs.entities.User;
import it.polito.ai.virtualLabs.repositories.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Base64;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    UserRepository userRepository;

    @Override
    public Optional<UserDTO> getUserByUsername(String username) {
        if(!userRepository.existsByUsername(username))
            return Optional.empty();

        return userRepository.findByUsername(username)
                .map(u -> modelMapper.map(u, UserDTO.class));
    }

    @Override
    public boolean checkIfRegistered(String id) {
        return userRepository.getOne(id).isRegistered();
    }

    @Override
    public String assignToken(String id) {
        String token = hashToken(id);
        userRepository.getOne(id).setToken(token);
        return token;
    }

    @Override
    public void setNewPassword(String id, String password) {
        userRepository.getOne(id).setPassword(this.passwordEncoder.encode(password));
    }

    @Override
    public boolean completeRegistration(String token) {
        Optional<User> userOpt= this.userRepository.getByToken(token);
        if(!userOpt.isPresent())
            return false;

        User user = userOpt.get();
        user.setRegistered(true);
        user.setToken(null);

        return true;
    }

    private String hashToken(String username) {
        String randomString = UUID.randomUUID().toString()+"|"+username;
        return Base64.getEncoder().withoutPadding().encodeToString(randomString.getBytes());
    }
}
