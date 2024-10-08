import { Table, Button } from 'react-bootstrap'
import { Pie } from 'react-chartjs-2'
import { Expense } from '../contexts/BudgetsContext'
import { currencyFormatter } from '../utils'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

// Register chart.js components
ChartJS.register(ArcElement, Tooltip, Legend)

interface ExpenseSummaryProps {
  expenses: Expense[]
  onEditExpense: (expense: Expense) => void
}

export default function ExpenseSummary({ expenses, onEditExpense }: ExpenseSummaryProps) {

  // Prepare data for the pie chart
  const pieData = {
    labels: expenses.map(expense => expense.description), // Labels will be the expense descriptions
    datasets: [
      {
        label: 'Expenses',
        data: expenses.map(expense => expense.amount), // The amounts will be the data
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="expense-summary">
      <h2>Expense Summary</h2>
      
      {/* Pie Chart for visualizing expenses */}
      <div style={{ width: '300px', marginBottom: '20px' }}>
        <Pie data={pieData} />
      </div>

      {/* Table for detailed expenses */}
      <Table striped bordered hover>
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
    </div>
  )
}
