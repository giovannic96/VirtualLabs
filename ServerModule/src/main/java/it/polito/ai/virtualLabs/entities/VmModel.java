package it.polito.ai.virtualLabs.entities;

import lombok.Data;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
public class VmModel {

    @Id @GeneratedValue
    private Long id;

    @NotNull
    private String name;

    private int maxVCPU;
    private int maxDisk;
    private int maxRAM;
    private int maxTotVM;
    private int maxActiveVM;

    @OneToOne
    @JoinColumn(name = "course_name")
    private Course course;

    @OneToMany(mappedBy = "vmModel", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Vm> vms = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "professor_matricola")
    private Professor professor;
}
