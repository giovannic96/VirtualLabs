package it.polito.ai.esercitazione3.dtos;

import lombok.Data;
import org.springframework.hateoas.RepresentationModel;

import javax.persistence.Id;

@Data
public class CourseDTO extends RepresentationModel<CourseDTO> {
    @Id
    String name;
    int min;
    int max;
    boolean enabled;
}
