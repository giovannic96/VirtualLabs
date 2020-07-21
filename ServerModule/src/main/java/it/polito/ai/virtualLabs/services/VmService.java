package it.polito.ai.virtualLabs.services;

import it.polito.ai.virtualLabs.dtos.TeamDTO;
import it.polito.ai.virtualLabs.dtos.UserDTO;
import it.polito.ai.virtualLabs.dtos.VmDTO;
import it.polito.ai.virtualLabs.dtos.VmModelDTO;
import it.polito.ai.virtualLabs.entities.VmModel;

import java.util.List;
import java.util.Optional;

public interface VmService {
    Optional<VmModelDTO> getVmModel(Long vmId); //TESTED
    Optional<UserDTO> getOwner(Long vmId); //TESTED
    Optional<TeamDTO> getTeam(Long vmId); //TESTED
    List<VmModelDTO> getAllVmModels(); //TESTED
    List<VmDTO> getAllVms(); //TESTED

    boolean createVm(VmDTO vmDTO, String studentId, Long teamId); //TESTED
    boolean removeVm(Long vmId); //TESTED
    boolean editVmResources(Long vmId, int vCPU, int ram, int disk); //TESTED
    boolean powerOnVm(Long vmId); //TESTED
    boolean powerOffVm(Long vmId); //TESTED
    boolean setVmModelToCourse(VmModelDTO vmModelDTO, String courseName, String professorId); //TESTED
}
