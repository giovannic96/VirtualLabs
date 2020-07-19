package it.polito.ai.virtualLabs.entities;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import java.util.ArrayList;
import java.util.List;

enum ReportStatus {
    NULL,
    READ,
    SUBMITTED,
    REVISED,
}

@Data
@Entity
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Enumerated(EnumType.STRING)
    private ReportStatus status;

    @Min(0)
    @Max(30)
    private float grade;

    @ManyToOne
    @JoinColumn(name = "assignment_id")
    private Assignment assignment;

    @OneToMany(mappedBy = "report", cascade = CascadeType.ALL, orphanRemoval = true)
    List<Version> versions = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "student_matricola")
    private Student student;
}
