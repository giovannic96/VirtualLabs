package it.polito.ai.virtualLabs.controllers;

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
    public VmModelDTO vmModel(Long vmModelId) {
        Optional<VmModelDTO> vmModel = vmService.getVmModel(vmModelId);

        if(!vmModel.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, vmModelId.toString());

        return ModelHelper.enrich(vmModel.get());
    }

    @PutMapping("/{vmId}")
    @ResponseStatus(HttpStatus.OK)
    public void edit(@PathVariable Long vmId, @RequestBody VmDTO vmDTO) {
        if(!vmService.editVmResources(vmId, vmDTO.getVCPU(), vmDTO.getRAM(), vmDTO.getDisk()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "The vm with id '" + vmId + "' cannot be modified: resources exceeded");
    }

    //@PutMapping("/{vmId}/powerOn")
    //@PutMapping("/{vmId}/powerOff")

    //@DeleteMapping("/{vmsId}")


}
