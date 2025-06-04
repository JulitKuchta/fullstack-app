package com.example.pasir_kuchta_julita.controller;

import com.example.pasir_kuchta_julita.dto.BalanceDTO;
import com.example.pasir_kuchta_julita.dto.TransactionDTO;
import com.example.pasir_kuchta_julita.model.Transaction;
import com.example.pasir_kuchta_julita.model.User;
import com.example.pasir_kuchta_julita.service.TransactionService;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import jakarta.validation.Valid;
import org.springframework.validation.annotation.Validated;

import java.time.LocalDateTime;
import java.util.List;

@Controller
public class TransactionGraphQLController {

    private final TransactionService transactionService;

    public TransactionGraphQLController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @QueryMapping
    public List<Transaction> transactions(){
        return transactionService.getAllTransactions();
    }

    @QueryMapping
    public BalanceDTO userBalance(@Argument Float days){
        User user = transactionService.getCurrentUser();
        return transactionService.getUserBalance(user,days);
    }

    @MutationMapping
    public Transaction addTransaction(@Valid @Argument TransactionDTO transactionDTO) {
        return transactionService.saveTransactions(transactionDTO);
    }

    @MutationMapping
    public Transaction updateTransaction(@Argument Long id, @Valid @Argument TransactionDTO transactionDTO) {
        return transactionService.updateTransaction(id,transactionDTO);
    }

    @MutationMapping
    public Boolean deleteTransaction(@Argument Long id) {
        transactionService.removeTransaction(id);
        return true;
    }
}

