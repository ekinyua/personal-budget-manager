import React, { useContext, ReactNode } from "react"
import { v4 as uuidV4 } from "uuid"
import useLocalStorage from "../hooks/useLocalStorage"

export const UNCATEGORIZED_BUDGET_ID = "Uncategorized"

interface Budget {
  id: string;
  name: string;
  max: number;
}

interface Expense {
  id: string;
  budgetId: string;
  amount: number;
  description: string;
}

interface BudgetsContextType {
  budgets: Budget[];
  expenses: Expense[];
  getBudgetExpenses: (budgetId: string) => Expense[];
  addExpense: (expense: { description: string; amount: number; budgetId: string }) => void;
  addBudget: (budget: { name: string; max: number }) => void;
  deleteBudget: (budget: { id: string }) => void;
  deleteExpense: (expense: { id: string }) => void;
}

const BudgetsContext = React.createContext<BudgetsContextType | undefined>(undefined)

export function useBudgets() {
  const context = useContext(BudgetsContext)
  if (context === undefined) {
    throw new Error("useBudgets must be used within a BudgetsProvider")
  }
  return context
}

interface BudgetsProviderProps {
  children: ReactNode;
}

export const BudgetsProvider: React.FC<BudgetsProviderProps> = ({ children }) => {
  const [budgets, setBudgets] = useLocalStorage<Budget[]>("budgets", [])
  const [expenses, setExpenses] = useLocalStorage<Expense[]>("expenses", [])

  function getBudgetExpenses(budgetId: string) {
    return expenses.filter(expense => expense.budgetId === budgetId)
  }

  function addExpense({ description, amount, budgetId }: { description: string; amount: number; budgetId: string }) {
    setExpenses(prevExpenses => {
      return [...prevExpenses, { id: uuidV4(), description, amount, budgetId }]
    })
  }

  function addBudget({ name, max }: { name: string; max: number }) {
    setBudgets(prevBudgets => {
      if (prevBudgets.find(budget => budget.name === name)) {
        return prevBudgets
      }
      return [...prevBudgets, { id: uuidV4(), name, max }]
    })
  }

  function deleteBudget({ id }: { id: string }) {
    setExpenses(prevExpenses => {
      return prevExpenses.map(expense => {
        if (expense.budgetId !== id) return expense
        return { ...expense, budgetId: UNCATEGORIZED_BUDGET_ID }
      })
    })
    setBudgets(prevBudgets => {
      return prevBudgets.filter(budget => budget.id !== id)
    })
  }

  function deleteExpense({ id }: { id: string }) {
    setExpenses(prevExpenses => {
      return prevExpenses.filter(expense => expense.id !== id)
    })
  }

  return (
    <BudgetsContext.Provider
      value={{
        budgets,
        expenses,
        getBudgetExpenses,
        addExpense,
        addBudget,
        deleteBudget,
        deleteExpense,
      }}
    >
      {children}
    </BudgetsContext.Provider>
  )
}