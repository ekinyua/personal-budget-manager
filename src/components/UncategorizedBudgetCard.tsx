import { UNCATEGORIZED_BUDGET_ID, useBudgets } from "../contexts/BudgetsContext"
import BudgetCard from "./BudgetCard"

interface UncategorizedBudgetCardProps {
  onAddExpenseClick: () => void;
  onViewExpensesClick: () => void;
}

export default function UncategorizedBudgetCard({ onAddExpenseClick, onViewExpensesClick }: UncategorizedBudgetCardProps) {
  const { getBudgetExpenses } = useBudgets()
  const amount = getBudgetExpenses(UNCATEGORIZED_BUDGET_ID).reduce(
    (total, expense) => total + expense.amount,
    0
  )
  
  if (amount === 0) return null

  return (
    <BudgetCard 
      amount={amount} 
      name="Uncategorized" 
      gray
      max={1000} 
      onAddExpenseClick={onAddExpenseClick} 
      onViewExpensesClick={onViewExpensesClick}
    />
  )
}