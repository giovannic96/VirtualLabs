package it.polito.ai.virtualLabs.services;

import it.polito.ai.virtualLabs.dtos.*;
import it.polito.ai.virtualLabs.entities.Report;

import java.time.LocalDateTime;
import java.util.List;

public interface LabService {

    List<AssignmentDTO> getAllAssignments();
    List<ReportDTO> getStudentReports(String studentId);
    List<ReportDTO> getAssignmentReports(Long assignmentId);
    ProfessorDTO getAssignmentProfessor(Long assignmentId);
    List<VersionDTO> getReportVersions(Long reportId);
    StudentDTO getReportOwner(Long reportId);
    List<AssignmentDTO> getCourseAssignments(String courseName);
    boolean addAssignmentToCourse(AssignmentDTO assignmentDTO, String courseName, String professorId);
    boolean addReportToAssignment(ReportDTO reportDTO, Long assignmentId, String studentId);
    boolean addVersionToReport(VersionDTO versionDTO, Long reportId);
    boolean removeAssignment(Long assignmentId);
    boolean editAssignment(Long assignmentId, String name, String content, LocalDateTime expiryDate);
}
