package it.polito.ai.esercitazione3.controllers;

import it.polito.ai.esercitazione3.dtos.CourseDTO;
import it.polito.ai.esercitazione3.dtos.StudentDTO;
import it.polito.ai.esercitazione3.services.TeamService;
import it.polito.ai.esercitazione3.services.exceptions.file.ParsingFileException;
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

    @GetMapping({"","/"})
    public List<CourseDTO> all() {
        List<CourseDTO> courses = teamService.getAllCourses();
        for(CourseDTO c: courses)
            ModelHelper.enrich(c);
        return courses;
    }

    @GetMapping("/{name}")
    public CourseDTO getOne(@PathVariable String name) {
        Optional<CourseDTO> course = teamService.getCourse(name);
        if(!course.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        return ModelHelper.enrich(course.get());
    }

    @GetMapping("/{name}/enrolled")
    public List<StudentDTO> enrolledStudents(@PathVariable String name) {
        return teamService.getEnrolledStudents(name);
    }

    @PostMapping({"","/"})
    public CourseDTO addCourse(@RequestBody CourseDTO courseDTO) {
        if(!teamService.addCourse(courseDTO))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Errore nell'inserimento del corso: " + courseDTO.getName());
        return ModelHelper.enrich(courseDTO);
    }

    @PostMapping("/{name}/enrollOne")
    @ResponseStatus(HttpStatus.CREATED)
    public void enrollStudent(@PathVariable String name, @RequestBody Map<String,String> input) {
        if(!input.containsKey("id"))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        String id = input.get("id");
        if(!teamService.addStudentToCourse(id, name))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Errore nell'iscrizione dello studente con id: " + id);
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
}

