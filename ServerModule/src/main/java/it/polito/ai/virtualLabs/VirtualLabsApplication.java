package it.polito.ai.virtualLabs;

import it.polito.ai.virtualLabs.services.TeamService;
import it.polito.ai.virtualLabs.services.exceptions.team.TeamServiceException;
import org.modelmapper.ModelMapper;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class VirtualLabsApplication {

    @Bean //la classe ModelMapper mi serve per fare le conversioni (es. utilizzare map() per trasformare un Entity in DTO)
    ModelMapper modelMapper() {
        return new ModelMapper();
    }

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
