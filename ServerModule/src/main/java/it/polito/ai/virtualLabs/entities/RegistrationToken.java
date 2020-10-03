package it.polito.ai.virtualLabs.entities;

import lombok.Data;
import javax.persistence.Entity;
import java.time.LocalDateTime;

@Data
@Entity
public class RegistrationToken extends Token {

    public RegistrationToken() {
        super();
    }

    public RegistrationToken(String token, User user, LocalDateTime expiration) {
        super(token, user, expiration);
    }
}
