package it.polito.ai.virtualLabs.controllers;

import it.polito.ai.virtualLabs.dtos.*;
import it.polito.ai.virtualLabs.entities.Assignment;
import it.polito.ai.virtualLabs.services.LabService;
import it.polito.ai.virtualLabs.services.TeamService;
import it.polito.ai.virtualLabs.services.VmService;
import it.polito.ai.virtualLabs.services.exceptions.file.ParsingFileException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("API/courses")
public class CourseController {

    @Autowired
    TeamService teamService;
    @Autowired
    LabService labService;
    @Autowired
    VmService vmService;

    @GetMapping({"","/"})
    public List<CourseDTO> all() {
        List<CourseDTO> courses = teamService.getAllCourses();
        for(CourseDTO c: courses)
            ModelHelper.enrich(c);

        return courses;
    }

    @GetMapping("/{courseName}")
    public CourseDTO getOne(@PathVariable String courseName) {
        Optional<CourseDTO> course = teamService.getCourse(courseName);
        if(!course.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);

        return ModelHelper.enrich(course.get());
    }

    @GetMapping("/{courseName}/enrolled")
    public List<StudentDTO> enrolledStudents(@PathVariable String courseName) {
        return teamService.getEnrolledStudents(courseName);
        //TODO: da enrichare
    }

    @GetMapping("/{courseName}/teams")
    public List<TeamDTO> teams(@PathVariable String courseName) {
        return teamService.getTeamsForCourse(courseName);
        //TODO: da enrichare
    }

    @GetMapping("/{courseName}/teamProposals")
    public List<TeamProposalDTO> teamProposals(@PathVariable String courseName) {
        return teamService.getTeamProposalsForCourse(courseName);
        //TODO: da enrichare
    }

    @GetMapping("/{courseName}/assignments")
    public List<AssignmentDTO> assignments(@PathVariable String courseName) {
        return labService.getCourseAssignments(courseName);
        //TODO: da enrichare
    }

    @GetMapping("/{courseName}/vmModel")
    public VmModelDTO vmModel(@PathVariable String courseName) {
        Optional<VmModelDTO> vmModel = vmService.getCourseVmModel(courseName);
        if(!vmModel.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);

        //TODO: da enrichare
        return vmModel.get();
    }

    @GetMapping("/{courseName}/professors")
    public List<ProfessorDTO> professors(@PathVariable String courseName) {
        return teamService.getProfessorsForCourse(courseName);
        //TODO: da enrichare
    }

    @PostMapping({"","/"})
    public CourseDTO addCourse(@RequestBody CourseDTO courseDTO) {
        if(!teamService.addCourse(courseDTO))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Error in entering course: " + courseDTO.getName());
        return ModelHelper.enrich(courseDTO);
    }

    @PostMapping("/{courseName}/assignProfessor")
    @ResponseStatus(HttpStatus.CREATED)
    public ProfessorDTO assignProfessor(@PathVariable String courseName, @RequestBody Map<String, String> input) {
        if(!input.containsKey("id"))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        String id = input.get("id");
        if(!teamService.addProfessorToCourse(id, courseName))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Error in assignment of professor with id: " + id);

        return teamService.getProfessor(id).get();
    }

    @PostMapping("/{courseName}/enrollOne")
    @ResponseStatus(HttpStatus.CREATED)
    public void enrollStudent(@PathVariable String courseName, @RequestBody Map<String,String> input) {
        if(!input.containsKey("id"))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        String id = input.get("id");
        if(!teamService.addStudentToCourse(id, courseName))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Error in enrolling student with id: " + id);
    }

    @PostMapping("/{name}/enrollMany")
    @ResponseStatus(HttpStatus.CREATED)
    public List<Boolean> enrollStudents(@PathVariable String name, @RequestParam("file") MultipartFile file) {
        try {
            Reader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
            return teamService.addAndEnroll(reader, name);
        } catch (ParsingFileException e) {
            throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE);
        } catch(IOException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //@PostMapping("/{courseName}/setVmModel")

    //@PutMapping("/{courseName}")
    //@PutMapping("/{courseName}/editVmModel")

    //@DeleteMapping("/{courseName}/students")



}

