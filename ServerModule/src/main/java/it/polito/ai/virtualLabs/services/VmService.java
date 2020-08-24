package it.polito.ai.virtualLabs.services;

import it.polito.ai.virtualLabs.dtos.*;

import java.util.List;
import java.util.Optional;

public interface VmService {
    Optional<VmDTO> getVm(Long vmId);
    Optional<VmModelDTO> getVmModel(Long vmModelId);
    Optional<VmModelDTO> getVmModelForVm(Long vmId); //TESTED
    Optional<StudentDTO> getOwner(Long vmId); //TESTED
    Optional<TeamDTO> getTeam(Long vmId); //TESTED
    List<VmModelDTO> getAllVmModels(); //TESTED
    List<VmDTO> getAllVms(); //TESTED
    Optional<VmModelDTO> getCourseVmModel(String courseName);
    Optional<CourseDTO> getVmModelCourse(Long vmModelId);
    Optional<ProfessorDTO> getVmModelProfessor(Long vmModelId);
    List<VmDTO> getVmModelVms(Long vmId);
    List<VmDTO> getCourseVms(String courseName);
    List<VmDTO> getStudentVms(String studentId);
    List<VmDTO> getTeamVms(Long teamId);
    List<VmModelDTO> getProfessorVmModels(String professorId);
    List<AssignmentDTO> getProfessorAssignments(String professorId);

    boolean createVm(VmDTO vmDTO, String studentId, Long teamId); //TESTED
    void removeVm(Long vmId); //TESTED
    boolean editVmResources(Long vmId, int vCPU, int ram, int disk); //TESTED
    boolean powerOnVm(Long vmId); //TESTED
    boolean powerOffVm(Long vmId); //TESTED
    boolean setVmModelToCourse(VmModelDTO vmModelDTO, String courseName, String professorId); // TESTED
    boolean editVmModelSettings(Long vmModelId, VmModelDTO vmModelDTO);
    void removeVmModel(Long vmModelId);
}
