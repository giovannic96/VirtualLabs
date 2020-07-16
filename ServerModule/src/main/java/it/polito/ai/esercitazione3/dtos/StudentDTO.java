package it.polito.ai.esercitazione3.dtos;

import lombok.Data;
import org.springframework.hateoas.RepresentationModel;

import javax.persistence.Id;

@Data
public class StudentDTO extends RepresentationModel<StudentDTO> {
    @Id
    String id;
    String name;
    String firstName;
}
