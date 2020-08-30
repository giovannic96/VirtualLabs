package it.polito.ai.virtualLabs.controllers;

import it.polito.ai.virtualLabs.dtos.*;
import it.polito.ai.virtualLabs.entities.TeamProposal;
import it.polito.ai.virtualLabs.services.LabService;
import it.polito.ai.virtualLabs.services.LabServiceImpl;
import org.springframework.hateoas.Link;

import java.util.List;
import java.util.Optional;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

public class ModelHelper {

    private static final String USER_PHOTO_SERVER_URL = "https://virtuallabs.ns0.it/images/user_profiles/";
    private static final String USER_PHOTO_FORMAT = "jpg";
    private static final String VM_CONTENT_SERVER_URL = "https://virtuallabs.ns0.it/images/vm_models/desktop/";
    private static final String VM_CONTENT_FORMAT = "png";
    private static final String VERSION_CONTENT_SERVER_URL = "https://virtuallabs.ns0.it/images/lab/versions/";
    private static final String VERSION_CONTENT_FORMAT = "png";
    private static final String REVIEW_IMAGE_SERVER_URL = "https://virtuallabs.ns0.it/images/lab/reviews/";
    private static final String REVIEW_IMAGE_FORMAT = "png";


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
        courseDTO.add(
                selfLink,
                enrolledLink,
                teamsLink,
                teamProposalsLink,
                assignmentsLink,
                vmModelLink,
                professorsLink
        );
        return courseDTO;
    }

    public static VmModelDTO enrich(VmModelDTO vmModelDTO) {
        Link selfLink = linkTo(methodOn(VmController.class).vmModel(vmModelDTO.getId())).withSelfRel();
        Link course = linkTo(methodOn(VmController.class).course(vmModelDTO.getId())).withRel("course");
        Link professor = linkTo(methodOn(VmController.class).professor(vmModelDTO.getId())).withRel("professor");
        Link vms = linkTo(methodOn(VmController.class).vms(vmModelDTO.getId())).withRel("vms");

        vmModelDTO.add(
                selfLink,
                course,
                professor,
                vms
        );
        return vmModelDTO;
    }

    public static VmDTO enrich(VmDTO vmDTO) {

        Link selfLink = linkTo(methodOn(VmController.class).getOne(vmDTO.getId())).withSelfRel();
        Link student = linkTo(methodOn(VmController.class).owner(vmDTO.getId())).withRel("owner");
        Link team = linkTo(methodOn(VmController.class).team(vmDTO.getId())).withRel("team");
        Link vmModel = linkTo(methodOn(VmController.class).vmModelByVmId(vmDTO.getId())).withRel("vmModel");

        vmDTO.setContent(VM_CONTENT_SERVER_URL + vmDTO.getContent() + "." + VM_CONTENT_FORMAT);

        vmDTO.add(
                selfLink,
                student,
                team,
                vmModel
        );

        return vmDTO;
    }

    public static TeamDTO enrich(TeamDTO teamDTO) {
        Link selfLink = linkTo(TeamController.class).slash(teamDTO.getId()).withSelfRel();
        Link course = linkTo(methodOn(TeamController.class).course(teamDTO.getId())).withRel("course");
        Link members = linkTo(methodOn(TeamController.class).members(teamDTO.getId())).withRel("members");
        Link vms = linkTo(methodOn(TeamController.class).vmsForTeam(teamDTO.getId())).withRel("vms");

        teamDTO.add(
                selfLink,
                course,
                members,
                vms
        );

        return teamDTO;
    }

    public static TeamProposalDTO enrich(TeamProposalDTO teamProposalDTO) {
        Link selfLink = linkTo(methodOn(TeamController.class).getOneProposal(teamProposalDTO.getId())).withSelfRel();
        Link course = linkTo(methodOn(TeamController.class).teamProposalCourse(teamProposalDTO.getId())).withRel("course");
        Link members = linkTo(methodOn(TeamController.class).teamProposalMembers(teamProposalDTO.getId())).withRel("members");

        teamProposalDTO.add(
                selfLink,
                course,
                members
        );

        return teamProposalDTO;
    }

    public static VersionDTO enrich(VersionDTO versionDTO) {
        Link selfLink = linkTo(methodOn(LabController.class).version(versionDTO.getId())).withSelfRel();
        Link report = linkTo(methodOn(LabController.class).reportForVersion(versionDTO.getId())).withRel("reports");


        String imageCode = versionDTO.getContent();
        versionDTO.setContent(VERSION_CONTENT_SERVER_URL + imageCode + "." + VERSION_CONTENT_FORMAT);
        if(versionDTO.isRevised())
            versionDTO.setReview(REVIEW_IMAGE_SERVER_URL + imageCode + "." + REVIEW_IMAGE_FORMAT);
        else
            versionDTO.setReview(null);

        versionDTO.add(
                selfLink,
                report
        );

        return versionDTO;
    }

    public static ReportDTO enrich(ReportDTO reportDTO) {
        Link selfLink = linkTo(methodOn(LabController.class).report(reportDTO.getId())).withSelfRel();
        Link versions = linkTo(methodOn(LabController.class).versionsForReport(reportDTO.getId())).withRel("versions");
        Link assignment = linkTo(methodOn(LabController.class).assignmentForReport(reportDTO.getId())).withRel("assignment");
        Link owner = linkTo(methodOn(LabController.class).reportOwner(reportDTO.getId())).withRel("owner");

        reportDTO.add(
                selfLink,
                versions,
                assignment,
                owner
        );

        return reportDTO;
    }

    public static AssignmentDTO enrich(AssignmentDTO assignmentDTO) {
        Link selfLink = linkTo(methodOn(LabController.class).assignment(assignmentDTO.getId())).withSelfRel();
        Link reports = linkTo(methodOn(LabController.class).reportsForAssignment(assignmentDTO.getId())).withRel("reports");
        Link professor = linkTo(methodOn(LabController.class).professorForAssignment(assignmentDTO.getId())).withRel("professor");
        Link course = linkTo(methodOn(LabController.class).courseForAssignment(assignmentDTO.getId())).withRel("course");

        assignmentDTO.add(
                selfLink,
                reports,
                professor,
                course
        );

        return assignmentDTO;
    }

    public static StudentDTO enrich(StudentDTO studentDTO) {
        Link selfLink = linkTo(StudentController.class).slash(studentDTO.getId()).withSelfRel();
        Link courses = linkTo(methodOn(StudentController.class).courses(studentDTO.getId())).withRel("courses");
        Link teamProposals = linkTo(methodOn(StudentController.class).teamProposals(studentDTO.getId())).withRel("teamProposals");
        Link teams = linkTo(methodOn(StudentController.class).teams(studentDTO.getId())).withRel("teams");
        Link vms = linkTo(methodOn(StudentController.class).vms(studentDTO.getId())).withRel("vms");
        Link reports = linkTo(methodOn(StudentController.class).reports(studentDTO.getId())).withRel("reports");

        studentDTO.setPhoto(USER_PHOTO_SERVER_URL + studentDTO.getPhoto() + "." + USER_PHOTO_FORMAT);

        studentDTO.add(
                selfLink,
                courses,
                teamProposals,
                teams,
                vms,
                reports
        );

        return studentDTO;
    }

    public static ProfessorDTO enrich(ProfessorDTO professorDTO) {
        Link selfLink = linkTo(ProfessorController.class).slash(professorDTO.getId()).withSelfRel();
        Link courses = linkTo(methodOn(ProfessorController.class).courses(professorDTO.getId())).withRel("courses");
        Link vmModels = linkTo(methodOn(ProfessorController.class).vmModels(professorDTO.getId())).withRel("vmModels");
        Link assignments = linkTo(methodOn(ProfessorController.class).assignments(professorDTO.getId())).withRel("assignments");

        professorDTO.setPhoto(USER_PHOTO_SERVER_URL + professorDTO.getPhoto() + "." + USER_PHOTO_FORMAT);

        professorDTO.add(
                selfLink,
                courses,
                vmModels,
                assignments
        );

        return professorDTO;
    }

}
