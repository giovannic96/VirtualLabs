package it.polito.ai.virtualLabs.entities;

import lombok.Data;

import javax.persistence.Entity;
import java.time.LocalDateTime;

@Data
@Entity
public class RefreshToken extends Token {

    public RefreshToken() {
        super();
    }

    public RefreshToken(String token, User user, LocalDateTime expiration) {
        super(token, user, expiration);
    }
}
