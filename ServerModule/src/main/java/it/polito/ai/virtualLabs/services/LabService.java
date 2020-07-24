package it.polito.ai.virtualLabs.services;

import it.polito.ai.virtualLabs.dtos.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface LabService {

    Optional<ReportDTO> getReport(Long reportId);
    Optional<AssignmentDTO> getAssignment(Long assignmentId);
    Optional<VersionDTO> getVersion(Long versionId);
    List<AssignmentDTO> getAllAssignments(); //TESTED
    List<ReportDTO> getStudentReports(String studentId); //TESTED
    List<ReportDTO> getStudentReportsForAssignment(String studentId, Long assignmentId); //TESTED
    List<ReportDTO> getAssignmentReports(Long assignmentId); //TESTED
    Optional<ProfessorDTO> getAssignmentProfessor(Long assignmentId); //TESTED
    List<VersionDTO> getReportVersions(Long reportId); //TESTED
    Optional<StudentDTO> getReportOwner(Long reportId); //TESTED
    List<AssignmentDTO> getCourseAssignments(String courseName); //TESTED
    Optional<ReportDTO> getReportForVersion(Long versionId);
    Optional<AssignmentDTO> getAssignmentForReport(Long reportId);
    Optional<CourseDTO> getAssignmentCourse(Long assignmentId);

    boolean addAssignmentToCourse(AssignmentDTO assignmentDTO, String courseName, String professorId); //TESTED
    boolean addReportToAssignment(ReportDTO reportDTO, Long assignmentId, String studentId); //TESTED
    boolean addVersionToReport(VersionDTO versionDTO, Long reportId); //TESTED
    boolean removeAssignment(Long assignmentId); //TESTED
    boolean editAssignment(Long assignmentId, String name, String content, LocalDateTime expiryDate); //TESTED
    boolean gradeReport(Long reportId, float grade);
}
