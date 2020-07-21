package it.polito.ai.virtualLabs.dtos;

import lombok.Data;
import org.springframework.hateoas.RepresentationModel;

import javax.persistence.Id;
import java.time.LocalDateTime;

@Data
public class AssignmentDTO extends RepresentationModel<AssignmentDTO> {

    @Id
    Long id;
    String name;
    LocalDateTime releaseDate;
    LocalDateTime expiryDate;
    String content;
}
