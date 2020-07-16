package it.polito.ai.esercitazione3.dtos;

import lombok.Data;

import javax.persistence.Id;

@Data
public class TeamDTO {
    @Id
    Long id;
    String name;
    int status;
}
