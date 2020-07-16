package it.polito.ai.esercitazione3;

import it.polito.ai.esercitazione3.dtos.CourseDTO;
import it.polito.ai.esercitazione3.dtos.TeamDTO;
import it.polito.ai.esercitazione3.entities.Course;
import it.polito.ai.esercitazione3.entities.Student;
import it.polito.ai.esercitazione3.services.NotificationService;
import it.polito.ai.esercitazione3.services.TeamService;
import it.polito.ai.esercitazione3.services.exceptions.team.TeamServiceException;
import org.apache.commons.collections.ArrayStack;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.userdetails.User;

import java.sql.SQLOutput;
import java.util.ArrayList;
import java.util.List;

@SpringBootApplication
public class Esercitazione3Application {

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
        SpringApplication.run(Esercitazione3Application.class, args);
    }

}
