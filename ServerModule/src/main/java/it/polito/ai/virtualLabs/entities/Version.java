package it.polito.ai.virtualLabs.entities;

import lombok.Builder;
import lombok.Data;
import org.springframework.boot.context.properties.bind.DefaultValue;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import java.time.LocalDateTime;

@Data
@Entity
public class Version {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotEmpty
    private String title;

    private String content;

    private boolean revised = false;

    private LocalDateTime submissionDate = LocalDateTime.now();

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "report_id")
    private Report report;

    public void setReport(Report r) {
        if(report != null)
            report.getVersions().remove(this);
        if(r != null)
            r.getVersions().add(this);
        report = r;
    }
}
