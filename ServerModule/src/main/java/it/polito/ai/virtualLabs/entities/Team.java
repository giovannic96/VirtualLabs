package it.polito.ai.virtualLabs.entities;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class Team {

    @Id
    @GeneratedValue
    private Long id;

    @NotNull
    private String name;

    @ManyToOne
    @JoinColumn(name = "course_id")
    Course course;

    @JoinTable(name = "team_student",
            joinColumns = @JoinColumn(name = "team_id"),
            inverseJoinColumns = @JoinColumn(name = "student_id"))
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    List<Student> members = new ArrayList<>();

    public void setCourse(Course c) {
        if(course != null)
            course.getTeams().remove(this);
        if(c != null)
            c.getTeams().add(this);
        course = c;
    }

    public void addMember(Student s) {
        members.add(s);
        s.getTeams().add(this);
    }

    public void removeMember(Student s) {
        members.remove(s);
        s.getTeams().remove(this);
    }

}
