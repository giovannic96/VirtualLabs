package it.polito.ai.virtualLabs.controllers;

import it.polito.ai.virtualLabs.dtos.StudentDTO;
import it.polito.ai.virtualLabs.services.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("API/students")
public class StudentController {

    @Autowired
    TeamService teamService;

    @GetMapping({"","/"})
    public List<StudentDTO> all() {
        List<StudentDTO> students = teamService.getAllStudents();
        for(StudentDTO s: students)
            ModelHelper.enrich(s);
        return students;
    }

    @GetMapping("/{id}")
    public StudentDTO getOne(@PathVariable String id) {
        Optional<StudentDTO> student = teamService.getStudent(id);
        if(!student.isPresent())
            throw new ResponseStatusException(HttpStatus.CONFLICT, id);
        return ModelHelper.enrich(student.get());
    }

    @PostMapping({"","/"})
    public StudentDTO addStudent(@RequestBody StudentDTO studentDTO) {
        if(!teamService.addStudent(studentDTO))
            throw new ResponseStatusException(HttpStatus.CONFLICT, studentDTO.getId());
        return ModelHelper.enrich(studentDTO);
    }
}
