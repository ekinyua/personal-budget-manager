import React from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { useBudgets, UNCATEGORIZED_BUDGET_ID } from "../contexts/BudgetsContext"

ChartJS.register(ArcElement, Tooltip, Legend)

interface Expense {
  id: string
  description: string
  amount: number
  budgetId: string
}

interface ExpenseSummaryProps {
  expenses: Expense[]
}

const ExpenseSummary: React.FC<ExpenseSummaryProps> = ({ expenses }) => {
  const { budgets } = useBudgets()

  const expensesByCategory = expenses.reduce((acc, expense) => {
    acc[expense.budgetId] = (acc[expense.budgetId] || 0) + expense.amount
    return acc
  }, {} as Record<string, number>)

  const getBudgetName = (budgetId: string) => {
    if (budgetId === UNCATEGORIZED_BUDGET_ID) return "Uncategorized"
    return budgets.find(b => b.id === budgetId)?.name || "Unknown Budget"
  }

  const labels = Object.keys(expensesByCategory).map(getBudgetName)
  const data = {
    labels: labels,
    datasets: [
      {
        data: Object.values(expensesByCategory),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
      },
    ],
  }

  return (
    <div className="expense-summary">
      <h2 className="expense-summary__title">Expense Summary</h2>
      <div className="expense-summary__chart">
        {expenses.length > 0 ? (
          <Pie data={data} />
        ) : (
          <p>No expenses to display</p>
        )}
      </div>
    </div>
  )
}

export default ExpenseSummary