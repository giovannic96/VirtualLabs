package it.polito.ai.virtualLabs.dtos;

import lombok.Data;
import org.springframework.hateoas.RepresentationModel;

import javax.persistence.Id;
import java.io.Serializable;

@Data
public class UserDTO extends RepresentationModel<UserDTO> implements Serializable {
    @Id
    String id; //matricola
    String username;
    String password;   //TODO: think if it's smart to send the password (check the modelHelper)
    String name;
    String surname;
    String photo;
}
