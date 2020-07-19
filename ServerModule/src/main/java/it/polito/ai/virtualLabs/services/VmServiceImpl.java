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
        return Optional.of(vmRepository.findById(vmId).get().getVmModel())
                .map(vmModel -> modelMapper.map(vmModel, VmModelDTO.class));
    }

    @Override
    public Optional<UserDTO> getOwner(Long vmId) {
        if (!vmRepository.existsById(vmId))
            return Optional.empty();
        return Optional.of(vmRepository.findById(vmId).get().getOwner())
                .map(owner -> modelMapper.map(owner, UserDTO.class));
    }

    @Override
    public Optional<TeamDTO> getTeam(Long vmId) {
        if (!vmRepository.existsById(vmId))
            return Optional.empty();
        return Optional.of(vmRepository.findById(vmId).get().getTeam())
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
        if(vmRepository.existsById(vmDTO.getId()) || !teamRepository.existsById(teamId) ||
            !userRepository.existsById(studentId) || !vmModelRepository.existsById(vmModelId))
            return false;

        //get current resources
        Team team = teamRepository.findById(teamId).get();
        List<Vm> teamVms = team.getVms();
        VmModel vmModel = vmModelRepository.findById(vmModelId).get();
        int totRam = 0, totDisk = 0, totVCpu = 0;

        for(Vm v : teamVms) {
            totRam += v.getRAM();
            totDisk += v.getDisk();
            totVCpu += v.getVCPU();
        }

        //check all resources (and number of vms) constraints
        if(teamVms.size() >= vmModel.getMaxTotVM() || totRam + vmDTO.getRAM() > vmModel.getMaxRAM() ||
            totDisk + vmDTO.getDisk() > vmModel.getMaxDisk() || totVCpu + vmDTO.getVCPU() > vmModel.getMaxVCPU())
            return false;

        //create VM
        Vm vm = modelMapper.map(vmDTO, Vm.class);
        vm.setOwner((Student)userRepository.findById(studentId).get());
        vm.setTeam(team);
        vm.setVmModel(vmModel);

        vmRepository.saveAndFlush(vm);
        return true;
    }

    @Override
    public boolean removeVm(Long vmId) {
        return false;
    }

    @Override
    public void editVmResources(int vCPU, int ram, int disk) {

    }

    @Override
    public void powerOnVm() {

    }

    @Override
    public void powerOffVm() {

    }
}
