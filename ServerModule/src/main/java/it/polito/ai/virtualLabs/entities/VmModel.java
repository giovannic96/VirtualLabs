package it.polito.ai.virtualLabs.entities;

import lombok.Data;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
public class VmModel {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private String name;
    private String os;

    private int maxVCPU;
    private int maxDisk;
    private int maxRAM;
    private int maxTotVm;
    private int maxActiveVm;

    @OneToOne
    @JoinColumn(name = "course_name")
    private Course course;

    @OneToMany(mappedBy = "vmModel", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Vm> vms = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "professor_id")
    private Professor professor;

    public void setProfessor(Professor p) {
        if(professor != null)
            professor.getVmModels().remove(this);
        if(p != null)
            p.getVmModels().add(this);
        professor = p;
    }

    public void setCourse(Course c) {
        if(course != null)
            course.setVmModel(null);
        if(c != null)
            c.setVmModel(this);
        course = c;
    }
}
