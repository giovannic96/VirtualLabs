package it.polito.ai.virtualLabs.dtos;

import lombok.Data;
import org.springframework.hateoas.RepresentationModel;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
public class VersionDTO extends RepresentationModel<VersionDTO> {
    @Id
    Long id;
    String title;
    String content;
    boolean revised;
    String review; //On DTO only
    LocalDateTime submissionDate;
}
