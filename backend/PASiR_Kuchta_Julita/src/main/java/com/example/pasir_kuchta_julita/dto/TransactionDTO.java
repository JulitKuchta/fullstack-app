package com.example.pasir_kuchta_julita.dto;


import com.example.pasir_kuchta_julita.model.TransactionType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class TransactionDTO {

    @NotNull(message = "Kwota nie może być pusta")
    @Min(value = 1, message = "Kwota musi być większa niż 0")
    private Double amount;

    @NotNull(message = "Typ transakcji jest wymagany")
    private TransactionType type;

    @Size(max = 50, message = "Tagi nie mogą przekraczać 50 znaków")
    private String tags;

    @Size(max = 255, message = "Notatka może mieć maksymalnie 255 znaków")
    private String notes;

    private LocalDateTime timestamp;

    public TransactionDTO(Double amount, TransactionType type, String tags, String notes, LocalDateTime timestamp) {
        this.amount = amount;
        this.type = type;
        this.tags = tags;
        this.notes = notes;
        this.timestamp = timestamp;
    }
}