package it.polito.ai.virtualLabs.entities;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Calendar;

@Data
@Entity
public class Assignment {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull
    private String name;

    @Temporal(TemporalType.TIMESTAMP)
    private Calendar releaseDate;

    @Temporal(TemporalType.TIMESTAMP)
    private Calendar expiryDate;

    private String content;
}
