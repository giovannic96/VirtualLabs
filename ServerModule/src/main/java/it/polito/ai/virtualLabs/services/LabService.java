package it.polito.ai.virtualLabs.services;

import it.polito.ai.virtualLabs.dtos.AssignmentDTO;
import it.polito.ai.virtualLabs.dtos.ReportDTO;
import it.polito.ai.virtualLabs.dtos.UserDTO;
import it.polito.ai.virtualLabs.dtos.VersionDTO;

import java.util.List;

public interface LabService {

    List<AssignmentDTO> getAllAssignments();
    List<ReportDTO> getStudentReports(String studentId);
    List<AssignmentDTO> getAssignmentReports(Long assignmentId);
    UserDTO getAssignmentProfessor(String professorId);
    List<VersionDTO> getReportVersions(Long reportId);
    UserDTO getReportOwner(Long reportId);
    List<AssignmentDTO> getCourseAssignments(String courseName);
    boolean addAssignmentToCourse(AssignmentDTO assignmentDTO, String courseName, String professorId);
    boolean addReportToAssignment(ReportDTO reportDTO, Long assignmentId);
    boolean addVersionToReport(VersionDTO versionDTO, Long reportId);
    boolean removeAssignment(Long assignmentId);
    void editAssignment(AssignmentDTO assignmentDTO);
}
