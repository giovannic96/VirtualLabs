package it.polito.ai.virtualLabs.services;

import it.polito.ai.virtualLabs.dtos.*;
import it.polito.ai.virtualLabs.entities.*;
import it.polito.ai.virtualLabs.repositories.*;
import it.polito.ai.virtualLabs.services.exceptions.assignment.AssignmentNotFoundException;
import it.polito.ai.virtualLabs.services.exceptions.course.CourseNotFoundException;
import it.polito.ai.virtualLabs.services.exceptions.professor.ProfessorNotFoundException;
import it.polito.ai.virtualLabs.services.exceptions.report.ReportNotFoundException;
import it.polito.ai.virtualLabs.services.exceptions.student.StudentNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class LabServiceImpl implements LabService {

    @Autowired
    AssignmentRepository assignmentRepository;
    @Autowired
    ReportRepository reportRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    CourseRepository courseRepository;
    @Autowired
    VersionRepository versionRepository;
    @Autowired
    ModelMapper modelMapper;

    @Override
    public List<AssignmentDTO> getAllAssignments() {
        return assignmentRepository.findAll()
                .stream()
                .map(a -> modelMapper.map(a, AssignmentDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<ReportDTO> getStudentReports(String studentId) {
        if(!userRepository.existsById(studentId))
            throw new StudentNotFoundException("The student with id " + studentId + " does not exist");

        Student s = userRepository.getStudentById(studentId);
        return s.getReports()
                .stream()
                .map(r -> modelMapper.map(r, ReportDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<ReportDTO> getStudentReportsForAssignment(String studentId, Long assignmentId) {
        if(!userRepository.existsById(studentId))
            throw new StudentNotFoundException("The student with id " + studentId + " does not exist");

        if(!assignmentRepository.existsById(assignmentId))
            throw new AssignmentNotFoundException("The assignment with id " + assignmentId + " does not exist");

        Student s = userRepository.getStudentById(studentId);
        return s.getReports()
                .stream()
                .filter(r -> r.getAssignment().getId().equals(assignmentId))
                .map(r -> modelMapper.map(r, ReportDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<ReportDTO> getAssignmentReports(Long assignmentId) {
        if(!assignmentRepository.existsById(assignmentId))
            throw new AssignmentNotFoundException("The assignment with id " + assignmentId + " does not exist");

        Assignment a = assignmentRepository.getOne(assignmentId);
        return a.getReports()
                .stream()
                .map(r -> modelMapper.map(r, ReportDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public ProfessorDTO getAssignmentProfessor(Long assignmentId) {
        if(!assignmentRepository.existsById(assignmentId))
            throw new AssignmentNotFoundException("The assignment with id " + assignmentId + " does not exist");

        Assignment a = assignmentRepository.getOne(assignmentId);
        return modelMapper.map(a.getProfessor(), ProfessorDTO.class);
    }

    @Override
    public List<VersionDTO> getReportVersions(Long reportId) {
        if(!reportRepository.existsById(reportId))
            throw new ReportNotFoundException("The report with id " + reportId + " does not exist");

        Report r = reportRepository.getOne(reportId);
        return r.getVersions()
                .stream()
                .map(v -> modelMapper.map(v, VersionDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public StudentDTO getReportOwner(Long reportId) {
        if(!reportRepository.existsById(reportId))
            throw new ReportNotFoundException("The report with id " + reportId + " does not exist");

        Report r = reportRepository.getOne(reportId);
        return modelMapper.map(r.getOwner(), StudentDTO.class);
    }

    @Override
    public List<AssignmentDTO> getCourseAssignments(String courseName) {
        if(!courseRepository.existsById(courseName))
            throw new CourseNotFoundException("The course named " + courseName + " does not exist");

        Course c = courseRepository.getOne(courseName);
        return c.getAssignments()
                .stream()
                .map(a -> modelMapper.map(a, AssignmentDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public boolean addAssignmentToCourse(AssignmentDTO assignmentDTO, String courseName, String professorId) {
        if(!courseRepository.existsById(courseName))
            throw new CourseNotFoundException("The course named " + courseName + " does not exist");
        if(!userRepository.existsById(professorId))
            throw new ProfessorNotFoundException("The professor with id " + professorId + " does not exist");

        Course course = courseRepository.getOne(courseName);
        Professor professor = userRepository.getProfessorById(professorId);
        Assignment assignment = modelMapper.map(assignmentDTO, Assignment.class);

        //check if there is already an assignment with that name in that course
        if(course.getAssignments().stream().anyMatch(a -> a.getName().equals(assignmentDTO.getName())))
            return false;

        //add assignment to course and professor
        assignment.setCourse(course);
        assignment.setProfessor(professor);

        assignmentRepository.saveAndFlush(assignment);
        return true;
    }

    @Override
    public boolean addReportToAssignment(ReportDTO reportDTO, Long assignmentId, String studentId) {
        if(!assignmentRepository.existsById(assignmentId))
            throw new AssignmentNotFoundException("The assignment with id " + assignmentId + " does not exist");
        if(!userRepository.existsById(studentId))
            throw new StudentNotFoundException("The student with id " + studentId + " does not exist");

        Assignment assignment = assignmentRepository.getOne(assignmentId);
        Student student = userRepository.getStudentById(studentId);
        Report report = modelMapper.map(reportDTO, Report.class);

        //check if there is already a report for that assignmentId and studentId
        if(reportRepository.findReportByAssignmentIdAndOwnerId(assignmentId, studentId).isPresent())
            return false;

        //add report to assignment and student
        report.setAssignment(assignment);
        report.setOwner(student);

        reportRepository.saveAndFlush(report);
        return true;
    }

    @Override
    public boolean addVersionToReport(VersionDTO versionDTO, Long reportId) {
        if(!reportRepository.existsById(reportId))
            throw new ReportNotFoundException("The report with id " + reportId + " does not exist");

        Report report = reportRepository.getOne(reportId);
        Version version = modelMapper.map(versionDTO, Version.class);

        //check if there is already a version with same timestamp in that report
        if(report.getVersions().stream().anyMatch(v -> v.getSubmissionDate().isEqual(versionDTO.getSubmissionDate())))
            return false;

        //add version to report
        version.setReport(report);

        versionRepository.saveAndFlush(version);
        return true;
    }

    @Override
    public boolean removeAssignment(Long assignmentId) {
        if(!assignmentRepository.existsById(assignmentId))
            throw new AssignmentNotFoundException("The assignment with id " + assignmentId + " does not exist");

        //remove assignment
        assignmentRepository.deleteById(assignmentId);
        assignmentRepository.flush();
        return true;
    }

    @Override
    public boolean editAssignment(Long assignmentId, String name, String content, LocalDateTime expiryDate) {
        if(!assignmentRepository.existsById(assignmentId))
            throw new AssignmentNotFoundException("The assignment with id " + assignmentId + " does not exist");

        //check date and name constraints
        Assignment assignment = assignmentRepository.getOne(assignmentId);
        if(expiryDate.isBefore(LocalDateTime.now()) ||
            assignment.getCourse().getAssignments().stream().anyMatch(a -> a.getName().equals(name)))
            return false;

        //edit assignment
        assignment.setName(name);
        assignment.setContent(content);
        assignment.setExpiryDate(expiryDate);

        assignmentRepository.saveAndFlush(assignment);
        return true;
    }
}
