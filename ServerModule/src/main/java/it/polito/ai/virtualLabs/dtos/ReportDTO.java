package it.polito.ai.virtualLabs.dtos;

import it.polito.ai.virtualLabs.entities.Report;
import lombok.Data;
import org.springframework.hateoas.RepresentationModel;

import javax.persistence.*;

@Data
public class ReportDTO extends RepresentationModel<ReportDTO> {
    @Id
    Long id;
    Report.ReportStatus status;
    float grade;
}
