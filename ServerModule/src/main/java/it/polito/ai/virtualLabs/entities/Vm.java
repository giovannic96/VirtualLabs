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
}
