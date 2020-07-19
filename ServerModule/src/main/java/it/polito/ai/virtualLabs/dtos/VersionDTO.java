package it.polito.ai.virtualLabs.dtos;

import lombok.Data;

import javax.persistence.*;
import java.util.Calendar;

@Data
public class VersionDTO {
    @Id
    Long id;
    String title;
    String content;
    Calendar submissionDate;
}
