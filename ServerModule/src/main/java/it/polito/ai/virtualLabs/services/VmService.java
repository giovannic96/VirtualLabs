package it.polito.ai.virtualLabs.services;

import it.polito.ai.virtualLabs.dtos.TeamDTO;
import it.polito.ai.virtualLabs.dtos.UserDTO;
import it.polito.ai.virtualLabs.dtos.VmDTO;
import it.polito.ai.virtualLabs.dtos.VmModelDTO;

import java.util.List;
import java.util.Optional;

public interface VmService {
    Optional<VmModelDTO> getVmModel(Long vmId);
    Optional<UserDTO> getOwner(Long vmId);
    Optional<TeamDTO> getTeam(Long vmId);
    List<VmModelDTO> getAllVmModels();
    List<VmDTO> getAllVms();
    boolean createVm(VmDTO vmDTO, String studentId, Long teamId, Long vmModelId);
    boolean removeVm(Long vmId);
    boolean editVmResources(Long vmId, int vCPU, int ram, int disk);
    boolean powerOnVm(Long vmId);
    boolean powerOffVm(Long vmId);
}
