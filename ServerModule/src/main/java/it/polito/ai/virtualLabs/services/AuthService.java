package it.polito.ai.virtualLabs.services;

import it.polito.ai.virtualLabs.dtos.UserDTO;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface AuthService {

    Optional<UserDTO> getUserByUsername(String username);

    boolean checkIfRegistered(String id);
    String assignRegistrationToken(String id);
    void setNewPassword(String id, String password);
    boolean completeRegistration(String token);
    String assignRefreshToken(String username, boolean logging);
    String assignAuthToken(String username);
    boolean isRefreshTokenExpired(String token);
    Map<String, String> assignToken(String username, boolean logging);
    void checkAuthorizationForCourse(String courseName);
    void checkAuthorizationForStudentInfo(String studentId);
    void checkAuthorizationForReport(Long reportId);
    void checkAuthorizationForVm(Long vmId);
    void checkAuthorizationForVm(Long vmId, boolean mustBeOwner);
    void checkAuthorizationForTeamProposalMembers(String studentId);
    void checkAuthorizationForMessage(List<String> to);
    void checkIdentity(String userId);
    boolean checkCredentials(String username, String password);
}
