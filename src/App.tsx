import { useState } from "react"
// import { Button, Stack } from "react-bootstrap"
// import Container from "react-bootstrap/Container"
import AddBudgetModal from "./components/AddBudgetModal"
import AddExpenseModal from "./components/AddExpenseModal"
import ViewExpensesModal from "./components/ViewExpensesModal"
import BudgetCard from "./components/BudgetCard"
import UncategorizedBudgetCard from "./components/UncategorizedBudgetCard"
import TotalBudgetCard from "./components/TotalBudgetCard"
import ExpenseSummary from "./components/ExpenseSummary"
import { UNCATEGORIZED_BUDGET_ID, useBudgets } from "./contexts/BudgetsContext"
import './styles.css'

function App() {
  const [showAddBudgetModal, setShowAddBudgetModal] = useState<boolean>(false)
  const [showAddExpenseModal, setShowAddExpenseModal] = useState<boolean>(false)
  const [viewExpensesModalBudgetId, setViewExpensesModalBudgetId] = useState<string | undefined>()
  const [addExpenseModalBudgetId, setAddExpenseModalBudgetId] = useState<string | undefined>()
  const { budgets, getBudgetExpenses, expenses } = useBudgets()

  function openAddExpenseModal(budgetId?: string) {
    setShowAddExpenseModal(true)
    setAddExpenseModalBudgetId(budgetId)
  }

  return (
    <>
      <nav className="nav-bar">
        <h1 className="nav-h1">Personal Budget Manager</h1>
        <ul className="nav-ul">
          <li className="nav-li"><button className="btn btn-primary" onClick={() => setShowAddBudgetModal(true)}>Add Budget</button></li>
          <li><button className="btn btn-secondary" onClick={() => openAddExpenseModal()}>Add Expense</button></li>
        </ul>
      </nav>
      
        
      <div className="content">  
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
        <ExpenseSummary expenses={expenses} />
      {/* </Container> */}
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
        />
      </div>
        <footer className="foot-er">
          <p>&copy; 2024 Personal Budget Manager. All rights reserved.</p>
        </footer>
    </>
  )
}

export default App