package it.polito.ai.virtualLabs.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.springframework.boot.context.properties.bind.DefaultValue;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Data
@Entity
public class TeamProposal {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime expiryDate;

    private String teamName;

    @Enumerated(EnumType.STRING)
    private TeamProposalStatus status;

    private String statusDesc;

    @NotNull
    private String creatorId;

    @ElementCollection(fetch=FetchType.EAGER)
    private List<String> tokens = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "course_name")
    Course course;

    @JoinTable(name = "teamProposal_student",
            joinColumns = @JoinColumn(name = "teamProposal_id"),
            inverseJoinColumns = @JoinColumn(name = "student_id"))
    @ManyToMany
    List<Student> students = new ArrayList<>();

    public void addToken(String token) {
        tokens.add(token);
    }

    public void removeToken(String token) {
        tokens.remove(token);
    }

    public void addStudent(Student s) {
        students.add(s);
        s.getTeamProposals().add(this);
    }

    public void removeStudent(Student s) {
        students.remove(s);
        s.getTeamProposals().remove(this);
    }

    public void setCourse(Course c) {
        if(course != null)
            course.getTeamProposals().remove(this);
        if(c != null)
            c.getTeamProposals().add(this);
        course = c;
    }

    public enum TeamProposalStatus {
        PENDING,
        CONFIRMED,
        REJECTED
    }
}
