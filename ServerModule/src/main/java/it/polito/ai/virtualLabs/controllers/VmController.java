package it.polito.ai.virtualLabs.controllers;

import it.polito.ai.virtualLabs.dtos.CourseDTO;
import it.polito.ai.virtualLabs.dtos.VmDTO;
import it.polito.ai.virtualLabs.dtos.VmModelDTO;
import it.polito.ai.virtualLabs.services.VmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("API/vms")
public class VmController {

    @Autowired
    VmService vmService;

    @GetMapping("/{vmId}")
    public VmDTO report(@PathVariable Long vmId) {
        Optional<VmDTO> vm = vmService.getVm(vmId);

        if(!vm.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, vmId.toString());

        //TODO: da enrichare
        return vm.get();
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

    //@PutMapping("/{vmId}/edit")

    @PutMapping("/{vmId}/powerOn")
    @ResponseStatus(HttpStatus.OK)
    public void powerOn(@PathVariable Long vmId) {
        if(!vmService.powerOnVm(vmId))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Error in powering on the vm with id: " + vmId);
    }

    @PutMapping("/{vmId}/powerOff")
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

        if(!vmService.removeVm(vmId))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Error in removing the vm with id: " + vmId);
    }
}
