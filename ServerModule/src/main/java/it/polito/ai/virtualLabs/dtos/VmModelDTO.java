package it.polito.ai.virtualLabs.dtos;

import lombok.Data;
import org.springframework.hateoas.RepresentationModel;

import javax.persistence.Id;

@Data
public class VmModelDTO extends RepresentationModel<VmModelDTO> {
    @Id
    Long id;
    String name;
    int maxVCPU;
    int maxDisk;
    int maxRAM;
    int maxTotVM;
    int maxActiveVM;
}
