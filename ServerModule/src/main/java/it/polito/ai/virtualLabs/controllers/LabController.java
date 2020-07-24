package it.polito.ai.virtualLabs.controllers;

import it.polito.ai.virtualLabs.dtos.*;
import it.polito.ai.virtualLabs.entities.Report;
import it.polito.ai.virtualLabs.services.LabService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("API/labs")
public class LabController {

    @Autowired
    LabService labService;

    @GetMapping("/assignments/{assignmentId}")
    public AssignmentDTO assignment(@PathVariable Long assignmentId) {
        Optional<AssignmentDTO> assignment = labService.getAssignment(assignmentId);

        if(!assignment.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Assignment with id " + assignmentId + " was not found");

        //TODO: da enrichare
        return assignment.get();
    }

    @GetMapping("/reports/{reportId}")
    public ReportDTO report(@PathVariable Long reportId) {
        Optional<ReportDTO> report = labService.getReport(reportId);

        if(!report.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Report with id " + reportId + " was not found");

        //TODO: da enrichare
        return report.get();
    }

    @GetMapping("/versions/{versionId}")
    public VersionDTO version(@PathVariable Long versionId) {
        Optional<VersionDTO> version = labService.getVersion(versionId);

        if(!version.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Version with id " + versionId + " was not found");

        //TODO: da enrichare
        return version.get();
    }

    @GetMapping("/versions/{versionId}/report")
    public ReportDTO reportForVersion(@PathVariable Long versionId) {
        Optional<ReportDTO> report = labService.getReportForVersion(versionId);

        if(!report.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Report of the version with id " + versionId + " was not found");

        return ModelHelper.enrich(report.get());
    }

    @GetMapping("/reports/{reportId}/assignment")
    public AssignmentDTO assignmentForReport(@PathVariable Long reportId) {
        Optional<AssignmentDTO> assignment = labService.getAssignmentForReport(reportId);

        if(!assignment.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Assignment of the report with id " + reportId + " was not found");

        return ModelHelper.enrich(assignment.get());
    }

    @GetMapping("/reports/{reportId}/owner")
    public StudentDTO reportOwner(@PathVariable Long reportId) {
        Optional<StudentDTO> owner = labService.getReportOwner(reportId);

        if(!owner.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Student of the report with id " + reportId + " was not found");

        return ModelHelper.enrich(owner.get());
    }

    @GetMapping("/reports/{reportId}/versions")
    public List<VersionDTO> versionsForReport(@PathVariable Long reportId) {
        Optional<ReportDTO> report = labService.getReport(reportId);

        if(!report.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Report with id " + reportId + " was not found");

        List<VersionDTO> versions = labService.getReportVersions(reportId);

        //TODO: da enrichare
        return versions;
    }

    //get list of reports of an assignment of the course for a specific student
    @GetMapping("/assignments/{assignmentId}/reports")
    public List<ReportDTO> reportsForAssignment(@PathVariable Long assignmentId) {
        Optional<AssignmentDTO> assignment = labService.getAssignment(assignmentId);
        if(!assignment.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Assignment with id " + assignmentId + " was not found");

        List<ReportDTO> reports = labService.getAssignmentReports(assignmentId);

        //TODO: da enrichare
        return reports;
    }

    @GetMapping("/assignments/{assignmentId}/course")
    public CourseDTO courseForAssignment(@PathVariable Long assignmentId) {
        Optional<CourseDTO> course = labService.getAssignmentCourse(assignmentId);

        if(!course.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Course of the assignment with id " + assignmentId + " was not found");

        return ModelHelper.enrich(course.get());
    }

    @GetMapping("/assignments/{assignmentId}/professor")
    public ProfessorDTO professorForAssignment(@PathVariable Long assignmentId) {
        Optional<ProfessorDTO> professor = labService.getAssignmentProfessor(assignmentId);

        if(!professor.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "The professor of the assignment with id " + assignmentId + " was not found");

        return ModelHelper.enrich(professor.get());
    }

    @PostMapping("/reports/{reportId}/submitVersion")
    @ResponseStatus(HttpStatus.CREATED)
    public VersionDTO submitVersion(@PathVariable Long reportId, @RequestBody VersionDTO versionDTO) {
        Optional<ReportDTO> report = labService.getReport(reportId);

        if(!report.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Report with id " + reportId + " was not found");

        if(labService.addVersionToReport(versionDTO, reportId))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An error occurred");

        //TODO: to enrich
        return versionDTO;
    }

    @PutMapping("/reports/{reportId}/gradeReport")
    @ResponseStatus(HttpStatus.OK)
    public void gradeReport(@PathVariable Long reportId, @RequestBody Map<String, Float> input) {
        if(!input.containsKey("grade"))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);

        float grade = input.get("grade");
        if(!labService.gradeReport(reportId, grade))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Error in grading the report with id: " + reportId);
    }

}
