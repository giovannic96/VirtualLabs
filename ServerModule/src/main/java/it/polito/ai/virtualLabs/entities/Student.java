package it.polito.ai.virtualLabs.entities;

import lombok.Data;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
public class Student extends User{

    @ManyToMany
    @JoinTable(name = "student_course",
            joinColumns = @JoinColumn(name="student_id"),
            inverseJoinColumns = @JoinColumn(name="course_name")
    )
    private List<Course> courses = new ArrayList<>();

    @ManyToMany(mappedBy = "students")
    private List<Team> teams = new ArrayList<>();

    @OneToMany(mappedBy = "student", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Report> reports = new ArrayList<>();

    @ManyToMany(mappedBy = "students")
    private List<TeamProposal> teamProposals = new ArrayList<>();

    @OneToMany(mappedBy = "owner", cascade = CascadeType.MERGE)
    private List<Vm> vms = new ArrayList<>();

    public void addCourse(Course c) {
        courses.add(c);
        c.getStudents().add(this);
    }

    public void addToTeam(Team t) {
        teams.add(t);
        t.getStudents().add(this);
    }

    public void removeFromTeam(Team t) {
        teams.remove(t);
        t.getStudents().remove(this);
    }
}
