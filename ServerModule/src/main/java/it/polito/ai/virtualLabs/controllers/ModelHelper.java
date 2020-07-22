package it.polito.ai.virtualLabs.controllers;

import it.polito.ai.virtualLabs.dtos.CourseDTO;
import it.polito.ai.virtualLabs.dtos.ProfessorDTO;
import it.polito.ai.virtualLabs.dtos.StudentDTO;
import it.polito.ai.virtualLabs.dtos.VmModelDTO;
import org.springframework.hateoas.Link;

import java.util.List;
import java.util.Optional;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

public class ModelHelper {

    public static CourseDTO enrich(CourseDTO courseDTO) {
        //create links
        Link selfLink = linkTo(CourseController.class).slash(courseDTO.getName()).withSelfRel();
        Link enrolledLink = linkTo(methodOn(CourseController.class).enrolledStudents(courseDTO.getName())).withRel("enrolled");
        Link teamsLink = linkTo(methodOn(CourseController.class).teams(courseDTO.getName())).withRel("teams");
        Link teamProposalsLink = linkTo(methodOn(CourseController.class).teamProposals(courseDTO.getName())).withRel("teamProposals");
        Link assignmentsLink = linkTo(methodOn(CourseController.class).assignments(courseDTO.getName())).withRel("assignments");
        Link vmModelLink = linkTo(methodOn(CourseController.class).vmModel(courseDTO.getName())).withRel("vmModel");
        Link professorsLink = linkTo(methodOn(CourseController.class).professors(courseDTO.getName())).withRel("professors");

        //add links to DTO
        courseDTO.add(selfLink);
        courseDTO.add(enrolledLink);
        courseDTO.add(teamsLink);
        courseDTO.add(teamProposalsLink);
        courseDTO.add(assignmentsLink);
        courseDTO.add(vmModelLink);
        courseDTO.add(professorsLink);
        return courseDTO;
    }

    public static StudentDTO enrich(StudentDTO studentDTO) {
        Link selfLink = linkTo(StudentController.class).slash(studentDTO.getId()).withSelfRel();
        studentDTO.add(selfLink);
        return studentDTO;
    }

    public static VmModelDTO enrich(VmModelDTO vmModelDTO) {
        Link selfLink = linkTo(methodOn(VmController.class).vmModel(vmModelDTO.getId())).withSelfRel();
        return vmModelDTO;
    }

    public static ProfessorDTO enrich(ProfessorDTO professorDTO) {
        return professorDTO;
    }
}
