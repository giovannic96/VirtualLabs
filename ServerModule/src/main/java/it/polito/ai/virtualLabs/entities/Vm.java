package it.polito.ai.virtualLabs.entities;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
public class Vm {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private boolean status;

    private int vCPU;
    private int RAM;
    private int disk;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student owner;

    @ManyToOne
    @JoinColumn(name = "team_id")
    private Team team;

    @ManyToOne
    @JoinColumn(name = "vmModel_id")
    private VmModel vmModel;
}
