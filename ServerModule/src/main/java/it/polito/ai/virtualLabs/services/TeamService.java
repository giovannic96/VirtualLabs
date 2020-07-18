package it.polito.ai.virtualLabs.services;

import it.polito.ai.virtualLabs.dtos.CourseDTO;
import it.polito.ai.virtualLabs.dtos.StudentDTO;
import it.polito.ai.virtualLabs.dtos.TeamDTO;

import java.io.Reader;
import java.util.List;
import java.util.Optional;

public interface TeamService {
    boolean addCourse(CourseDTO course);
    Optional<CourseDTO> getCourse(String name);
    List<CourseDTO> getAllCourses();
    boolean addStudent(StudentDTO student);
    Optional<StudentDTO> getStudent(String studentId);
    List<StudentDTO> getAllStudents();
    List<StudentDTO> getEnrolledStudents(String courseName);
    boolean addStudentToCourse(String studentId, String courseName);
    void enableCourse(String courseName);
    void disableCourse(String courseName);
    List<Boolean> addAll(List<StudentDTO> students);
    List<Boolean> enrollAll(List<String> studentIds, String courseName);
    List<Boolean> addAndEnroll(Reader r, String courseName);
    List<CourseDTO> getCourses(String studentId);
    List<TeamDTO> getTeamsForStudent(String studentId);
    List<StudentDTO>getMembers(Long TeamId);
    TeamDTO proposeTeam(String courseId, String name, List<String> memberIds);
    List<TeamDTO> getTeamsForCourse(String courseName);
    List<StudentDTO> getStudentsInTeams(String courseName);
    List<StudentDTO> getAvailableStudents(String courseName);
    void changeTeamState(Long teamId, int state);
    void evictTeam(Long teamId);
}
