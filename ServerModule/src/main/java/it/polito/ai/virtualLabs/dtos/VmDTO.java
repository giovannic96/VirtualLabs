package it.polito.ai.virtualLabs.dtos;

import lombok.Data;
import javax.persistence.Id;

@Data
public class VmDTO {
    @Id
    Long id;
    boolean active;
    int vCPU;
    int RAM;
    int disk;
}
