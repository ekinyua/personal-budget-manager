import { Table, Button } from 'react-bootstrap'
import { Expense } from '../contexts/BudgetsContext'
import { currencyFormatter } from '../utils'
import { Pie } from 'react-chartjs-2'
import 'chart.js/auto'

interface ExpenseSummaryProps {
  expenses: Expense[]
  onEditExpense: (expense: Expense) => void
}

export default function ExpenseSummary({ expenses, onEditExpense }: ExpenseSummaryProps) {
  // Prepare data for the Pie chart
  const pieChartData = {
    labels: expenses.map(expense => expense.description),
    datasets: [
      {
        data: expenses.map(expense => expense.amount),
        backgroundColor: expenses.map((_, index) => `hsl(${(index * 50) % 360}, 70%, 60%)`), // Dynamic colors
      },
    ],
  }

  return (
    <div className="expense-summary">
      <h2>Expense Summary</h2>

      {/* Check if there are no expenses */}
      {expenses.length === 0 ? (
        <div className="empty-state">
          <h5>No expenses found</h5>
          <p>Please add some expenses to visualize your spending!</p>
        </div>
      ) : (
        <>
          {/* Pie Chart */}
          <div style={{ width: '400px', margin: '0 auto' }}>
            <Pie data={pieChartData} />
          </div>

          {/* Expense Table */}
          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(expense => (
                <tr key={expense.id}>
                  <td>{expense.description}</td>
                  <td>{currencyFormatter.format(expense.amount)}</td>
                  <td>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => onEditExpense(expense)}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </div>
  )
}
