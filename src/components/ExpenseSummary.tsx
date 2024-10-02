import React from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

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
  const expensesByCategory = expenses.reduce((acc, expense) => {
    acc[expense.budgetId] = (acc[expense.budgetId] || 0) + expense.amount
    return acc
  }, {} as Record<string, number>)

  const data = {
    labels: Object.keys(expensesByCategory),
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
        <Pie data={data} />
      </div>
    </div>
  )
}

export default ExpenseSummary