package com.example.pasir_kuchta_julita.encje;


import com.example.pasir_kuchta_julita.model.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "debts")
public class Debt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double amount;

    private String title;

    @ManyToOne
    @JoinColumn(name = "debtor_id")
    private User debtor;

    @ManyToOne
    @JoinColumn(name = "creditor_id")
    private User creditor;

    @ManyToOne
    @JoinColumn(name = "group_id")
    private Group group;

    private boolean markedAsPaid = false;

    private boolean confirmedByCreditor = false;
}
