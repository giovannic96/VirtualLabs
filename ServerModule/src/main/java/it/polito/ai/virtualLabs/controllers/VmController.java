package it.polito.ai.virtualLabs.controllers;

import it.polito.ai.virtualLabs.dtos.*;
import it.polito.ai.virtualLabs.entities.VmModel;
import it.polito.ai.virtualLabs.services.VmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("API/vms")
public class VmController {

    @Autowired
    VmService vmService;

    @GetMapping("/{vmId}")
    public VmDTO getOne(@PathVariable Long vmId) {
        Optional<VmDTO> vm = vmService.getVm(vmId);
        if(!vm.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, vmId.toString());
        return ModelHelper.enrich(vm.get());
    }

    @GetMapping("/{vmId}/team")
    public TeamDTO team(@PathVariable Long vmId) {
        Optional<VmDTO> vm = vmService.getVm(vmId);
        Optional<TeamDTO> team = vmService.getTeam(vmId);
        if(!vm.isPresent() || !team.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, vmId.toString());
        return ModelHelper.enrich(team.get());
    }

    @GetMapping("/{vmId}/owner")
    public StudentDTO owner(@PathVariable Long vmId) {
        Optional<VmDTO> vm = vmService.getVm(vmId);
        Optional<StudentDTO> owner = vmService.getOwner(vmId);
        if(!vm.isPresent() || !owner.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, vmId.toString());
        return ModelHelper.enrich(owner.get());
    }

    @GetMapping("/{vmId}/vmModel")
    public VmModelDTO vmModelByVmId(@PathVariable Long vmId) {
        Optional<VmDTO> vm = vmService.getVm(vmId);
        Optional<VmModelDTO> vmModel = vmService.getVmModelForVm(vmId);
        if(!vm.isPresent() || !vmModel.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, vmId.toString());

        return ModelHelper.enrich(vmModel.get());
    }

    @GetMapping("/vmModels")
    public List<VmModelDTO> allVmModels() {
        return vmService.getAllVmModels()
                .stream()
                .map(ModelHelper::enrich)
                .collect(Collectors.toList());
    }

    @GetMapping("/vmModels/{vmModelId}")
    public VmModelDTO vmModel(@PathVariable Long vmModelId) {
        Optional<VmModelDTO> vmModel = vmService.getVmModel(vmModelId);
        if(!vmModel.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, vmModelId.toString());
        return ModelHelper.enrich(vmModel.get());
    }

    @GetMapping("/vmModels/{vmModelId}/course")
    public CourseDTO course(@PathVariable Long vmModelId) {
        Optional<CourseDTO> course = vmService.getVmModelCourse(vmModelId);
        if(!course.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, course.toString());
        return ModelHelper.enrich(course.get());
    }

    @GetMapping("/vmModels/{vmModelId}/professor")
    public ProfessorDTO professor(@PathVariable Long vmModelId) {
        Optional<ProfessorDTO> professor = vmService.getVmModelProfessor(vmModelId);
        if(!professor.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, professor.toString());
        return ModelHelper.enrich(professor.get());
    }

    @GetMapping("/vmModels/{vmModelId}/vms")
    public List<VmDTO> vms(@PathVariable Long vmModelId) {
        List<VmDTO> vms = vmService.getVmModelVms(vmModelId);
        for(VmDTO vm : vms)
            ModelHelper.enrich(vm);
        return vms;
    }

    @GetMapping("/vmModels/osMap")
    public Map<String, String> osMap() {
        return VmModel.getOsMap();
    }

    @PutMapping("/{vmId}")
    @ResponseStatus(HttpStatus.OK)
    public void edit(@PathVariable Long vmId, @RequestBody VmDTO vmDTO) {
        if(!vmService.editVmResources(vmId, vmDTO.getVCPU(), vmDTO.getRAM(), vmDTO.getDisk()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "The vm with id '" + vmId + "' cannot be modified: resources exceeded");
    }

    @PutMapping("/{vmId}/powerOn")
    @CrossOrigin // TODO: just for test in localhost, remove when finished
    @ResponseStatus(HttpStatus.OK)
    public void powerOn(@PathVariable Long vmId) {
        if(!vmService.powerOnVm(vmId))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Error in powering on the vm with id: " + vmId);
    }

    @PutMapping("/{vmId}/powerOff")
    @CrossOrigin // TODO: just for test in localhost, remove when finished
    @ResponseStatus(HttpStatus.OK)
    public void powerOff(@PathVariable Long vmId) {
        if(!vmService.powerOffVm(vmId))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Error in powering off the vm with id: " + vmId);
    }

    @DeleteMapping("/{vmId}")
    @ResponseStatus(HttpStatus.OK)
    public void remove(@PathVariable Long vmId) {
        Optional<VmDTO> vm = vmService.getVm(vmId);
        if (!vm.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "The vm with id '" + vmId + "' was not found");
        vmService.removeVm(vmId);
    }

    @DeleteMapping("/vmModels/{vmModelId}")
    @CrossOrigin // TODO: just for test in localhost, remove when finished
    @ResponseStatus(HttpStatus.OK)
    public void removeVmModel(@PathVariable Long vmModelId) {
        Optional<VmModelDTO> vmModel = vmService.getVmModel(vmModelId);
        if (!vmModel.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "The vm model with id '" + vmModelId + "' was not found");
        vmService.removeVmModel(vmModelId);
    }
}
