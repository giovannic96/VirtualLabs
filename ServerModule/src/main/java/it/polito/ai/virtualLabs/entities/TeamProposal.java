package it.polito.ai.virtualLabs.entities;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
public class TeamProposal {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private String id;

    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime expiryDate;

    @Enumerated(EnumType.STRING)
    private TeamProposalStatus status;

    @ManyToOne
    @JoinColumn(name = "course_name")
    Course course;

    @JoinTable(name = "teamProposal_student",
            joinColumns = @JoinColumn(name = "teamProposal_id"),
            inverseJoinColumns = @JoinColumn(name = "student_id"))
    @ManyToMany
    List<Student> students = new ArrayList<>();

    public enum TeamProposalStatus {
        PENDING,
        CONFIRMED,
        REJECTED
    }
}
