import { useState } from "react"
import { Container, Stack, Button } from "react-bootstrap"
import AddBudgetModal from "./components/AddBudgetModal"
import AddExpenseModal from "./components/AddExpenseModal"
import ViewExpensesModal from "./components/ViewExpensesModal"
import EditBudgetModal from "./components/EditBudgetModal"
import EditExpenseModal from "./components/EditExpenseModal"
import BudgetCard from "./components/BudgetCard"
import UncategorizedBudgetCard from "./components/UncategorizedBudgetCard"
import TotalBudgetCard from "./components/TotalBudgetCard"
import ExpenseSummary from "./components/ExpenseSummary"
import { UNCATEGORIZED_BUDGET_ID, useBudgets, Budget, Expense } from "./contexts/BudgetsContext"
import './styles.css'

function App() {
  const [showAddBudgetModal, setShowAddBudgetModal] = useState<boolean>(false)
  const [showAddExpenseModal, setShowAddExpenseModal] = useState<boolean>(false)
  const [showEditBudgetModal, setShowEditBudgetModal] = useState<boolean>(false)
  const [showEditExpenseModal, setShowEditExpenseModal] = useState<boolean>(false)
  const [viewExpensesModalBudgetId, setViewExpensesModalBudgetId] = useState<string | undefined>()
  const [addExpenseModalBudgetId, setAddExpenseModalBudgetId] = useState<string | undefined>()
  const [budgetToEdit, setBudgetToEdit] = useState<Budget | null>(null)
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null)
  const { budgets, getBudgetExpenses, expenses } = useBudgets()

  function openAddExpenseModal(budgetId?: string) {
    setShowAddExpenseModal(true)
    setAddExpenseModalBudgetId(budgetId)
  }

  function openEditBudgetModal(budget: Budget) {
    setBudgetToEdit(budget)
    setShowEditBudgetModal(true)
  }

  function openEditExpenseModal(expense: Expense) {
    setExpenseToEdit(expense)
    setShowEditExpenseModal(true)
  }

  return (
    <>
      <nav className="nav-bar">
        <h1 className="nav-h1">Personal Budget Manager</h1>
        <ul className="nav-ul">
          <li className="nav-li">
            <Button variant="primary" onClick={() => setShowAddBudgetModal(true)}>
              Add Budget
            </Button>
          </li>
          <li className="nav-li">
            <Button variant="secondary" onClick={() => openAddExpenseModal()}>
              Add Expense
            </Button>
          </li>
        </ul>
      </nav>
      
      <Container className="content">  
        <Stack direction="horizontal" gap={2} className="mb-4">
          <h1 className="me-auto">Budgets</h1>
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
                onViewExpensesClick={() => setViewExpensesModalBudgetId(budget.id)}
                onEditClick={() => openEditBudgetModal(budget)}
              />
            )
          })}
          <UncategorizedBudgetCard
            onAddExpenseClick={() => openAddExpenseModal(UNCATEGORIZED_BUDGET_ID)}
            onViewExpensesClick={() => setViewExpensesModalBudgetId(UNCATEGORIZED_BUDGET_ID)}
          />
          <TotalBudgetCard />
        </div>
        <ExpenseSummary expenses={expenses} onEditExpense={openEditExpenseModal} />
      </Container>
      
      <AddBudgetModal
        show={showAddBudgetModal}
        handleClose={() => setShowAddBudgetModal(false)}
      />
      <AddExpenseModal
        show={showAddExpenseModal}
        defaultBudgetId={addExpenseModalBudgetId}
        handleClose={() => setShowAddExpenseModal(false)}
      />
      <ViewExpensesModal
        budgetId={viewExpensesModalBudgetId}
        handleClose={() => setViewExpensesModalBudgetId(undefined)}
        onEditExpense={openEditExpenseModal}
      />
      <EditBudgetModal
        show={showEditBudgetModal}
        handleClose={() => setShowEditBudgetModal(false)}
        budgetToEdit={budgetToEdit}
      />
      <EditExpenseModal
        show={showEditExpenseModal}
        handleClose={() => setShowEditExpenseModal(false)}
        expenseToEdit={expenseToEdit}
      />

      <footer className="foot-er">
        <p>&copy; 2024 Personal Budget Manager. All rights reserved.</p>
      </footer>
    </>
  )
}

export default App