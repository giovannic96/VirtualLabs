package it.polito.ai.virtualLabs.dtos;

import lombok.Data;
import org.springframework.hateoas.RepresentationModel;

import javax.persistence.Id;

@Data
public class TeamDTO extends RepresentationModel<TeamDTO> {
    @Id
    Long id;
    String name;
}
