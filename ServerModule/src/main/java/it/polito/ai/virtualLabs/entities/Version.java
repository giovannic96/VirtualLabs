package it.polito.ai.virtualLabs.entities;

import lombok.Data;

import javax.persistence.*;
import java.util.Calendar;

@Data
@Entity
public class Version {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String content;

    @Temporal(TemporalType.TIMESTAMP)
    private Calendar submissionDate;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "report_id")
    private Report report;
}
