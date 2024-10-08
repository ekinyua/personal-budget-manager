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
  editBudget: (id: string, newBudget: Omit<Budget, "id">) => void
  editExpense: (id: string, newExpense: Omit<Expense, "id">) => void
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
  | { type: 'EDIT_BUDGET'; payload: { id: string; newBudget: Omit<Budget, "id"> } }
  | { type: 'EDIT_EXPENSE'; payload: { id: string; newExpense: Omit<Expense, "id"> } }
  | { type: 'SET_BUDGETS'; payload: Budget[] }
  | { type: 'SET_EXPENSES'; payload: Expense[] }

function budgetsReducer(state: BudgetsState, action: BudgetsAction): BudgetsState {
  let newState: BudgetsState;
  switch (action.type) {
    case 'ADD_BUDGET':
      newState = { 
        ...state, 
        budgets: [...state.budgets, { ...action.payload, id: uuidV4() }] 
      };
      break;
    case 'ADD_EXPENSE':
      newState = { 
        ...state, 
        expenses: [...state.expenses, { ...action.payload, id: uuidV4() }] 
      };
      break;
    case 'DELETE_BUDGET':
      newState = {
        ...state,
        expenses: state.expenses.map(expense =>
          expense.budgetId === action.payload ? { ...expense, budgetId: UNCATEGORIZED_BUDGET_ID } : expense
        ),
        budgets: state.budgets.filter(budget => budget.id !== action.payload)
      };
      break;
    case 'DELETE_EXPENSE':
      newState = { 
        ...state, 
        expenses: state.expenses.filter(expense => expense.id !== action.payload) 
      };
      break;
    case 'EDIT_BUDGET':
      newState = {
        ...state,
        budgets: state.budgets.map(budget =>
          budget.id === action.payload.id ? { ...budget, ...action.payload.newBudget } : budget
        )
      };
      break;
    case 'EDIT_EXPENSE':
      newState = {
        ...state,
        expenses: state.expenses.map(expense =>
          expense.id === action.payload.id ? { ...expense, ...action.payload.newExpense } : expense
        )
      };
      break;
    case 'SET_BUDGETS':
      newState = { ...state, budgets: action.payload };
      break;
    case 'SET_EXPENSES':
      newState = { ...state, expenses: action.payload };
      break;
    default:
      return state;
  }
  localStorage.setItem('budgets', JSON.stringify(newState.budgets));
  localStorage.setItem('expenses', JSON.stringify(newState.expenses));
  return newState;
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

  function editBudget(id: string, newBudget: Omit<Budget, "id">) {
    dispatch({ type: 'EDIT_BUDGET', payload: { id, newBudget } })
  }

  function editExpense(id: string, newExpense: Omit<Expense, "id">) {
    dispatch({ type: 'EDIT_EXPENSE', payload: { id, newExpense } })
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
        editBudget,
        editExpense,
      }}
    >
      {children}
    </BudgetsContext.Provider>
  )
}