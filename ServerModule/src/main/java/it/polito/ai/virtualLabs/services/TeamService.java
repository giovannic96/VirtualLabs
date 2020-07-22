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
    List<Boolean> addAllStudents(List<StudentDTO> students); //TESTED
    Optional<StudentDTO> getStudent(String studentId); //TESTED
    List<StudentDTO> getAllStudents(); //TESTED
    boolean addProfessor(ProfessorDTO professor); //TESTED
    List<Boolean> addAllProfessors(List<ProfessorDTO> professors); //TESTED
    Optional<ProfessorDTO> getProfessor(String professorId); //TESTED
    List<ProfessorDTO> getAllProfessors(); //TESTED

    Optional<TeamDTO> getTeam(String teamName, String courseName); //TESTED
    List<TeamDTO> getTeamsForCourse(String courseName); //TESTED
    List<TeamDTO> getTeamsForStudent(String studentId); //TESTED
    Optional<TeamProposalDTO> getTeamProposal(Long teamProposalId); //TESTED
    List<TeamProposalDTO> getPendingTeamProposalForCourse(String courseName);
    List<TeamProposalDTO> getTeamProposalsForCourse(String courseName); //TESTED
    List<TeamProposalDTO> getTeamProposalsForStudent(String studentId);

    TeamProposalDTO proposeTeam(String courseName, String teamName, List<String> memberIds); //TESTED
    void changeTeamProposalStatus(Long teamProposalId, TeamProposal.TeamProposalStatus newStatus); //TESTED
    TeamDTO acceptTeamProposal(Long teamProposalId); //TESTED
    boolean rejectTeamProposal(Long teamProposalId); //TESTED
    void deleteTeam(Long teamId); //TESTED
    List<StudentDTO>getTeamMembers(Long TeamId); //TESTED
    List<StudentDTO> getStudentsInTeams(String courseName); //TESTED
    List<StudentDTO> getAvailableStudents(String courseName); //TESTED

    List<StudentDTO> getEnrolledStudents(String courseName); //TESTED
    boolean addStudentToCourse(String studentId, String courseName); //TESTED
    boolean addProfessorToCourse(String professorId, String courseName);
    List<ProfessorDTO> getProfessorsForCourse(String courseName);
    void enableCourse(String courseName); //TESTED
    void disableCourse(String courseName); //TESTED
    List<Boolean> enrollAllStudents(List<String> studentIds, String courseName); //TESTED
    List<Boolean> addAndEnroll(Reader r, String courseName);
    List<CourseDTO> getCoursesForStudent(String studentId); //TESTED
    List<CourseDTO> getCoursesForProfessor(String professorId);
}
