package com.example.pasir_kuchta_julita.controller;


import com.example.pasir_kuchta_julita.dto.TransactionDTO;
import com.example.pasir_kuchta_julita.model.Transaction;
import com.example.pasir_kuchta_julita.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions(){
        return ResponseEntity.ok(transactionService.getAllTransactions());
    }

    @PostMapping
    public ResponseEntity<Transaction> saveTransactions(@Valid @RequestBody TransactionDTO transactionDetails){
        Transaction transaction = transactionService.saveTransactions(transactionDetails);
        return ResponseEntity.ok(transaction);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Transaction> updateTransaction(@PathVariable Long id, @Valid @RequestBody TransactionDTO transactionDetails){
        Transaction transaction = transactionService.updateTransaction(id, transactionDetails);
        return ResponseEntity.ok(transaction);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Transaction> removeTransaction(@PathVariable Long id){
        Transaction transaction = transactionService.removeTransaction(id);
        return ResponseEntity.ok(transaction);
    }

}
