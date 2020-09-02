package it.polito.ai.virtualLabs.dtos;

import it.polito.ai.virtualLabs.entities.Report;
import lombok.Data;
import org.springframework.hateoas.RepresentationModel;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
public class ReportDTO extends RepresentationModel<ReportDTO> {
    @Id
    Long id;
    Report.ReportStatus status;
    LocalDateTime statusDate;
    Float grade;
}
