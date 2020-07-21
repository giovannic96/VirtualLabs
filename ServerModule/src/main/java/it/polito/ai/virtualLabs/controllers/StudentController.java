package it.polito.ai.virtualLabs.controllers;

import it.polito.ai.virtualLabs.dtos.*;
import it.polito.ai.virtualLabs.services.LabService;
import it.polito.ai.virtualLabs.dtos.ReportDTO;
import it.polito.ai.virtualLabs.dtos.StudentDTO;
import it.polito.ai.virtualLabs.services.TeamService;
import it.polito.ai.virtualLabs.services.VmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

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
        /*
        for(StudentDTO s: students)
            ModelHelper.enrich(s);

         */
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
        for(CourseDTO c: courses) {
            ModelHelper.enrich(c);
        }
        return courses;
    }

    @GetMapping("/{studentId}/teams")
    public List<TeamDTO> teams(@PathVariable String studentId) {
        List<TeamDTO> teams = teamService.getTeamsForStudent(studentId);
        /*
        for(TeamDTO t: teams) {
            ModelHelper.enrich(t);
        }

         */
        return teams;
    }

    @GetMapping("/{studentId}/vms")
    public List<VmDTO> vms(@PathVariable String studentId) {
        List<VmDTO> vms = vmService.getStudentVms(studentId);
        /*
        for(VmDTO v: vms) {
            ModelHelper.enrich(v);
        }

         */
        return vms;
    }

    @GetMapping("/{studentId}/teamProposals")
    public List<TeamProposalDTO> teamProposals(@PathVariable String studentId) {
        List<TeamProposalDTO> teamProposals = teamService.getTeamProposalsForStudent(studentId);
        /*
        for(TeamProposalDTO tp: teamProposals) {
            ModelHelper.enrich(tp);
        }

         */
        return teamProposals;
    }

    //get list of reports of an assignment of the course for a specific student
    @GetMapping("/{studentId}/courses/{courseName}/assignments/{assignmentId}/reports")
    public List<ReportDTO> reportsForAssignment(@PathVariable String studentId,
                                                @PathVariable String courseName,
                                                @PathVariable Long assignmentId) {
        Optional<StudentDTO> student = teamService.getStudent(studentId);
        if(!student.isPresent())
            throw new ResponseStatusException(HttpStatus.CONFLICT, studentId);

        return labService.getAssignmentReports(assignmentId)
                .stream()
                .filter(report -> labService.getReportOwner(report.getId()).getId().equals(studentId))
                .collect(Collectors.toList());

        //TODO: da enrichare
    }

    /*
    @PostMapping({"","/"})
    public StudentDTO addStudent(@RequestBody StudentDTO studentDTO) {
        if(!teamService.addStudent(studentDTO))
            throw new ResponseStatusException(HttpStatus.CONFLICT, studentDTO.getId());
        return ModelHelper.enrich(studentDTO);
    }*/

}
