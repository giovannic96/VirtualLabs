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
        return ModelHelper.enrich(assignment.get());
    }

    @GetMapping("/reports/{reportId}")
    public ReportDTO report(@PathVariable Long reportId) {
        Optional<ReportDTO> report = labService.getReport(reportId);
        if(!report.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Report with id " + reportId + " was not found");
        return ModelHelper.enrich(report.get());
    }

    @GetMapping("/versions/{versionId}")
    public VersionDTO version(@PathVariable Long versionId) {
        Optional<VersionDTO> version = labService.getVersion(versionId);
        if(!version.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Version with id " + versionId + " was not found");
        return ModelHelper.enrich(version.get());
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
        List<VersionDTO> versions = labService.getReportVersions(reportId);
        for(VersionDTO v : versions)
            ModelHelper.enrich(v);
        return versions;
    }

    //get list of reports of an assignment of the course for a specific student
    @GetMapping("/assignments/{assignmentId}/reports")
    public List<ReportDTO> reportsForAssignment(@PathVariable Long assignmentId) {
        List<ReportDTO> reports = labService.getAssignmentReports(assignmentId);
        for(ReportDTO r : reports)
            ModelHelper.enrich(r);
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
        if(!labService.addVersionToReport(versionDTO, reportId))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An error occurred");
        return ModelHelper.enrich(versionDTO);
    }

    @PostMapping("/versions/{versionId}/review")
    @ResponseStatus(HttpStatus.CREATED)
    public void reviewVersion(@PathVariable Long versionId, @RequestBody String review) {
        if(!labService.reviewVersion(versionId, review))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An error occurred");
    }

    @PutMapping("/reports/{reportId}/gradeReport")
    @CrossOrigin // TODO: just for test in localhost, remove when finished
    @ResponseStatus(HttpStatus.OK)
    public void gradeReport(@PathVariable Long reportId, @RequestBody Map<String, Float> input) {
        if(!input.containsKey("grade"))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);

        float grade = input.get("grade");
        if(!labService.gradeReport(reportId, grade))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Error in grading the report with id: " + reportId);
    }

    @PutMapping("/assignments/{assignmentId}")
    @CrossOrigin // TODO: just for test in localhost, remove when finished
    @ResponseStatus(HttpStatus.OK)
    public void editAssignment(@PathVariable Long assignmentId, @RequestBody AssignmentDTO assignmentDTO) {
        Optional<AssignmentDTO> currentAssignment = labService.getAssignment(assignmentId);

        if(!currentAssignment.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "The assignment with id '"+ assignmentId +"' was not found");
        if(!labService.editAssignment(currentAssignment.get().getId(), assignmentDTO))
            throw new ResponseStatusException(HttpStatus.NOT_MODIFIED, "The assignment named '" + assignmentDTO.getName() + "' was not modified");
    }

    @DeleteMapping("/assignments/{assignmentId}")
    @CrossOrigin // TODO: just for test in localhost, remove when finished
    @ResponseStatus(HttpStatus.OK)
    public void deleteAssignment(@PathVariable Long assignmentId) {
        Optional<AssignmentDTO> currentAssignment = labService.getAssignment(assignmentId);

        if(!currentAssignment.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "The assignment with id '"+ assignmentId +"' was not found");
        if(!labService.removeAssignment(currentAssignment.get().getId()))
            throw new ResponseStatusException(HttpStatus.NOT_MODIFIED, "The assignment named '" + currentAssignment.get().getName() + "' was not removed");
    }
}

