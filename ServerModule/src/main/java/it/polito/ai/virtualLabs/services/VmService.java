package it.polito.ai.virtualLabs.services;

import it.polito.ai.virtualLabs.dtos.*;

import java.util.List;
import java.util.Optional;

public interface VmService {
    Optional<VmDTO> getVm(Long vmId);
    Optional<VmModelDTO> getVmModel(Long vmModelId);
    Optional<VmModelDTO> getVmModelForVm(Long vmId);
    Optional<StudentDTO> getOwner(Long vmId);
    Optional<TeamDTO> getTeam(Long vmId);
    List<VmModelDTO> getAllVmModels();
    List<VmDTO> getAllVms();
    Optional<VmModelDTO> getCourseVmModel(String courseName);
    Optional<CourseDTO> getVmModelCourse(Long vmModelId);
    Optional<ProfessorDTO> getVmModelProfessor(Long vmModelId);
    List<VmDTO> getVmModelVms(Long vmId);
    List<VmDTO> getCourseVms(String courseName);
    List<VmDTO> getStudentVms(String studentId);
    List<VmDTO> getTeamVms(Long teamId);
    List<VmModelDTO> getProfessorVmModels(String professorId);
    List<AssignmentDTO> getProfessorAssignments(String professorId);

    boolean createVm(VmDTO vmDTO, String studentId, Long teamId);
    void removeVm(Long vmId);
    boolean editVmResources(Long vmId, int vCPU, int ram, int disk);
    boolean powerOnVm(Long vmId);
    boolean powerOffVm(Long vmId);
    boolean setVmModelToCourse(VmModelDTO vmModelDTO, String courseName, String professorId);
    boolean editVmModelSettings(Long vmModelId, VmModelDTO vmModelDTO);
    void removeVmModel(Long vmModelId);
    void changeVmContentRandom(Long vmId);
}
