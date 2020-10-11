package it.polito.ai.virtualLabs.controllers;

import it.polito.ai.virtualLabs.dtos.*;
import it.polito.ai.virtualLabs.entities.Report;
import it.polito.ai.virtualLabs.services.LabService;
import it.polito.ai.virtualLabs.dtos.ReportDTO;
import it.polito.ai.virtualLabs.dtos.StudentDTO;
import it.polito.ai.virtualLabs.services.TeamService;
import it.polito.ai.virtualLabs.services.VmService;
import org.hibernate.tool.schema.internal.exec.ScriptTargetOutputToFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.swing.text.html.Option;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("API/students")
public class StudentController {

    @Autowired
    TeamService teamService;
    @Autowired
    VmService vmService;
    @Autowired
    LabService labService;

    @GetMapping({"","/"})
    public List<StudentDTO> all() {
        List<StudentDTO> students = teamService.getAllStudents();
        for(StudentDTO s: students)
            ModelHelper.enrich(s);
        return students;
    }

    @GetMapping("/{studentId}")
    public StudentDTO getOne(@PathVariable String studentId) {
        Optional<StudentDTO> student = teamService.getStudent(studentId);
        if(!student.isPresent())
            throw new ResponseStatusException(HttpStatus.CONFLICT, studentId);
        return ModelHelper.enrich(student.get());
    }

    @GetMapping("/{studentId}/courses")
    public List<CourseDTO> courses(@PathVariable String studentId) {
        List<CourseDTO> courses = teamService.getCoursesForStudent(studentId);
        return teamService.enrichCourses(courses);
    }

    @GetMapping("/{studentId}/teams")
    public List<TeamDTO> teams(@PathVariable String studentId) {
        List<TeamDTO> teams = teamService.getTeamsForStudent(studentId);
        for(TeamDTO t: teams)
            ModelHelper.enrich(t);
        return teams;
    }

    @GetMapping("/{studentId}/vms")
    public List<VmDTO> vms(@PathVariable String studentId) {
        List<VmDTO> vms = vmService.getStudentVms(studentId);
        for(VmDTO v: vms)
            ModelHelper.enrich(v);
        return vms;
    }

    @GetMapping("/{studentId}/teamProposals")
    public List<TeamProposalDTO> teamProposals(@PathVariable String studentId) {
        List<TeamProposalDTO> teamProposals = teamService.getTeamProposalsForStudent(studentId);
        teamProposals = teamService.cleanTeamProposals(teamProposals);
        for(TeamProposalDTO tp: teamProposals)
            ModelHelper.enrich(tp);

        return teamProposals;
    }

    @GetMapping("/{studentId}/reports")
    public List<ReportDTO> reports(@PathVariable String studentId) {
        List<ReportDTO> reports = labService.getStudentReports(studentId);
        for(ReportDTO report: reports)
            ModelHelper.enrich(report);
        return reports;
    }

    @GetMapping("/{studentId}/courses/{courseName}/checkAcceptedProposals")
    public boolean hasAcceptedProposals(@PathVariable String studentId, @PathVariable String courseName) {
        return teamService.hasAcceptedProposals(studentId, courseName);
    }

    @GetMapping("/{studentId}/teamProposals/{teamProposalId}/checkResponse")
    public boolean checkProposalResponse(@PathVariable String studentId, @PathVariable Long teamProposalId) {
        return teamService.checkProposalResponse(studentId, teamProposalId);
    }

    @GetMapping("/{studentId}/courses/{courseName}/team")
    public TeamDTO teamForStudent(@PathVariable String studentId, @PathVariable String courseName) {
        TeamDTO team = teamService.getTeamForStudentAndCourse(studentId, courseName);
        return team != null ? ModelHelper.enrich(team) : null;
    }

    @PostMapping("/{studentId}/courses/{courseName}/assignments/{assignmentId}/addReport")
    @ResponseStatus(HttpStatus.CREATED)
    public boolean addReports(@PathVariable String studentId, @PathVariable String courseName,
                           @PathVariable Long assignmentId, @RequestBody ReportDTO reportDTO) {
        if(!labService.addReportToAssignment(reportDTO, assignmentId, studentId))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Error in inserting the report to the assignment with id: " + assignmentId);
        return true;
    }
}
