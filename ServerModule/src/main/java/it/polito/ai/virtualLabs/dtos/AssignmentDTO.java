package it.polito.ai.virtualLabs.dtos;

import lombok.Data;
import javax.persistence.Id;
import java.time.LocalDateTime;

@Data
public class AssignmentDTO {

    @Id
    Long id;
    String name;
    LocalDateTime releaseDate;
    LocalDateTime expiryDate;
    String content;
}
