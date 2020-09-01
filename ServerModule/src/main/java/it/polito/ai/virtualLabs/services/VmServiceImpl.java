package it.polito.ai.virtualLabs.services;

import it.polito.ai.virtualLabs.dtos.*;
import it.polito.ai.virtualLabs.entities.*;
import it.polito.ai.virtualLabs.repositories.*;
import it.polito.ai.virtualLabs.services.exceptions.course.CourseNotFoundException;
import it.polito.ai.virtualLabs.services.exceptions.professor.ProfessorNotFoundException;
import it.polito.ai.virtualLabs.services.exceptions.student.StudentNotFoundException;
import it.polito.ai.virtualLabs.services.exceptions.team.TeamNotFoundException;
import it.polito.ai.virtualLabs.services.exceptions.vm.VmNotFoundException;
import it.polito.ai.virtualLabs.services.exceptions.vmmodel.VmModelNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@Transactional
public class VmServiceImpl implements VmService {

    @Autowired
    VmRepository vmRepository;
    @Autowired
    VmModelRepository vmModelRepository;
    @Autowired
    TeamRepository teamRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    CourseRepository courseRepository;
    @Autowired
    ModelMapper modelMapper;

    @Override
    public Optional<VmDTO> getVm(Long vmId) {
        if (!vmRepository.existsById(vmId))
            return Optional.empty();
        return Optional.of(vmRepository.getOne(vmId))
                .map(vm -> modelMapper.map(vm, VmDTO.class));
    }

    @Override
    public Optional<VmModelDTO> getVmModel(Long vmModelId) {
        if (!vmModelRepository.existsById(vmModelId))
            return Optional.empty();
        return Optional.of(vmModelRepository.getOne(vmModelId))
                .map(vmModel -> modelMapper.map(vmModel, VmModelDTO.class));
    }

    @Override
    public Optional<VmModelDTO> getVmModelForVm(Long vmId) {
        if (!vmRepository.existsById(vmId))
            return Optional.empty();
        return Optional.of(vmRepository.getOne(vmId).getVmModel())
                .map(vmModel -> modelMapper.map(vmModel, VmModelDTO.class));
    }

    @Override
    public Optional<StudentDTO> getOwner(Long vmId) {
        if (!vmRepository.existsById(vmId))
            return Optional.empty();
        return Optional.of(vmRepository.getOne(vmId).getOwner())
                .map(owner -> modelMapper.map(owner, StudentDTO.class));
    }

    @Override
    public Optional<TeamDTO> getTeam(Long vmId) {
        if (!vmRepository.existsById(vmId))
            return Optional.empty();
        return Optional.of(vmRepository.getOne(vmId).getTeam())
                .map(team -> modelMapper.map(team, TeamDTO.class));
    }

    @Override
    public List<VmModelDTO> getAllVmModels() {
        return vmModelRepository.findAll()
                .stream()
                .map(vmModel -> modelMapper.map(vmModel, VmModelDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<VmDTO> getAllVms() {
        return vmRepository.findAll()
                .stream()
                .map(vm -> modelMapper.map(vm, VmDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public Optional<VmModelDTO> getCourseVmModel(String courseName) {
        if(!courseRepository.existsById(courseName))
            throw new CourseNotFoundException("The course named " + courseName + " does not exist");

        Optional<VmModel> vmModel = vmModelRepository.findByCourseName(courseName);
        if(!vmModel.isPresent())
            return Optional.empty();

        return vmModel.map(v -> modelMapper.map(v, VmModelDTO.class));
    }

    @Override
    public Optional<CourseDTO> getVmModelCourse(Long vmModelId) {
        if(!vmModelRepository.existsById(vmModelId))
            throw new CourseNotFoundException("The vm model with id '" + vmModelId + "' does not exist");

        Optional<Course> course = courseRepository.findById(vmModelRepository.getOne(vmModelId).getCourse().getName());
        if(!course.isPresent())
            return Optional.empty();

        return course.map(c -> modelMapper.map(c, CourseDTO.class));
    }

    @Override
    public Optional<ProfessorDTO> getVmModelProfessor(Long vmModelId) {
        if(!vmModelRepository.existsById(vmModelId))
            throw new CourseNotFoundException("The vm model with id '" + vmModelId + "' does not exist");

        Optional<Professor> professor = userRepository.findProfessorById(vmModelRepository.getOne(vmModelId).getProfessor().getId());
        if(!professor.isPresent())
            return Optional.empty();

        return professor.map(p -> modelMapper.map(p, ProfessorDTO.class));
    }

    @Override
    public List<VmDTO> getVmModelVms(Long vmModelId) {
        return vmRepository.findAllByVmModelId(vmModelId)
                .stream()
                .map(vm -> modelMapper.map(vm, VmDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<VmDTO> getCourseVms(String courseName) {
        if(!courseRepository.existsById(courseName))
            throw new CourseNotFoundException("The course named " + courseName + " does not exist");

        Optional<VmModel> vmModelOpt = vmModelRepository.findByCourseName(courseName);
        return vmModelOpt.map(vmModel -> vmModel.getVms()
                .stream()
                .map(v -> modelMapper.map(v, VmDTO.class))
                .collect(Collectors.toList())).orElseGet(ArrayList::new);
    }

    @Override
    public List<VmDTO> getStudentVms(String studentId) {
        if(!userRepository.studentExistsById(studentId))
            throw new StudentNotFoundException("The student with id " + studentId + " does not exist");


        return userRepository.getStudentById(studentId).getVms()
                .stream()
                .map(v -> modelMapper.map(v, VmDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<VmDTO> getTeamVms(Long teamId) {
        if(!teamRepository.existsById(teamId))
            throw new TeamNotFoundException("The team with id " + teamId + " does not exist");

        return teamRepository.getOne(teamId).getVms()
                .stream()
                .map(v -> modelMapper.map(v, VmDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<VmModelDTO> getProfessorVmModels(String professorId) {
        if (!userRepository.professorExistsById(professorId))
            throw new StudentNotFoundException("The professor with id '" + professorId + "' does not exists");

        return userRepository.getProfessorById(professorId).getVmModels()
                .stream()
                .map(v -> modelMapper.map(v, VmModelDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<AssignmentDTO> getProfessorAssignments(String professorId) {
        if (!userRepository.professorExistsById(professorId))
            throw new StudentNotFoundException("The professor with id '" + professorId + "' does not exists");

        return userRepository.getProfessorById(professorId).getAssignments()
                .stream()
                .map(a -> modelMapper.map(a, AssignmentDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public boolean createVm(VmDTO vmDTO, String studentId, Long teamId) {
        if(!teamRepository.existsById(teamId))
            throw new TeamNotFoundException("The team with id " + teamId + " does not exist");
        if(!userRepository.studentExistsById(studentId))
            throw new StudentNotFoundException("The student with id " + studentId + " does not exist");

        Team team = teamRepository.getOne(teamId);
        List<Vm> teamVms = team.getVms();
        VmModel vmModel = team.getCourse().getVmModel();

        //check if the course to which the team belongs has no vmModel yet
        if(vmModel == null)
            throw new VmModelNotFoundException("There is no VmModel for this course yet");

        //check number of vms and resources constraints
        if(teamVms.size() >= vmModel.getMaxTotVm() ||
            resourcesExceeded(teamVms, vmModel, vmDTO.getVCPU(), vmDTO.getRAM(), vmDTO.getDisk()))
            return false;

        //create VM
        Vm vm = modelMapper.map(vmDTO, Vm.class);
        vm.setOwner(userRepository.getStudentById(studentId));
        vm.setTeam(team);
        vm.setVmModel(vmModel);

        vm.setContent(vmModel.getOs() + "_v0");

        vmRepository.saveAndFlush(vm);
        return true;
    }

    @Override
    public void removeVm(Long vmId) {
        if(!vmRepository.existsById(vmId))
            throw new VmNotFoundException("The vm with id " + vmId + " does not exist");

        //remove vm
        vmRepository.deleteById(vmId);
        vmRepository.flush();
    }

    @Override
    public boolean editVmResources(Long vmId, int vCPU, int ram, int disk) {
        if(!vmRepository.existsById(vmId))
            throw new VmNotFoundException("The vm with id " + vmId + " does not exist");

        //check resources constraints
        Vm curVm = vmRepository.getOne(vmId);
        if(resourcesExceeded(curVm.getTeam().getVms(), curVm.getVmModel(), vCPU, ram, disk))
            return false;

        //edit vm resources
        curVm.setVCPU(vCPU);
        curVm.setRAM(ram);
        curVm.setDisk(disk);

        vmRepository.saveAndFlush(curVm);
        return true;
    }

    @Override
    public boolean editVmModelSettings(Long vmModelId, VmModelDTO vmModelDTO) {
        if(!vmModelRepository.existsById(vmModelId))
            throw new VmNotFoundException("The vm model with id " + vmModelId + " does not exist");

        VmModel curVmModel = vmModelRepository.getOne(vmModelId);

        List<VmDTO> vmList = getCourseVms(curVmModel.getCourse().getName());

        curVmModel.setName(vmModelDTO.getName());
        curVmModel.setOs(vmModelDTO.getOs());
        curVmModel.setMaxVCPU(vmModelDTO.getMaxVCPU());
        curVmModel.setMaxDisk(vmModelDTO.getMaxDisk());
        curVmModel.setMaxRAM(vmModelDTO.getMaxRAM());
        curVmModel.setMaxActiveVm(vmModelDTO.getMaxActiveVm());
        curVmModel.setMaxTotVm(vmModelDTO.getMaxTotVm());

        vmModelRepository.saveAndFlush(curVmModel);
        return true;
    }

    @Override
    public void removeVmModel(Long vmModelId) {
        if(!vmModelRepository.existsById(vmModelId))
            throw new VmModelNotFoundException("The vm model with id " + vmModelId + " does not exist");

        //remove vmModel
        VmModel vmModel = vmModelRepository.getOne(vmModelId);
        vmModel.setProfessor(null);
        vmModel.setCourse(null);

        vmModelRepository.delete(vmModel);
        vmModelRepository.flush();
    }

    @Override
    public void changeVmContentRandom(Long vmId) {
        if(!vmRepository.existsById(vmId))
            throw new VmNotFoundException("The vm with id " + vmId + " does not exist");

        Vm vm = vmRepository.getOne(vmId);
        Random random = new Random();
        vm.setContent(vm.getVmModel().getOs() + "_v" + (random.nextInt(6) + 1));

        vmRepository.saveAndFlush(vm);
    }

    private boolean resourcesExceeded(List<Vm> teamVms, VmModel vmModel, int vCPU, int ram, int disk) {
        int totRam = 0, totDisk = 0, totVCpu = 0;

        for(Vm v : teamVms) {
            totRam += v.getRAM();
            totDisk += v.getDisk();
            totVCpu += v.getVCPU();
        }

        return ram < 0 || disk < 0 || vCPU < 0 || totRam + ram > vmModel.getMaxRAM() ||
                totDisk + disk > vmModel.getMaxDisk() || totVCpu + vCPU > vmModel.getMaxVCPU();
    }

    @Override
    public boolean powerOnVm(Long vmId) {
        if(!vmRepository.existsById(vmId))
            throw new VmNotFoundException("The vm with id " + vmId + " does not exist");

        //check if vm is already active
        Vm vm = vmRepository.getOne(vmId);
        if(vm.isActive())
            return false;

        //get number of active vms for the group to which vm belongs
        int nActiveVMs = 0;
        for(Vm v : vm.getTeam().getVms()) {
            if(v.isActive())
                nActiveVMs++;
        }

        //check max number of active vms constraint
        if(nActiveVMs >= vm.getVmModel().getMaxActiveVm())
            return false;

        //set vm as active
        vm.setActive(true);

        vmRepository.saveAndFlush(vm);
        return true;
    }

    @Override
    public boolean powerOffVm(Long vmId) {
        if(!vmRepository.existsById(vmId))
            throw new VmNotFoundException("The vm with id " + vmId + " does not exist");

        //check if vm is already off
        Vm vm = vmRepository.getOne(vmId);
        if(!vm.isActive())
            return false;

        //set vm as active
        vm.setActive(false);

        vmRepository.saveAndFlush(vm);
        return true;
    }

    @Override
    public boolean setVmModelToCourse(VmModelDTO vmModelDTO, String courseName, String professorId) {
        if(!courseRepository.existsById(courseName))
            throw new CourseNotFoundException("The course named " + courseName + " does not exist");
        if(!userRepository.professorExistsById(professorId))
            throw new ProfessorNotFoundException("The professor with id " + professorId + " does not exist");

        //check if there is already a vmModel for that course
        if(vmModelRepository.existsByCourseName(courseName))
            return false;

        VmModel vmModel = modelMapper.map(vmModelDTO, VmModel.class);
        Professor professor = userRepository.getProfessorById(professorId);
        Course course = courseRepository.getOne(courseName);

        //set vmModel to course
        vmModel.setCourse(course);
        vmModel.setProfessor(professor);

        vmModelRepository.saveAndFlush(vmModel);
        return true;
    }
}
