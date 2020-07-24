package it.polito.ai.virtualLabs.controllers;

import it.polito.ai.virtualLabs.dtos.*;
import it.polito.ai.virtualLabs.entities.VmModel;
import it.polito.ai.virtualLabs.services.LabService;
import it.polito.ai.virtualLabs.services.TeamService;
import it.polito.ai.virtualLabs.services.VmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("API/professors")
public class ProfessorController {

    @Autowired
    TeamService teamService;
    @Autowired
    VmService vmService;
    @Autowired
    LabService labService;

    @GetMapping({"","/"})
    public List<ProfessorDTO> all() {
        List<ProfessorDTO> professors = teamService.getAllProfessors();
        /*
        for(ProfessorDTO p: professors)
            ModelHelper.enrich(p);

         */
        return professors;
    }

    @GetMapping("/{professorId}")
    public ProfessorDTO getOne(@PathVariable String professorId) {
        Optional<ProfessorDTO> professor = teamService.getProfessor(professorId);
        if(!professor.isPresent())
            throw new ResponseStatusException(HttpStatus.CONFLICT, professorId);

        //return ModelHelper.enrich(professor.get());
        return professor.get();
    }

    @GetMapping("/{professorId}/courses")
    public List<CourseDTO> courses(@PathVariable String professorId) {
        List<CourseDTO> courses = teamService.getCoursesForProfessor(professorId);
        for(CourseDTO c: courses) {
            ModelHelper.enrich(c);
        }
        return courses;
    }

    @GetMapping("/{professorId}/vmModels")
    public List<VmModelDTO> vmModels(@PathVariable String professorId) {
        List<VmModelDTO> vmModels = vmService.getProfessorVmModels(professorId);
        /*
        for(TeamDTO t: teams) {
            ModelHelper.enrich(t);
        }
         */
        return vmModels;
    }

    @GetMapping("/{professorId}/assignments")
    public List<AssignmentDTO> assignments(@PathVariable String professorId) {
        List<AssignmentDTO> assignments = vmService.getProfessorAssignments(professorId);

        for(AssignmentDTO a : assignments) {
            ModelHelper.enrich(a);
        }

        return assignments;
    }

    @GetMapping("/{professorId}/courses/{courseName}/assignments")
    public List<AssignmentDTO> assignmentsForCourse(@PathVariable String professorId, @PathVariable String courseName) {
        List<AssignmentDTO> assignments = labService.getCourseAssignments(courseName);

        assignments = assignments
                .stream()
                .filter(a -> labService.getAssignmentProfessor(a.getId()).isPresent() &&
                        labService.getAssignmentProfessor(a.getId()).get().getId().equals(professorId))
                .collect(Collectors.toList());

        for (AssignmentDTO a : assignments) {
            ModelHelper.enrich(a);
        }

        return assignments;
    }
}
