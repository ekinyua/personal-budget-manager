import { useState, useReducer } from "react"
import { Button, Stack } from "react-bootstrap"
import Container from "react-bootstrap/Container"
import AddBudgetModal from "./components/AddBudgetModal"
import AddExpenseModal from "./components/AddExpenseModal"
import ViewExpensesModal from "./components/ViewExpensesModal"
import BudgetCard from "./components/BudgetCard"
import UncategorizedBudgetCard from "./components/UncategorizedBudgetCard"
import TotalBudgetCard from "./components/TotalBudgetCard"
import ExpenseSummary from "./components/ExpenseSummary"
import { UNCATEGORIZED_BUDGET_ID, useBudgets } from "./contexts/BudgetsContext"
import './styles.css'

// Define action types
type Action =
  | { type: 'ADD_EXPENSE'; payload: { description: string; amount: number; budgetId: string } }
  | { type: 'DELETE_EXPENSE'; payload: { id: string } }

// Define initial state
const initialState = {
  expenses: []
}

// Reducer function
function expenseReducer(state: { expenses: any[] }, action: Action) {
  switch (action.type) {
    case 'ADD_EXPENSE':
      return {
        ...state,
        expenses: [...state.expenses, { ...action.payload, id: Date.now().toString() }]
      }
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense.id !== action.payload.id)
      }
    default:
      return state
  }
}

function App() {
  const [showAddBudgetModal, setShowAddBudgetModal] = useState<boolean>(false)
  const [showAddExpenseModal, setShowAddExpenseModal] = useState<boolean>(false)
  const [viewExpensesModalBudgetId, setViewExpensesModalBudgetId] = useState<string | undefined>()
  const [addExpenseModalBudgetId, setAddExpenseModalBudgetId] = useState<string | undefined>()
  const { budgets, getBudgetExpenses } = useBudgets()
  const [state, dispatch] = useReducer(expenseReducer, initialState)

  function openAddExpenseModal(budgetId?: string) {
    setShowAddExpenseModal(true)
    setAddExpenseModalBudgetId(budgetId)
  }

  return (
    <>
      <div className="header">
        <Container>
          <h1>Personal Budget Manager</h1>
        </Container>
      </div>
      <Container className="my-4">
        <Stack direction="horizontal" gap={2} className="mb-4">
          <Button variant="primary" onClick={() => setShowAddBudgetModal(true)}>
            Add Budget
          </Button>
          <Button variant="outline-primary" onClick={() => openAddExpenseModal()}>
            Add Expense
          </Button>
        </Stack>
        <div className="budget-cards">
          {budgets.map(budget => {
            const amount = getBudgetExpenses(budget.id).reduce(
              (total, expense) => total + expense.amount,
              0
            )
            return (
              <BudgetCard
                key={budget.id}
                name={budget.name}
                amount={amount}
                max={budget.max}
                onAddExpenseClick={() => openAddExpenseModal(budget.id)}
                onViewExpensesClick={() =>
                  setViewExpensesModalBudgetId(budget.id)
                }
              />
            )
          })}
          <UncategorizedBudgetCard
            onAddExpenseClick={() => openAddExpenseModal(UNCATEGORIZED_BUDGET_ID)}
            onViewExpensesClick={() =>
              setViewExpensesModalBudgetId(UNCATEGORIZED_BUDGET_ID)
            }
          />
          <TotalBudgetCard />
        </div>
        <ExpenseSummary expenses={state.expenses} />
      </Container>
      <AddBudgetModal
        show={showAddBudgetModal}
        handleClose={() => setShowAddBudgetModal(false)}
      />
      <AddExpenseModal
        show={showAddExpenseModal}
        defaultBudgetId={addExpenseModalBudgetId}
        handleClose={() => setShowAddExpenseModal(false)}
        // onAddExpense={(expense) => dispatch({ type: 'ADD_EXPENSE', payload: expense })}
      />
      <ViewExpensesModal
        budgetId={viewExpensesModalBudgetId}
        handleClose={() => setViewExpensesModalBudgetId(undefined)}
        // onDeleteExpense={(id: string) => dispatch({ type: 'DELETE_EXPENSE', payload: { id } })}
      />
    </>
  )
}

export default App