package it.polito.ai.virtualLabs.dtos;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
public class VersionDTO {
    @Id
    Long id;
    String title;
    String content;
    LocalDateTime submissionDate;
}
