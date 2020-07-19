package it.polito.ai.virtualLabs.entities;

import lombok.Data;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
public class Course {

    @Id String name;
    String acronym;
    int minTeamSize;
    int maxTeamSize;
    boolean enabled;

    @ManyToMany(mappedBy = "courses")
    List<Student> students = new ArrayList<>();

    @ManyToMany(mappedBy = "courses")
    List<Professor> professors = new ArrayList<>();

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    List<Team> teams = new ArrayList<>();

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    List<TeamProposal> teamProposals = new ArrayList<>();

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    List<Assignment> assignments = new ArrayList<>();

    @OneToOne(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    private VmModel vmModel;

    public void addStudent(Student s) {
        students.add(s);
        s.getCourses().add(this);
    }

    public void addTeam(Team t) {
        teams.add(t);
        t.setCourse(this);
    }

    public void removeTeam(Team t) {
        teams.remove(t);
        t.setCourse(null);
    }
}
