package it.polito.ai.virtualLabs.dtos;

import lombok.Data;
import javax.persistence.Id;
import java.util.Calendar;

@Data
public class AssignmentDTO {

    @Id
    Long id;
    String name;
    Calendar releaseDate;
    Calendar expiryDate;
    String content;
}
