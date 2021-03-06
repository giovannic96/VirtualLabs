package it.polito.ai.virtualLabs.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.hibernate.validator.constraints.Length;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
public class Assignment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private String name;

    private LocalDateTime releaseDate;

    @DateTimeFormat(iso = ISO.DATE_TIME)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime expiryDate;

    @Column(name = "content", length = 1024)
    @Length(max = 1024)
    private String content;

    @ManyToOne
    @JoinColumn(name = "course_name")
    private Course course;

    @OneToMany(mappedBy = "assignment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Report> reports = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "professor_id")
    private Professor professor;

    public void addReport(Report r) {
        reports.add(r);
        r.setAssignment(this);
    }

    public void setProfessor(Professor p) {
        if(professor != null)
            professor.getAssignments().remove(this);
        if(p != null)
            p.getAssignments().add(this);
        professor = p;
    }

    public void setCourse(Course c) {
        if(course != null)
            course.getAssignments().remove(this);
        if(c != null)
            c.getAssignments().add(this);
        course = c;
    }
}
