package it.polito.ai.esercitazione3.entities;

import lombok.Data;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
public class Student {

    @Id
    private String id;
    private String name;
    private String firstName;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(name = "student_course", // tabella aggiuntiva che serve per implementare la relazione molti-a-molti
            joinColumns = @JoinColumn(name="student_id"),
            inverseJoinColumns = @JoinColumn(name="course_name")
    )
    private List<Course> courses = new ArrayList<>();

    @ManyToMany(mappedBy = "members")
    private List<Team> teams = new ArrayList<>();

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public void addCourse(Course c) {
        courses.add(c);
        c.getStudents().add(this);
    }

    public void addToTeam(Team t) {
        teams.add(t);
        t.getMembers().add(this);
    }

    public void removeFromTeam(Team t) {
        teams.remove(t);
        t.getMembers().remove(this);
    }
}
