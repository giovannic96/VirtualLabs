package it.polito.ai.virtualLabs.services;

import it.polito.ai.virtualLabs.dtos.*;
import it.polito.ai.virtualLabs.entities.Report;

import java.time.LocalDateTime;
import java.util.List;

public interface LabService {

    List<AssignmentDTO> getAllAssignments(); //TESTED
    List<ReportDTO> getStudentReports(String studentId); //TESTED
    List<ReportDTO> getAssignmentReports(Long assignmentId); //TESTED
    ProfessorDTO getAssignmentProfessor(Long assignmentId); //TESTED
    List<VersionDTO> getReportVersions(Long reportId); //TESTED
    StudentDTO getReportOwner(Long reportId); //TESTED
    List<AssignmentDTO> getCourseAssignments(String courseName); //TESTED

    boolean addAssignmentToCourse(AssignmentDTO assignmentDTO, String courseName, String professorId); //TESTED
    boolean addReportToAssignment(ReportDTO reportDTO, Long assignmentId, String studentId); //TESTED
    boolean addVersionToReport(VersionDTO versionDTO, Long reportId); //TESTED
    boolean removeAssignment(Long assignmentId); //TESTED
    boolean editAssignment(Long assignmentId, String name, String content, LocalDateTime expiryDate); //TESTED
}
