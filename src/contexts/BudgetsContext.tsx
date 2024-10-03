import React, { useContext, useReducer, ReactNode, useEffect } from "react"
import { v4 as uuidV4 } from "uuid"

export const UNCATEGORIZED_BUDGET_ID = "Uncategorized"

export interface Budget {
  id: string
  name: string
  max: number
}

export interface Expense {
  id: string
  budgetId: string
  amount: number
  description: string
}

interface BudgetsContextType {
  budgets: Budget[]
  expenses: Expense[]
  getBudgetExpenses: (budgetId: string) => Expense[]
  addExpense: ({ description, amount, budgetId }: Omit<Expense, "id">) => void
  addBudget: ({ name, max }: Omit<Budget, "id">) => void
  deleteBudget: (id: string) => void
  deleteExpense: (id: string) => void
}

const BudgetsContext = React.createContext<BudgetsContextType | undefined>(undefined)

export function useBudgets() {
  return useContext(BudgetsContext) as BudgetsContextType
}

interface BudgetsState {
  budgets: Budget[]
  expenses: Expense[]
}

type BudgetsAction =
  | { type: 'ADD_BUDGET'; payload: Omit<Budget, "id"> }
  | { type: 'ADD_EXPENSE'; payload: Omit<Expense, "id"> }
  | { type: 'DELETE_BUDGET'; payload: string }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'SET_BUDGETS'; payload: Budget[] }
  | { type: 'SET_EXPENSES'; payload: Expense[] }

function budgetsReducer(state: BudgetsState, action: BudgetsAction): BudgetsState {
  switch (action.type) {
    case 'ADD_BUDGET':
      if (state.budgets.find(budget => budget.name === action.payload.name)) {
        return state
      }
      return { ...state, budgets: [...state.budgets, { ...action.payload, id: uuidV4() }] }
    case 'ADD_EXPENSE':
      return { ...state, expenses: [...state.expenses, { ...action.payload, id: uuidV4() }] }
    case 'DELETE_BUDGET':
      return {
        ...state,
        expenses: state.expenses.map(expense =>
          expense.budgetId === action.payload ? { ...expense, budgetId: UNCATEGORIZED_BUDGET_ID } : expense
        ),
        budgets: state.budgets.filter(budget => budget.id !== action.payload)
      }
    case 'DELETE_EXPENSE':
      return { ...state, expenses: state.expenses.filter(expense => expense.id !== action.payload) }
    case 'SET_BUDGETS':
      return { ...state, budgets: action.payload }
    case 'SET_EXPENSES':
      return { ...state, expenses: action.payload }
    default:
      return state
  }
}

export const BudgetsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(budgetsReducer, {
    budgets: [],
    expenses: []
  })

  useEffect(() => {
    const storedBudgets = localStorage.getItem('budgets')
    const storedExpenses = localStorage.getItem('expenses')
    if (storedBudgets) dispatch({ type: 'SET_BUDGETS', payload: JSON.parse(storedBudgets) })
    if (storedExpenses) dispatch({ type: 'SET_EXPENSES', payload: JSON.parse(storedExpenses) })
  }, [])

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(state.budgets))
    localStorage.setItem('expenses', JSON.stringify(state.expenses))
  }, [state.budgets, state.expenses])

  function getBudgetExpenses(budgetId: string) {
    return state.expenses.filter(expense => expense.budgetId === budgetId)
  }

  function addExpense({ description, amount, budgetId }: Omit<Expense, "id">) {
    dispatch({ type: 'ADD_EXPENSE', payload: { description, amount, budgetId } })
  }

  function addBudget({ name, max }: Omit<Budget, "id">) {
    dispatch({ type: 'ADD_BUDGET', payload: { name, max } })
  }

  function deleteBudget(id: string) {
    dispatch({ type: 'DELETE_BUDGET', payload: id })
  }

  function deleteExpense(id: string) {
    dispatch({ type: 'DELETE_EXPENSE', payload: id })
  }

  return (
    <BudgetsContext.Provider
      value={{
        budgets: state.budgets,
        expenses: state.expenses,
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