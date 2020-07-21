package it.polito.ai.virtualLabs.entities;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class Team {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private String name;

    @ManyToOne
    @JoinColumn(name = "course_name")
    private Course course;

    @JoinTable(name = "team_student",
            joinColumns = @JoinColumn(name = "team_id"),
            inverseJoinColumns = @JoinColumn(name = "student_id"))
    @ManyToMany
    private List<Student> students = new ArrayList<>();

    @OneToMany(mappedBy = "team", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Vm> vms = new ArrayList<>();

    public void setCourse(Course c) {
        if(course != null)
            course.getTeams().remove(this);
        if(c != null)
            c.getTeams().add(this);
        course = c;
    }

    public void addMember(Student s) {
        students.add(s);
        s.getTeams().add(this);
    }

    public void removeMember(Student s) {
        students.remove(s);
        s.getTeams().remove(this);
    }
}
