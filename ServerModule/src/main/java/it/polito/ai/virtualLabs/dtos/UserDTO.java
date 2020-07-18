package it.polito.ai.virtualLabs.dtos;

import lombok.Data;

import javax.persistence.Id;
import java.io.Serializable;

@Data
public class UserDTO implements Serializable {
    @Id
    Long id;
    String username;
    String password;
}
