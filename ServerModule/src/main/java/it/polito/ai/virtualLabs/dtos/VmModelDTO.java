package it.polito.ai.virtualLabs.dtos;

import lombok.Data;
import javax.persistence.Id;

@Data
public class VmModelDTO {
    @Id
    Long id;
    String name;
    int maxVCPU;
    int maxDisk;
    int maxRAM;
    int maxTotVM;
    int maxActiveVM;
}
