package it.polito.ai.virtualLabs.dtos;

import lombok.Data;
import org.springframework.hateoas.RepresentationModel;

import javax.persistence.Id;

@Data
public class VmDTO extends RepresentationModel<VmDTO> {
    @Id
    Long id;
    boolean active;
    int vCPU;
    int RAM;
    int disk;
}
