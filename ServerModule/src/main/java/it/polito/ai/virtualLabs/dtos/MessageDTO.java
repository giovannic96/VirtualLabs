package it.polito.ai.virtualLabs.dtos;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class MessageDTO {

    List<String> to;
    String subject;
    String body;
}
