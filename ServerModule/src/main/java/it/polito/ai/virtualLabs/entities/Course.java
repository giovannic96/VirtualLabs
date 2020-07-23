package it.polito.ai.virtualLabs.entities;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
public class Course {

    @Id String name;
    String acronym;
    @Min(2) @Max(10)
    int minTeamSize;
    @Min(2) @Max(10)
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

    public void removeStudent(Student s) {
        students.remove(s);
        s.getCourses().remove(this);
    }

    public void addProfessor(Professor p) {
        professors.add(p);
        p.getCourses().add(this);
    }

    public void removeProfessor(Professor p) {
        professors.remove(p);
        p.getCourses().remove(this);
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
