package it.polito.ai.virtualLabs.services;

import it.polito.ai.virtualLabs.dtos.ReportDTO;
import it.polito.ai.virtualLabs.dtos.UserDTO;
import it.polito.ai.virtualLabs.entities.RegistrationToken;
import it.polito.ai.virtualLabs.entities.Token;
import it.polito.ai.virtualLabs.entities.User;
import it.polito.ai.virtualLabs.repositories.TokenRepository;
import it.polito.ai.virtualLabs.repositories.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
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

    @Autowired
    TokenRepository tokenRepository;

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
        User user = userRepository.getOne(id);

        Optional<RegistrationToken> tokenOpt = tokenRepository.findByUserId(id);

        // remove token if it is already present
        tokenOpt.ifPresent(registrationToken -> tokenRepository.deleteById(registrationToken.getToken()));

        // create registration token
        RegistrationToken registrationToken = new RegistrationToken(token, user, LocalDateTime.now().plusDays(3));
        tokenRepository.saveAndFlush(registrationToken);
        registrationToken.setUser(user);

        return token;
    }

    @Override
    public void setNewPassword(String id, String password) {
        userRepository.getOne(id).setPassword(this.passwordEncoder.encode(password));
    }

    @Override
    public boolean completeRegistration(String token) {
        Optional<RegistrationToken> tokenOpt = this.tokenRepository.findRegistrationToken(token);
        if(!tokenOpt.isPresent())
            return false;

        RegistrationToken registrationToken = tokenOpt.get();

        // check if token is expired
        if(registrationToken.getExpiration().isBefore(LocalDateTime.now())) {
            tokenRepository.deleteById(token);
            tokenRepository.flush();
            return false;
        }

        // set user as registered
        User user = userRepository.getOne(registrationToken.getUser().getId());
        user.setRegistered(true);

        // delete registration token
        tokenRepository.deleteById(token);
        tokenRepository.flush();
        return true;
    }

    private String hashToken(String username) {
        String randomString = UUID.randomUUID().toString()+"|"+username;
        return Base64.getEncoder().withoutPadding().encodeToString(randomString.getBytes());
    }
}
