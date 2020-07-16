package it.polito.ai.esercitazione3.controllers;

import it.polito.ai.esercitazione3.dtos.CourseDTO;
import it.polito.ai.esercitazione3.dtos.StudentDTO;
import org.springframework.hateoas.Link;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

public class ModelHelper {

    public static CourseDTO enrich(CourseDTO courseDTO) {
        //create links
        Link selfLink = linkTo(CourseController.class).slash(courseDTO.getName()).withSelfRel();
        Link enrolledLink = linkTo(methodOn(CourseController.class).enrolledStudents(courseDTO.getName())).withRel("enrolled");

        //add links to DTO
        courseDTO.add(selfLink);
        courseDTO.add(enrolledLink);
        return courseDTO;
    }

    public static StudentDTO enrich(StudentDTO studentDTO) {
        Link selfLink = linkTo(StudentController.class).slash(studentDTO.getId()).withSelfRel();
        studentDTO.add(selfLink);
        return studentDTO;
    }
}
