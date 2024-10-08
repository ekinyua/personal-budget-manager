import { Modal, Button, Stack } from "react-bootstrap"
import { Expense, UNCATEGORIZED_BUDGET_ID, useBudgets } from "../contexts/BudgetsContext"
import { currencyFormatter } from "../utils"

interface ViewExpensesModalProps {
  budgetId: string | undefined;
  handleClose: () => void;
  onEditExpense: (expense: Expense) => void; // Added prop
}

export default function ViewExpensesModal({ budgetId, handleClose, onEditExpense }: ViewExpensesModalProps) {
  const { getBudgetExpenses, budgets, deleteBudget, deleteExpense } = useBudgets()

  const expenses = budgetId ? getBudgetExpenses(budgetId) : []
  const budget = 
    UNCATEGORIZED_BUDGET_ID === budgetId
      ? { name: "Uncategorized", id: UNCATEGORIZED_BUDGET_ID }
      : budgets.find(b => b.id === budgetId)

  return (
    <Modal show={budgetId != null} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          <Stack direction="horizontal" gap={2}>
            <div>Expenses - {budget?.name}</div>
            {budgetId !== UNCATEGORIZED_BUDGET_ID && (
              <Button
                onClick={() => {
                  if (budget) deleteBudget(budget.id)
                  handleClose()
                }}
                variant="outline-danger"
              >
                Delete
              </Button>
            )}
          </Stack>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Stack direction="vertical" gap={3}>
          {expenses.map(expense => (
            <Stack direction="horizontal" gap={2} key={expense.id}>
              <div className="me-auto fs-4">{expense.description}</div>
              <div className="fs-5">
                {currencyFormatter.format(expense.amount)}
              </div>
              <Button
                onClick={() => deleteExpense(expense.id)}
                size="sm"
                variant="outline-danger"
              >
                &times;
              </Button>
              <Button
                onClick={() => onEditExpense(expense)} // Use the onEditExpense prop here
                size="sm"
                variant="outline-primary"
              >
                Edit
              </Button>
            </Stack>
          ))}
        </Stack>
      </Modal.Body>
    </Modal>
  )
}
