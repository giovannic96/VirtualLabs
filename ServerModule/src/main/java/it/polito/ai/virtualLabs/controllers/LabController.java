package it.polito.ai.virtualLabs.controllers;

import it.polito.ai.virtualLabs.dtos.*;
import it.polito.ai.virtualLabs.services.LabService;
import it.polito.ai.virtualLabs.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("API/labs")
public class LabController {

    @Autowired
    LabService labService;

    @Autowired
    NotificationService notificationService;

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

    @GetMapping("/assignments/{assignmentId}/reports")
    public List<ReportDTO> reportsForAssignment(@PathVariable Long assignmentId) {
        List<ReportDTO> reports = labService.getAssignmentReports(assignmentId);
        for(ReportDTO r : reports)
            ModelHelper.enrich(r);
        return reports;
    }

    @GetMapping("/assignments/{assignmentId}/studentReport")
    public ReportDTO studentReportForAssignment(@PathVariable Long assignmentId,
                                                       @AuthenticationPrincipal UserDetails userDetails) {
        Optional<ReportDTO> report = labService.getStudentReportForAssignment(userDetails.getUsername(), assignmentId);
        if(!report.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Report of the assignment with id " + assignmentId + " was not found");
        return ModelHelper.enrich(report.get());
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
    public void submitVersion(@PathVariable Long reportId,
                                    @RequestParam("title") String title,
                                    @RequestParam("file") MultipartFile file) {

        if(!labService.addVersionToReport(reportId, title, file))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An error occurred");
    }

    @PostMapping("/versions/{versionId}/review")
    @ResponseStatus(HttpStatus.CREATED)
    public void reviewVersion(@PathVariable Long versionId, @RequestBody String review) {
        if(!labService.reviewVersion(versionId, review))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An error occurred");

        ReportDTO reportDTO = this.labService.getReportForVersion(versionId).get();
        StudentDTO studentDTO = this.labService.getReportOwner(reportDTO.getId()).get();
        String assignmentName = this.labService.getAssignmentForReport(reportDTO.getId()).get().getName();
        String userEmail = studentDTO.getUsername();

        String subject = "Review submitted on last version";
        String body = "Your last version of the assignment " + assignmentName
                + " has been revised by the professor.<br>Go to your personal page to check the review.";

        try {
            this.notificationService.sendMessage(userEmail, subject, body);
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Error while sending email");
        }
    }

    @PutMapping("/reports/{reportId}/gradeReport")
    @ResponseStatus(HttpStatus.OK)
    public void gradeReport(@PathVariable Long reportId, @RequestBody Map<String, Object> input) {
        if(!input.containsKey("grade") || !input.containsKey("comment"))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);

        Float grade = Float.valueOf(input.get("grade").toString());
        if(!labService.gradeReport(reportId, grade))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Error in grading the report with id: " + reportId);

        if(!this.labService.getReport(reportId).isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Report with id " + reportId + " was not found");

        String assignmentName = this.labService.getAssignmentForReport(reportId).get().getName();
        String subject = "Report evaluation";
        String comment = input.get("comment") == "" ?
                "Professor didn't leave a comment" :
                "Comment of the Professor: " + input.get("comment");
        String body = "The report for the assignment " + assignmentName + "was evaluated.<br><br>Your grade is: " + input.get("grade") + "<br>."
                + "<br>" + comment;

        String userEmail = this.labService.getReportOwner(reportId).get().getUsername();
        try {
            this.notificationService.sendMessage(userEmail, subject, body);
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Error while sending email");
        }
    }

    @PutMapping("/reports/{reportId}/markAsRead")
    @ResponseStatus(HttpStatus.OK)
    public void markReportAsRead(@PathVariable Long reportId) {
        if(!labService.markReportAsRead(reportId))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Error in updating report " + reportId + "status");
    }

    @PutMapping("/assignments/{assignmentId}")
    @ResponseStatus(HttpStatus.OK)
    public void editAssignment(@PathVariable Long assignmentId, @RequestBody AssignmentDTO assignmentDTO) {
        Optional<AssignmentDTO> currentAssignment = labService.getAssignment(assignmentId);

        if(!currentAssignment.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "The assignment with id '"+ assignmentId +"' was not found");
        if(!labService.editAssignment(currentAssignment.get().getId(), assignmentDTO))
            throw new ResponseStatusException(HttpStatus.NOT_MODIFIED, "The assignment named '" + assignmentDTO.getName() + "' was not modified");
    }

    @DeleteMapping("/assignments/{assignmentId}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteAssignment(@PathVariable Long assignmentId) {
        Optional<AssignmentDTO> currentAssignment = labService.getAssignment(assignmentId);

        if(!currentAssignment.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "The assignment with id '"+ assignmentId +"' was not found");
        if(!labService.removeAssignment(currentAssignment.get().getId()))
            throw new ResponseStatusException(HttpStatus.NOT_MODIFIED, "The assignment named '" + currentAssignment.get().getName() + "' was not removed");
    }
}

