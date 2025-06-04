// src/context/BalanceProvider.tsx
import React, { useState, useCallback } from "react";
import graphqlClient from "../../api/graphClient";
import { BalanceContext } from "./BalanceContext";

interface Balance {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export const BalanceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [balance, setBalance] = useState<Balance | null>(null);

  const refreshBalance = useCallback(async (days: number | null) => {
    const query = `
      query($days: Float) {
        userBalance(days: $days) {
          totalIncome
          totalExpense
          balance
        }
      }
    `;
    try {
      const response = await graphqlClient(query, { days });
      setBalance(response.data.userBalance);
    } catch (error) {
      console.error("Błąd pobierania bilansu:", error);
    }
  }, []);

  return (
    <BalanceContext.Provider value={{ balance, refreshBalance }}>
      {children}
    </BalanceContext.Provider>
  );
};
