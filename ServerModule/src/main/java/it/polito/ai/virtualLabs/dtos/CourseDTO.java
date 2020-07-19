package it.polito.ai.virtualLabs.dtos;

import lombok.Data;
import org.springframework.hateoas.RepresentationModel;

import javax.persistence.Id;

@Data
public class CourseDTO extends RepresentationModel<CourseDTO> {
    @Id
    String name;
    String acronym;
    int minTeamSize;
    int maxTeamSize;
    boolean enabled;
}
