package it.polito.ai.virtualLabs.dtos;

import it.polito.ai.virtualLabs.entities.Report;
import lombok.Data;
import javax.persistence.*;

@Data
public class ReportDTO {
    @Id
    Long id;
    Report.ReportStatus status;
    float grade;
}
