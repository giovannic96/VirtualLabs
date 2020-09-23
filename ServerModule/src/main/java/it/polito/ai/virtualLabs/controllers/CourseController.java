package it.polito.ai.virtualLabs.controllers;

import it.polito.ai.virtualLabs.dtos.*;
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
        return teamService.enrichCourses(courses);
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
        List<StudentDTO> students = teamService.getEnrolledStudents(courseName);
        for(StudentDTO s : students)
            ModelHelper.enrich(s);
        return students;
    }

    @GetMapping("/{courseName}/notEnrolled")
    public List<StudentDTO> notEnrolledStudents(@PathVariable String courseName) {
        List<StudentDTO> students = teamService.getStudentsNotInCourse(courseName);
        for(StudentDTO s : students)
            ModelHelper.enrich(s);
        return students;
    }

    @GetMapping("/{courseName}/teamedUp")
    public List<StudentDTO> teamedUpStudents(@PathVariable String courseName) {
        List<StudentDTO> students = teamService.getStudentsInTeams(courseName);
        for(StudentDTO s : students)
            ModelHelper.enrich(s);
        return students;
    }

    @GetMapping("/{courseName}/notTeamedUp")
    public List<StudentDTO> notTeamedUpStudents(@PathVariable String courseName) {
        List<StudentDTO> students = teamService.getAvailableStudents(courseName);
        for(StudentDTO s : students)
            ModelHelper.enrich(s);
        return students;
    }

    @GetMapping("/{courseName}/teams")
    public List<TeamDTO> teams(@PathVariable String courseName) {
        List<TeamDTO> teams = teamService.getTeamsForCourse(courseName);
        for(TeamDTO t : teams)
            ModelHelper.enrich(t);
        return teams;
    }

    @GetMapping("/{courseName}/teams/{teamName}")
    public TeamDTO team(@PathVariable String courseName, @PathVariable String teamName) {
        Optional<TeamDTO> team = teamService.getTeamForCourse(teamName, courseName);
        return team.map(ModelHelper::enrich).orElse(null);
    }

    @GetMapping("/{courseName}/teamProposals")
    public List<TeamProposalDTO> teamProposals(@PathVariable String courseName) {
        List<TeamProposalDTO> teamProposals = teamService.getTeamProposalsForCourse(courseName);
        teamProposals = teamService.cleanTeamProposals(teamProposals);
        for(TeamProposalDTO tp: teamProposals)
            ModelHelper.enrich(tp);

        return teamProposals;
    }

    @GetMapping("/{courseName}/assignments")
    public List<AssignmentDTO> assignments(@PathVariable String courseName) {
        List<AssignmentDTO> assignments = labService.getCourseAssignments(courseName);
        for(AssignmentDTO a : assignments) {
            ModelHelper.enrich(a);
        }
        return assignments;
    }

    @GetMapping("/{courseName}/vmModel")
    public VmModelDTO vmModel(@PathVariable String courseName) {
        Optional<VmModelDTO> vmModel = vmService.getCourseVmModel(courseName);
        return vmModel.map(ModelHelper::enrich).orElse(null);
    }

    @GetMapping("/{courseName}/professors")
    public List<ProfessorDTO> professors(@PathVariable String courseName) {
        List<ProfessorDTO> professors = teamService.getProfessorsForCourse(courseName);
        for(ProfessorDTO p : professors)
            ModelHelper.enrich(p);
        return professors;
    }

    @PostMapping({"","/"})
    @ResponseStatus(HttpStatus.CREATED)
    public CourseDTO addCourse(@RequestBody CourseDTO courseDTO) {
        if(!teamService.addCourse(courseDTO))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Error in creating course: " + courseDTO.getName());
        return ModelHelper.enrich(courseDTO);
    }

    @PostMapping("/{courseName}/assignProfessor")
    @ResponseStatus(HttpStatus.OK)
    public ProfessorDTO assignProfessor(@PathVariable String courseName, @RequestBody Map<String, String> input) {
        if(!input.containsKey("id"))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);

        String id = input.get("id");
        if(!teamService.addProfessorToCourse(id, courseName))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Error in assignment of professor with id: " + id);

        return ModelHelper.enrich(teamService.getProfessor(id).get());
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

    @PostMapping("/{courseName}/enrollMany")
    @ResponseStatus(HttpStatus.OK)
    public List<StudentDTO> enrollStudents(@PathVariable String courseName, @RequestParam("file") MultipartFile file) {
        try {
            Reader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
            List<StudentDTO> students = teamService.addAndEnroll(reader, courseName);
            if(students != null && students.size() == 1 && students.get(0).getId() == null)
                throw new ResponseStatusException(HttpStatus.CONFLICT);
            return students;
        } catch (ParsingFileException e) {
            throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE);
        } catch(IOException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /*
    @PostMapping("/{courseName}/setVmModel")
    @ResponseStatus(HttpStatus.CREATED)
    public void setVmModelToCourse(@PathVariable String courseName,
                                         @RequestBody VmModelDTO vmModelDTO,
                                         @AuthenticationPrincipal UserDetails userDetails) {

        Optional<ProfessorDTO> professor = teamService.getProfessorByUsername(userDetails.getUsername());

        if(!professor.isPresent())
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Error on getting information about user: " + userDetails.getUsername());
        if(!vmService.setVmModelToCourse(vmModelDTO, courseName, professor.get().getId()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Error on setting vm model to course: " + courseName);
    }*/

    // TODO: just for tests, remove it and decomment method above when we will implement the login functionality
    @PostMapping("/{courseName}/setVmModel")
    @ResponseStatus(HttpStatus.CREATED)
    public void setVmModelToCourse(@PathVariable String courseName,
                                   @RequestBody VmModelDTO vmModelDTO) {


        if(!vmService.setVmModelToCourse(vmModelDTO, courseName, this.teamService.getProfessorsForCourse(courseName).get(0).getId()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Error on setting vm model to course: " + courseName);
    }

    /*
    @PostMapping("/{courseName}/addAssignment")
    @ResponseStatus(HttpStatus.CREATED)
    public Long addAssignmentToCourse(@PathVariable String courseName,
                                         @RequestBody AssignmentDTO assignmentDTO,
                                         @AuthenticationPrincipal UserDetails userDetails) {

        Optional<ProfessorDTO> professor = teamService.getProfessorByUsername(userDetails.getUsername());

        if(!professor.isPresent())
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Error on getting information about user: " + userDetails.getUsername());
        if(!labService.addAssignmentToCourse(assignmentDTO, courseName, professor.get().getId()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Error on adding assignment to course: " + courseName);
    }*/

    // TODO: just for tests, remove it and decomment method above when we will implement the login functionality
    @PostMapping("/{courseName}/addAssignment")
    @ResponseStatus(HttpStatus.CREATED)
    public Long addAssignmentToCourse(@PathVariable String courseName,
                                   @RequestBody AssignmentDTO assignmentDTO) {
        Long generatedId = labService.addAssignmentToCourse(assignmentDTO, courseName, this.teamService.getProfessorsForCourse(courseName).get(0).getId());
        if( generatedId == 0)
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Error on adding assignment to course: " + courseName);
        return generatedId;
    }

    @PutMapping("/{courseName}")
    @CrossOrigin // TODO: just for test in localhost, remove when finished
    @ResponseStatus(HttpStatus.OK)
    public boolean editCourse(@PathVariable String courseName, @RequestBody CourseDTO courseDTO) {
        if(!courseName.equals(courseDTO.getName()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "The course you want to edit has a name different from '" + courseDTO.getName() + "'");

        Optional<CourseDTO> currentCourse = teamService.getCourse(courseName);
        if(!currentCourse.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "The course named '" + courseName + "' was not found");

        return teamService.editCourse(courseName, courseDTO);
    }

    @PostMapping("/{courseName}/unrollMany")
    @ResponseStatus(HttpStatus.OK)
    public void removeStudentsFromCourse(@PathVariable String courseName, @RequestBody List<String> studentIds) {
        Optional<CourseDTO> course = teamService.getCourse(courseName);

        if(!course.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "The course named '"+ courseName +"' was not found");

        for(String studentId : studentIds) {
            teamService.removeStudentFromCourse(studentId, courseName);
            teamService.removeStudentFromTeamByCourse(studentId, courseName);
        }
    }

    @PutMapping("/{courseName}/editVmModel")
    @CrossOrigin // TODO: just for test in localhost, remove when finished
    @ResponseStatus(HttpStatus.OK)
    public void editVmModel(@PathVariable String courseName, @RequestBody VmModelDTO vmModelDTO) {
        Optional<VmModelDTO> currentVmModel = vmService.getCourseVmModel(courseName);

        if(!currentVmModel.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "The course named '"+ courseName +"' does not have a vm model setted");
        if(!vmService.editVmModelSettings(currentVmModel.get().getId(), vmModelDTO))
            throw new ResponseStatusException(HttpStatus.NOT_MODIFIED, "The vm model named '" + vmModelDTO.getName() + "' was not modified");
    }

    @DeleteMapping("/{courseName}")
    @CrossOrigin // TODO: just for test in localhost, remove when finished
    @ResponseStatus(HttpStatus.OK)
    public void removeCourse(@PathVariable String courseName) {
        Optional<CourseDTO> course = teamService.getCourse(courseName);
        if(!course.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "The course named '"+ courseName +"' was not found");

        teamService.removeCourse(courseName);
    }

}

