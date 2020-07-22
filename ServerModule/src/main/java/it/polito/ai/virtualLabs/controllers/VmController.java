package it.polito.ai.virtualLabs.controllers;

import it.polito.ai.virtualLabs.dtos.ReportDTO;
import it.polito.ai.virtualLabs.dtos.VmDTO;
import it.polito.ai.virtualLabs.services.VmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

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

    //@PutMapping("/{vmId}/edit")
    //@PutMapping("/{vmId}/powerOn")
    //@PutMapping("/{vmId}/powerOff")

    //@DeleteMapping("/{vmsId}")


}
