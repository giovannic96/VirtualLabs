package it.polito.ai.virtualLabs.controllers;

import it.polito.ai.virtualLabs.dtos.AssignmentDTO;
import it.polito.ai.virtualLabs.dtos.ReportDTO;
import it.polito.ai.virtualLabs.dtos.VersionDTO;
import it.polito.ai.virtualLabs.entities.Report;
import it.polito.ai.virtualLabs.services.LabService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
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
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, assignmentId.toString());

        //TODO: da enrichare
        return assignment.get();
    }

    @GetMapping("/reports/{reportId}")
    public ReportDTO report(@PathVariable Long reportId) {
        Optional<ReportDTO> report = labService.getReport(reportId);

        if(!report.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, reportId.toString());

        //TODO: da enrichare
        return report.get();
    }

    @GetMapping("/versions/{versionId}")
    public VersionDTO version(@PathVariable Long versionId) {
        Optional<VersionDTO> version = labService.getVersion(versionId);

        if(!version.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, versionId.toString());

        //TODO: da enrichare
        return version.get();
    }

    @GetMapping("/reports/{reportId}/versions")
    public List<VersionDTO> versionsForReport(@PathVariable Long reportId) {
        Optional<ReportDTO> report = labService.getReport(reportId);

        if(!report.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, reportId.toString());

        List<VersionDTO> versions = labService.getReportVersions(reportId);

        //TODO: da enrichare
        return versions;
    }

    //get list of reports of an assignment of the course for a specific student
    @GetMapping("/assignments/{assignmentId}/reports")
    public List<ReportDTO> reportsForAssignment(@PathVariable Long assignmentId) {
        List<ReportDTO> reports = labService.getAssignmentReports(assignmentId);

        //TODO: da enrichare
        return reports;
    }

    //@PostMapping("/reports/{reportId}/submitVersion")

    //@PutMapping("/reports/{reportId}/gradeReport")
}
