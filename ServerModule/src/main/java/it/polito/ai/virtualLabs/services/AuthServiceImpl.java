package it.polito.ai.virtualLabs.services;

import it.polito.ai.virtualLabs.dtos.UserDTO;
import it.polito.ai.virtualLabs.entities.*;
import it.polito.ai.virtualLabs.repositories.*;
import it.polito.ai.virtualLabs.security.JwtTokenProvider;
import it.polito.ai.virtualLabs.services.exceptions.professor.ProfessorPrivacyException;
import it.polito.ai.virtualLabs.services.exceptions.student.StudentPrivacyException;
import it.polito.ai.virtualLabs.services.exceptions.team.TokenNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

    private static final int REGISTRATION_EXPIRATION_DAYS = 3;
    private static final int REFRESH_EXPIRATION_DAYS = 30;

    @Autowired
    ModelMapper modelMapper;
    @Autowired
    JwtTokenProvider jwtTokenProvider;
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    UserRepository userRepository;
    @Autowired
    CourseRepository courseRepository;
    @Autowired
    ReportRepository reportRepository;
    @Autowired
    VmModelRepository vmModelRepository;
    @Autowired
    VmRepository vmRepository;
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
            refreshToken.setExpiration(LocalDateTime.now().plusDays(REFRESH_EXPIRATION_DAYS));
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
        String decodedToken = new String(Base64.getDecoder().decode(token));

        // check if token has a valid format
        //TODO refresh token regex
        //Pattern pattern = Pattern.compile("[A-Fa-f0-9]{16}\\|((([s]\\d{6}[@]studenti[.])|([d]\\d{6}[@]))polito[.]it)");
        Pattern pattern = Pattern.compile("[\\s\\S]*");
        Matcher matcher = pattern.matcher(decodedToken);
        if(!matcher.find())
            throw new IllegalStateException("Invalid token format");

        // check if decoded username is valid
        String decodedUsername = decodedToken.split("\\|")[1];
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

        if(logging)
            map.put("refresh_token", refreshToken);

        return map;
    }

    @Override
    public void checkAuthorizationForCourse(String courseName) {
        Course course = courseRepository.getOne(courseName);
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        userDetails.getAuthorities().forEach(role -> {
            if(role.getAuthority().equals("ROLE_STUDENT")) {
                Optional<User> user = userRepository.findByUsernameAndRegisteredTrue(userDetails.getUsername());
                user.ifPresent(s -> {
                    Student student = (Student)s;
                    if(!student.getCourses().contains(course))
                        throw new StudentPrivacyException("This student does not have permission to view the information relating to the course named " + courseName);
                });
            } else if(role.getAuthority().equals("ROLE_PROFESSOR")) {
                Optional<User> user = userRepository.findByUsernameAndRegisteredTrue(userDetails.getUsername());
                user.ifPresent(p -> {
                    Professor professor = (Professor)p;
                    if(!professor.getCourses().contains(course))
                        throw new ProfessorPrivacyException("This professor does not have permission to view the information relating to the course named " + courseName);
                });
            }
        });
    }

    @Override
    public void checkAuthorizationForStudentInfo(String studentId) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        userDetails.getAuthorities().forEach(role -> {
            if(role.getAuthority().equals("ROLE_STUDENT")) {
                Optional<User> user = userRepository.findByUsernameAndRegisteredTrue(userDetails.getUsername());
                user.ifPresent(s -> {
                    Student me = (Student)s;
                    if(!me.getCourses()
                            .stream()
                            .flatMap(course -> course.getStudents()
                                    .stream()
                                    .map(Student::getId))
                            .collect(Collectors.toList())
                            .contains(studentId))
                        throw new StudentPrivacyException("This student does not have permission to view the information relating to the student with id " + studentId);
                });
            } else if(role.getAuthority().equals("ROLE_PROFESSOR")) {
                Optional<User> user = userRepository.findByUsernameAndRegisteredTrue(userDetails.getUsername());
                user.ifPresent(p -> {
                    Professor me = (Professor)p;
                    if(!me.getCourses()
                            .stream()
                            .flatMap(course -> course.getStudents()
                                    .stream()
                                    .map(Student::getId))
                            .collect(Collectors.toList())
                            .contains(studentId))
                        throw new ProfessorPrivacyException("This professor does not have permission to view the information relating to the student with id " + studentId);
                });
            }
        });
    }

    @Override
    public void checkAuthorizationForReport(Long reportId) {
        Report report = reportRepository.getOne(reportId);
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        userDetails.getAuthorities().forEach(role -> {
            if(role.getAuthority().equals("ROLE_STUDENT")) {
                Optional<User> user = userRepository.findByUsernameAndRegisteredTrue(userDetails.getUsername());
                user.ifPresent(s -> {
                    Student student = (Student)s;
                    if(!student.getReports().contains(report))
                        throw new StudentPrivacyException("This student does not have permission to view the information relating to the report with id " + reportId);
                });
            } else if(role.getAuthority().equals("ROLE_PROFESSOR")) {
                Optional<User> user = userRepository.findByUsernameAndRegisteredTrue(userDetails.getUsername());
                user.ifPresent(p -> {
                    Professor professor = (Professor)p;
                    if(!report.getAssignment().getCourse().getProfessors().contains(professor))
                        throw new ProfessorPrivacyException("This professor does not have permission to view the information relating to the report with id " + reportId);
                });
            }
        });
    }

    @Override
    public void checkAuthorizationForVmModel(Long vmModelId) {
        VmModel vmModel = vmModelRepository.getOne(vmModelId);
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        userDetails.getAuthorities().forEach(role -> {
            if(role.getAuthority().equals("ROLE_STUDENT")) {
                throw new StudentPrivacyException("This student does not have permission to view the information relating to vmModels");
            } else if(role.getAuthority().equals("ROLE_PROFESSOR")) {
                Optional<User> user = userRepository.findByUsernameAndRegisteredTrue(userDetails.getUsername());
                user.ifPresent(p -> {
                    Professor professor = (Professor)p;
                    if(!professor.getId().equals(vmModel.getProfessor().getId()))
                        throw new ProfessorPrivacyException("This professor does not have permission to view the information relating to the vmModel with id " + vmModelId);
                });
            }
        });
    }

    @Override
    public void checkAuthorizationForVm(Long vmId, boolean mustBeOwner) {
        Vm vm = vmRepository.getOne(vmId);
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        userDetails.getAuthorities().forEach(role -> {
            if(role.getAuthority().equals("ROLE_STUDENT")) {
                Optional<User> user = userRepository.findByUsernameAndRegisteredTrue(userDetails.getUsername());
                user.ifPresent(s -> {
                    Student student = (Student)s;
                    if((mustBeOwner && !vm.getOwners().stream().map(Student::getId).collect(Collectors.toList()).contains(student.getId())) ||
                            (!mustBeOwner && !student.getTeams().contains(vm.getTeam())))
                        throw new StudentPrivacyException("This student does not have permission to view the information relating to the vm with id " + vmId);
                });
            } else if(role.getAuthority().equals("ROLE_PROFESSOR")) {
                Optional<User> user = userRepository.findByUsernameAndRegisteredTrue(userDetails.getUsername());
                user.ifPresent(p -> {
                    Professor professor = (Professor)p;
                    List<Team> teams = professor.getCourses().stream().flatMap(course -> course.getTeams().stream()).collect(Collectors.toList());
                    if(!teams.contains(vm.getTeam()))
                        throw new ProfessorPrivacyException("This professor does not have permission to view the information relating to the vm with id " + vmId);
                });
            }
        });
    }

    @Override
    public void checkAuthorizationForVm(Long vmId) {
        checkAuthorizationForVm(vmId, false);
    }

    @Override
    public void checkAuthorizationForTeamProposalMembers(String studentId) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        userDetails.getAuthorities().forEach(role -> {
            if(role.getAuthority().equals("ROLE_STUDENT")) {
                Optional<User> user = userRepository.findByUsernameAndRegisteredTrue(userDetails.getUsername());
                user.ifPresent(s -> {
                    Student student = (Student)s;
                    List<String> memberIds = student.getTeamProposals()
                            .stream()
                            .flatMap(tp -> tp.getStudents()
                                    .stream()
                                    .map(Student::getId))
                            .collect(Collectors.toList());
                    if(!memberIds.contains(studentId))
                        throw new StudentPrivacyException("This student does not have permission to view the information relating to the student with id " + studentId);
                });
            } else if(role.getAuthority().equals("ROLE_PROFESSOR")) {
                Optional<User> user = userRepository.findByUsernameAndRegisteredTrue(userDetails.getUsername());
                user.ifPresent(p -> {
                    Professor professor = (Professor)p;
                    List<String> studentIds = professor.getCourses()
                            .stream()
                            .flatMap(course -> course.getStudents()
                                    .stream()
                                    .map(Student::getId))
                            .collect(Collectors.toList());
                    if(!studentIds.contains(studentId))
                        throw new ProfessorPrivacyException("This professor does not have permission to view the information relating to the student with id " + studentId);
                });
            }
        });
    }

    @Override
    public void checkIdentity(String userId) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        userDetails.getAuthorities().forEach(role -> {
            if(role.getAuthority().equals("ROLE_STUDENT")) {
                Optional<User> user = userRepository.findByUsernameAndRegisteredTrue(userDetails.getUsername());
                user.ifPresent(u -> {
                    if(!u.getId().equals(userId))
                        throw new StudentPrivacyException("The student with id '" + userId + "' does not have permission to view this info");
                });
            } else if(role.getAuthority().equals("ROLE_PROFESSOR")) {
                Optional<User> user = userRepository.findByUsernameAndRegisteredTrue(userDetails.getUsername());
                user.ifPresent(u -> {
                    if(!u.getId().equals(userId))
                        throw new ProfessorPrivacyException("The professor with id '" + userId + "' does not have permission to view this info");
                });
            }
        });
    }

    @Override
    public void checkAuthorizationForMessage(List<String> to) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        userDetails.getAuthorities().forEach(role -> {
            if(role.getAuthority().equals("ROLE_STUDENT")) {
                throw new StudentPrivacyException("The student does not have permission to send message");
            } else if(role.getAuthority().equals("ROLE_PROFESSOR")) {
                Optional<User> user = userRepository.findByUsernameAndRegisteredTrue(userDetails.getUsername());
                user.ifPresent(u -> {
                    Professor professor = (Professor)u;
                    boolean found = false;
                    for(Course course : professor.getCourses()) {
                        if(course.getStudents().stream().map(Student::getId).collect(Collectors.toList()).containsAll(to)) {
                            found = true;
                            break;
                        }
                    }
                    if(!found)
                        throw new ProfessorPrivacyException("The professor with id '" + u.getId() + "' does not have permission to send message to these recipients");
                });
            }
        });
    }

    private String hashToken(String username) {
        String randomString = UUID.randomUUID().toString()+"|"+username;
        return Base64.getEncoder().withoutPadding().encodeToString(randomString.getBytes());
    }
}
