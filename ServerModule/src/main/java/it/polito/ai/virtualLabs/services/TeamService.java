package it.polito.ai.virtualLabs.services;

import it.polito.ai.virtualLabs.dtos.*;
import it.polito.ai.virtualLabs.entities.TeamProposal;

import javax.mail.MessagingException;
import java.io.Reader;
import java.util.List;
import java.util.Optional;

public interface TeamService {

    boolean addCourse(CourseDTO course);
    Optional<CourseDTO> getCourse(String name);
    List<CourseDTO> getAllCourses();
    boolean addStudent(StudentDTO student);
    List<Boolean> addAllStudents(List<StudentDTO> students);
    Optional<StudentDTO> getStudent(String studentId);
    Optional<StudentDTO> getStudentByUsername(String username);
    List<StudentDTO> getAllStudents();
    boolean addProfessor(ProfessorDTO professor);
    List<Boolean> addAllProfessors(List<ProfessorDTO> professors);
    Optional<ProfessorDTO> getProfessor(String professorId);
    Optional<ProfessorDTO> getProfessorByUsername(String username);
    List<ProfessorDTO> getAllProfessors();

    Optional<TeamDTO> getTeamForCourse(String teamName, String courseName);
    Optional<TeamDTO> getTeam(Long teamId);
    List<TeamDTO> getTeamsForCourse(String courseName);
    List<TeamDTO> getTeamsForStudent(String studentId);
    Optional<TeamProposalDTO> getTeamProposal(Long teamProposalId);
    Optional<CourseDTO> getTeamProposalCourse(Long teamProposalId);
    List<StudentDTO> getTeamProposalMembers(Long teamProposalId);
    List<TeamProposalDTO> getPendingTeamProposalForCourse(String courseName);
    List<TeamProposalDTO> getTeamProposalsForCourse(String courseName);
    List<TeamProposalDTO> getTeamProposalsForStudent(String studentId);
    TeamDTO getTeamForStudentAndCourse(String studentId, String courseName);
    boolean hasAcceptedProposals(String studentId, String courseName);
    boolean checkProposalResponse(String studentId, Long teamProposalId);
    List<Long> getPendingTeamProposalIdsForStudent(String courseName, String studentId);

    Long proposeTeam(String courseName, String teamName, List<String> memberIds, String creatorUsername) throws MessagingException;
    void deleteTeam(Long teamId);
    void deleteTeamProposal(Long teamProposalId);
    List<StudentDTO>getTeamMembers(Long TeamId);
    List<StudentDTO> getStudentsInTeams(String courseName);
    List<StudentDTO> getAvailableStudents(String courseName);

    boolean editCourse(String courseName, CourseDTO courseDTO);
    void removeCourse(String courseName);
    List<StudentDTO> getEnrolledStudents(String courseName);
    boolean addStudentToCourse(String studentId, String courseName);
    void removeStudentFromCourse(String studentId, String courseName);
    void removeStudentFromTeamByCourse(String studentId, String courseName);
    boolean addProfessorToCourse(String professorId, String courseName);
    void removeProfessorFromCourse(String professorId, String courseName);
    List<ProfessorDTO> getProfessorsForCourse(String courseName);
    void enableCourse(String courseName);
    void disableCourse(String courseName);
    List<Boolean> enrollAllStudents(List<String> studentIds, String courseName);
    List<Boolean> addAndEnroll(Reader r, String courseName);
    List<CourseDTO> getCoursesForStudent(String studentId);
    List<CourseDTO> getCoursesForProfessor(String professorId);
    Optional<CourseDTO> getCourseForTeam(Long teamId);
    List<StudentDTO> getStudentsNotInCourse(String courseName);
    List<TeamProposalDTO> cleanTeamProposals(List<TeamProposalDTO> list);
    List<CourseDTO> enrichCourses(List<CourseDTO> courses);
}
