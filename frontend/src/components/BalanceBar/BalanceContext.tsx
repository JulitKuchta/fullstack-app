// src/context/BalanceContext.ts
import { createContext } from "react";

interface Balance {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

interface BalanceContextType {
  balance: Balance | null;
  refreshBalance: (days: number | null) => void;
}

export const BalanceContext = createContext<BalanceContextType | undefined>(
  undefined
);
