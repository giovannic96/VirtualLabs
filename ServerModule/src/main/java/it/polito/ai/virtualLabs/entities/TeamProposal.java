package it.polito.ai.virtualLabs.entities;

import lombok.Data;
import org.springframework.boot.context.properties.bind.DefaultValue;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
public class TeamProposal {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime expiryDate;

    private String teamName;

    @Enumerated(EnumType.STRING)
    private TeamProposalStatus status;

    private String statusDesc;

    private int missing;

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
