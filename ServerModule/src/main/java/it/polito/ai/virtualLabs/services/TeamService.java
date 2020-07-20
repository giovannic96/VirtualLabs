package it.polito.ai.virtualLabs.services;

import it.polito.ai.virtualLabs.dtos.*;
import it.polito.ai.virtualLabs.entities.TeamProposal;

import java.io.Reader;
import java.util.List;
import java.util.Optional;

public interface TeamService {

    boolean addCourse(CourseDTO course); //TESTED
    Optional<CourseDTO> getCourse(String name); //TESTED
    List<CourseDTO> getAllCourses(); //TESTED
    boolean addStudent(StudentDTO student); //TESTED
    Optional<StudentDTO> getStudent(String studentId); //TESTED
    List<StudentDTO> getAllStudents(); //TESTED
    boolean addProfessor(ProfessorDTO professor); //TESTED
    Optional<ProfessorDTO> getProfessor(String professorId); //TESTED
    List<ProfessorDTO> getAllProfessors(); //TESTED
    boolean addTeam(TeamDTO team);
    Optional<TeamDTO> getTeam(String teamName);
    List<TeamDTO> getAllTeams();

    List<StudentDTO> getEnrolledStudents(String courseName); //TESTED
    boolean addStudentToCourse(String studentId, String courseName); //TESTED
    void enableCourse(String courseName); //TESTED
    void disableCourse(String courseName); //TESTED
    List<Boolean> addAllStudents(List<StudentDTO> students); //TESTED
    List<Boolean> addAllProfessors(List<ProfessorDTO> professors); //TESTED
    List<Boolean> enrollAllStudents(List<String> studentIds, String courseName); //TESTED
    List<Boolean> addAndEnroll(Reader r, String courseName);
    List<CourseDTO> getCoursesForStudent(String studentId); //TESTED
    List<TeamDTO> getTeamsForStudent(String studentId);
    List<StudentDTO>getTeamMembers(Long TeamId);
    TeamProposalDTO proposeTeam(String courseId, String name, List<String> memberIds);
    TeamDTO createTeam(Long teamProposalId);
    List<TeamDTO> getTeamsForCourse(String courseName);
    List<StudentDTO> getStudentsInTeams(String courseName);
    List<StudentDTO> getAvailableStudents(String courseName);
    void changeTeamProposalStatus(Long teamId, TeamProposal.TeamProposalStatus newStatus);
    void deleteTeam(Long teamId);
}
