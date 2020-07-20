package it.polito.ai.virtualLabs.services;

import it.polito.ai.virtualLabs.dtos.TeamDTO;
import it.polito.ai.virtualLabs.dtos.UserDTO;
import it.polito.ai.virtualLabs.dtos.VmDTO;
import it.polito.ai.virtualLabs.dtos.VmModelDTO;
import it.polito.ai.virtualLabs.entities.*;
import it.polito.ai.virtualLabs.repositories.TeamRepository;
import it.polito.ai.virtualLabs.repositories.UserRepository;
import it.polito.ai.virtualLabs.repositories.VmModelRepository;
import it.polito.ai.virtualLabs.repositories.VmRepository;
import it.polito.ai.virtualLabs.services.exceptions.student.StudentNotFoundException;
import it.polito.ai.virtualLabs.services.exceptions.team.TeamNotFoundException;
import it.polito.ai.virtualLabs.services.exceptions.vm.VmNotFoundException;
import it.polito.ai.virtualLabs.services.exceptions.vmmodel.VmModelNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;
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
    ModelMapper modelMapper;

    @Override
    public Optional<VmModelDTO> getVmModel(Long vmId) {
        if (!vmRepository.existsById(vmId))
            return Optional.empty();
        return Optional.of(vmRepository.getOne(vmId).getVmModel())
                .map(vmModel -> modelMapper.map(vmModel, VmModelDTO.class));
    }

    @Override
    public Optional<UserDTO> getOwner(Long vmId) {
        if (!vmRepository.existsById(vmId))
            return Optional.empty();
        return Optional.of(vmRepository.getOne(vmId).getOwner())
                .map(owner -> modelMapper.map(owner, UserDTO.class));
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
    public boolean createVm(VmDTO vmDTO, String studentId, Long teamId, Long vmModelId) {
        if(!teamRepository.existsById(teamId))
            throw new TeamNotFoundException("The team with id " + teamId + " does not exist");
        if(!userRepository.existsById(studentId))
            throw new StudentNotFoundException("The student with id " + studentId + " does not exist");
        if(!vmModelRepository.existsById(vmModelId))
            throw new VmModelNotFoundException("The VmModel with id " + vmModelId + " does not exist");

        Team team = teamRepository.getOne(teamId);
        List<Vm> teamVms = team.getVms();
        VmModel vmModel = vmModelRepository.getOne(vmModelId);

        //check resources and number of vms constraints
        if(teamVms.size() >= vmModel.getMaxTotVM() ||
            resourcesExceeded(teamVms, vmModel, vmDTO.getVCPU(), vmDTO.getRAM(), vmDTO.getDisk()))
            return false;

        //create VM
        Vm vm = modelMapper.map(vmDTO, Vm.class);
        vm.setOwner(userRepository.getStudentById(studentId));
        vm.setTeam(team);
        vm.setVmModel(vmModel);

        vmRepository.saveAndFlush(vm);
        return true;
    }

    @Override
    public boolean removeVm(Long vmId) {
        if(!vmRepository.existsById(vmId))
            throw new VmNotFoundException("The vm with id " + vmId + " does not exist");

        //remove vm in relationships
        Vm vm = vmRepository.getOne(vmId);
        vm.setTeam(null);
        vm.setOwner(null);
        vm.setVmModel(null);

        vmRepository.deleteById(vmId);
        vmRepository.flush();
        return true;
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

        //get number of active vms for the group to which vm belongs
        Vm vm = vmRepository.getOne(vmId);
        int nActiveVMs = 0;

        for(Vm v : vm.getTeam().getVms()) {
            if(v.isActive())
                nActiveVMs++;
        }

        //check max number of active vms constraint
        if(nActiveVMs >= vm.getVmModel().getMaxActiveVM())
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
}
