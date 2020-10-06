package it.polito.ai.virtualLabs.services;

import it.polito.ai.virtualLabs.dtos.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface LabService {

    Optional<ReportDTO> getReport(Long reportId);
    Optional<AssignmentDTO> getAssignment(Long assignmentId);
    Optional<VersionDTO> getVersion(Long versionId);
    List<AssignmentDTO> getAllAssignments();
    List<ReportDTO> getStudentReports(String studentId);
    List<ReportDTO> getStudentReportsForAssignment(String studentUsername, Long assignmentId);
    List<ReportDTO> getAssignmentReports(Long assignmentId);
    Optional<ProfessorDTO> getAssignmentProfessor(Long assignmentId);
    List<VersionDTO> getReportVersions(Long reportId);
    Optional<StudentDTO> getReportOwner(Long reportId);
    List<AssignmentDTO> getCourseAssignments(String courseName);
    Optional<ReportDTO> getReportForVersion(Long versionId);
    Optional<AssignmentDTO> getAssignmentForReport(Long reportId);
    Optional<CourseDTO> getAssignmentCourse(Long assignmentId);

    Long addAssignmentToCourse(AssignmentDTO assignmentDTO, String courseName, String professorId);
    boolean addReportToAssignment(ReportDTO reportDTO, Long assignmentId, String studentId);
    boolean addVersionToReport(Long reportId, String title, MultipartFile file);
    boolean removeAssignment(Long assignmentId);
    boolean editAssignment(Long assignmentId, AssignmentDTO assignmentDTO);
    boolean gradeReport(Long reportId, Float grade);
    boolean reviewVersion(Long versionId, String review);
    boolean markReportAsRead(Long reportId);
}
