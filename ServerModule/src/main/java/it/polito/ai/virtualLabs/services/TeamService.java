package it.polito.ai.virtualLabs.services;

import it.polito.ai.virtualLabs.dtos.*;
import it.polito.ai.virtualLabs.entities.TeamProposal;

import javax.mail.MessagingException;
import java.io.Reader;
import java.util.List;
import java.util.Optional;

public interface TeamService {

    boolean addCourse(CourseDTO course); //TESTED
    Optional<CourseDTO> getCourse(String name); //TESTED
    List<CourseDTO> getAllCourses(); //TESTED
    boolean addStudent(StudentDTO student); //TESTED
    List<Boolean> addAllStudents(List<StudentDTO> students); //TESTED
    Optional<StudentDTO> getStudent(String studentId); //TESTED
    Optional<StudentDTO> getStudentByUsername(String studentId);
    List<StudentDTO> getAllStudents(); //TESTED
    boolean addProfessor(ProfessorDTO professor); //TESTED
    List<Boolean> addAllProfessors(List<ProfessorDTO> professors); //TESTED
    Optional<ProfessorDTO> getProfessor(String professorId); //TESTED
    Optional<ProfessorDTO> getProfessorByUsername(String username);
    List<ProfessorDTO> getAllProfessors(); //TESTED

    Optional<TeamDTO> getTeamForCourse(String teamName, String courseName); //TESTED
    Optional<TeamDTO> getTeam(Long teamId);
    List<TeamDTO> getTeamsForCourse(String courseName); //TESTED
    List<TeamDTO> getTeamsForStudent(String studentId); //TESTED
    Optional<TeamProposalDTO> getTeamProposal(Long teamProposalId); //TESTED
    Optional<CourseDTO> getTeamProposalCourse(Long teamProposalId);
    List<StudentDTO> getTeamProposalMembers(Long teamProposalId);
    List<TeamProposalDTO> getPendingTeamProposalForCourse(String courseName);
    List<TeamProposalDTO> getTeamProposalsForCourse(String courseName); //TESTED
    List<TeamProposalDTO> getTeamProposalsForStudent(String studentId);
    TeamDTO getTeamForStudentAndCourse(String studentId, String courseName);
    boolean hasAcceptedProposals(String studentId, String courseName);
    List<Long> getPendingTeamProposalIdsForStudent(String courseName, String studentId);

    Long proposeTeam(String courseName, String teamName, List<String> memberIds, String creatorUsername) throws MessagingException; //TESTED
    void deleteTeam(Long teamId); //TESTED
    void deleteTeamProposal(Long teamProposalId);
    List<StudentDTO>getTeamMembers(Long TeamId); //TESTED
    List<StudentDTO> getStudentsInTeams(String courseName); //TESTED
    List<StudentDTO> getAvailableStudents(String courseName); //TESTED

    boolean editCourse(String courseName, CourseDTO courseDTO);
    void removeCourse(String courseName);
    List<StudentDTO> getEnrolledStudents(String courseName); //TESTED
    boolean addStudentToCourse(String studentId, String courseName); //TESTED
    void removeStudentFromCourse(String studentId, String courseName);
    void removeStudentFromTeamByCourse(String studentId, String courseName);
    boolean addProfessorToCourse(String professorId, String courseName);
    void removeProfessorFromCourse(String professorId, String courseName);
    List<ProfessorDTO> getProfessorsForCourse(String courseName);
    void enableCourse(String courseName); //TESTED
    void disableCourse(String courseName); //TESTED
    List<Boolean> enrollAllStudents(List<String> studentIds, String courseName); //TESTED
    List<Boolean> addAndEnroll(Reader r, String courseName);
    List<CourseDTO> getCoursesForStudent(String studentId); //TESTED
    List<CourseDTO> getCoursesForProfessor(String professorId);
    Optional<CourseDTO> getCourseForTeam(Long teamId);
    List<StudentDTO> getStudentsNotInCourse(String courseName);
}
