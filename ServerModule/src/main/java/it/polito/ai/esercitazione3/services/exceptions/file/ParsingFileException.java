package it.polito.ai.esercitazione3.services.exceptions.file;

public class ParsingFileException extends RuntimeException {
    public ParsingFileException(String message) {
        super(message);
    }
}