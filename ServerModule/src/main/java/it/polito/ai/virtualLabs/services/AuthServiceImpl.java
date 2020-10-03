package it.polito.ai.virtualLabs.services;

import it.polito.ai.virtualLabs.dtos.UserDTO;
import it.polito.ai.virtualLabs.entities.RefreshToken;
import it.polito.ai.virtualLabs.entities.RegistrationToken;
import it.polito.ai.virtualLabs.entities.User;
import it.polito.ai.virtualLabs.repositories.TokenRepository;
import it.polito.ai.virtualLabs.repositories.UserRepository;
import it.polito.ai.virtualLabs.security.JwtTokenProvider;
import it.polito.ai.virtualLabs.services.exceptions.team.TokenNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

    private static final int REGISTRATION_EXPIRATION_DAYS = 3;
    private static final int REFRESH_EXPIRATION_DAYS = 1;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    JwtTokenProvider jwtTokenProvider;

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
    public String assignRegistrationToken(String id) {
        String token = hashToken(id);
        User user = userRepository.getOne(id);

        Optional<RegistrationToken> tokenOpt = tokenRepository.findRegistrationTokenByUserId(id);

        // remove token if it is already present
        tokenOpt.ifPresent(registrationToken -> tokenRepository.deleteById(registrationToken.getToken()));

        // create registration token
        RegistrationToken registrationToken = new RegistrationToken();
        registrationToken.setToken(token);
        registrationToken.setExpiration(LocalDateTime.now().plusDays(REGISTRATION_EXPIRATION_DAYS));
        registrationToken.setUser(user);
        tokenRepository.saveAndFlush(registrationToken);

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

    @Override
    public String assignRefreshToken(String username, boolean logging) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if(!userOpt.isPresent())
            throw new UsernameNotFoundException("Username '" + username + "' not found");

        User user = userOpt.get();
        Optional<RefreshToken> tokenOpt = tokenRepository.findRefreshTokenByUserId(user.getId());

        String returnToken;
        if(logging) {
            // remove token if it is already present
            tokenOpt.ifPresent(refreshToken -> tokenRepository.deleteById(refreshToken.getToken()));

            // create refresh token
            RefreshToken refreshToken = new RefreshToken();
            returnToken = hashToken(username);
            refreshToken.setToken(returnToken);
            refreshToken.setExpiration(LocalDateTime.now().plusMinutes(REFRESH_EXPIRATION_DAYS));
            refreshToken.setUser(user);
            tokenRepository.saveAndFlush(refreshToken);
        } else {
            returnToken = tokenOpt.get().getToken();
        }

        return returnToken;
    }

    @Override
    public String assignAuthToken(String username) {
        return jwtTokenProvider.createToken(
                username, this.userRepository.findByUsernameAndRegisteredTrue(username).orElseThrow(() ->
                        new UsernameNotFoundException("Username " + username + "not found")).getRoles());
    }

    @Override
    public boolean isRefreshTokenExpired(String token) {
        // check if token has a valid format
        //TODO remember to restore the correct one
        //Pattern pattern = Pattern.compile("[A-Fa-f0-9]{16}\\|((([s]\\d{6}[@]studenti[.])|([d]\\d{6}[@]))polito[.]it)");
        Pattern pattern = Pattern.compile("[\\s\\S]*");
        Matcher matcher = pattern.matcher(token);
        if(!matcher.find())
            throw new IllegalStateException("Invalid token format");

        // check if decoded username is valid
        String decodedUsername = new String(Base64.getDecoder().decode(token)).split("\\|")[1];
        Optional<User> userOpt = userRepository.findByUsernameAndRegisteredTrue(decodedUsername);
        if(!userOpt.isPresent())
            throw new UsernameNotFoundException("Username '" + decodedUsername + "' was not found");

        // check if refresh token exists
        User user = userOpt.get();
        Optional<RefreshToken> refreshTokenOpt =  tokenRepository.findRefreshTokenByUserId(user.getId());
        if(!refreshTokenOpt.isPresent())
            throw new TokenNotFoundException("Token not found");

        // check if token is valid
        RefreshToken refreshToken = refreshTokenOpt.get();
        if(!refreshToken.getToken().equals(token))
            throw new IllegalStateException("Invalid provided token");

        // return false if token is expired, true otherwise
        return refreshToken.getExpiration().isBefore(LocalDateTime.now());
    }

    @Override
    public Map<String, String> assignToken(String username, boolean logging) {
        String authToken = assignAuthToken(username);
        String refreshToken = assignRefreshToken(username, logging);

        Map<String, String> map = new HashMap<>();
        map.put("username", username);
        map.put("auth_token", authToken);
        map.put("refresh_token", refreshToken);

        return map;
    }

    private String hashToken(String username) {
        String randomString = UUID.randomUUID().toString()+"|"+username;
        return Base64.getEncoder().withoutPadding().encodeToString(randomString.getBytes());
    }
}
