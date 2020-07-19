package it.polito.ai.virtualLabs.dtos;

import lombok.Data;

import javax.persistence.Id;

@Data
public class TeamDTO {
    @Id
    Long id;
    String name;
}
