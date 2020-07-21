package it.polito.ai.virtualLabs;

import it.polito.ai.virtualLabs.dtos.*;
import it.polito.ai.virtualLabs.entities.Report;
import it.polito.ai.virtualLabs.entities.VmModel;
import it.polito.ai.virtualLabs.services.LabService;
import it.polito.ai.virtualLabs.services.TeamService;
import it.polito.ai.virtualLabs.services.VmService;
import it.polito.ai.virtualLabs.services.exceptions.team.TeamServiceException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.expression.spel.ast.Assign;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@SpringBootApplication
public class VirtualLabsApplication {

    @Bean
    ModelMapper modelMapper() {
        return new ModelMapper();
    }

    @Autowired
    TeamService teamService;
    @Autowired
    VmService vmService;
    @Autowired
    LabService labService;

    @Bean
    public CommandLineRunner commander(TeamService teamService) {
        return new CommandLineRunner() {
            @Override
            public void run(String... args) {
                try {
                    //here goes the code...
                } catch (TeamServiceException e) {
                    System.out.println(e.getMessage());
                }

            }
        };
    }

    public static void main(String[] args) {
        SpringApplication.run(VirtualLabsApplication.class, args);
    }

}
