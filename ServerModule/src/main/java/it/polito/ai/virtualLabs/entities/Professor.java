package it.polito.ai.virtualLabs.entities;

import lombok.Data;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
public class Professor extends User{

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(name = "professor_course",
            joinColumns = @JoinColumn(name="professor_id"),
            inverseJoinColumns = @JoinColumn(name="course_name")
    )
    private List<Course> courses = new ArrayList<>();

    @OneToMany(mappedBy = "professor", cascade = CascadeType.REMOVE, orphanRemoval = true)
    List<Assignment> assignments = new ArrayList<>();

    @OneToMany(mappedBy = "professor", cascade = CascadeType.MERGE)
    private List<VmModel> vmModels = new ArrayList<>();
}
