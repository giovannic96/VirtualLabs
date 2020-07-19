package it.polito.ai.virtualLabs.services;

import it.polito.ai.virtualLabs.dtos.AssignmentDTO;
import it.polito.ai.virtualLabs.dtos.ReportDTO;
import it.polito.ai.virtualLabs.dtos.UserDTO;
import it.polito.ai.virtualLabs.dtos.VersionDTO;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public class LabServiceImpl implements LabService {

    @Override
    public List<AssignmentDTO> getAllAssignments() {
        return null;
    }

    @Override
    public List<ReportDTO> getStudentReports(String studentId) {
        return null;
    }

    @Override
    public List<AssignmentDTO> getAssignmentReports(Long assignmentId) {
        return null;
    }

    @Override
    public UserDTO getAssignmentProfessor(String professorId) {
        return null;
    }

    @Override
    public List<VersionDTO> getReportVersions(Long reportId) {
        return null;
    }

    @Override
    public UserDTO getReportOwner(Long reportId) {
        return null;
    }

    @Override
    public List<AssignmentDTO> getCourseAssignments(String courseName) {
        return null;
    }

    @Override
    public boolean addAssignmentToCourse(AssignmentDTO assignmentDTO, String courseName, String professorId) {
        return false;
    }

    @Override
    public boolean addReportToAssignment(ReportDTO reportDTO, Long assignmentId) {
        return false;
    }

    @Override
    public boolean addVersionToReport(VersionDTO versionDTO, Long reportId) {
        return false;
    }

    @Override
    public boolean removeAssignment(Long assignmentId) {
        return false;
    }

    @Override
    public void editAssignment(AssignmentDTO assignmentDTO) {

    }
}
