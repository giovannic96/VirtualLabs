package it.polito.ai.virtualLabs.entities;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
public class Vm {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private boolean active;

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

    private String content;

    public void setTeam(Team t) {
        if(team != null)
            team.getVms().remove(this);
        if(t != null)
            t.getVms().add(this);
        team = t;
    }

    public void setVmModel(VmModel v) {
        if(vmModel != null)
            vmModel.getVms().remove(this);
        if(v != null)
            v.getVms().add(this);
        vmModel = v;
    }

    public void setOwner(Student s) {
        if(owner != null)
            owner.getVms().remove(this);
        if(s != null)
            s.getVms().add(this);
        owner = s;
    }
}
