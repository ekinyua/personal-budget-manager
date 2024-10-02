import { Button, Card, ProgressBar, Stack } from "react-bootstrap"
import { currencyFormatter } from "../utils"

interface BudgetCardProps {
  name: string
  amount: number
  max: number
  gray?: boolean
  hideButtons?: boolean
  onAddExpenseClick?: () => void
  onViewExpensesClick?: () => void
}

export default function BudgetCard({
  name,
  amount,
  max,
  gray,
  hideButtons,
  onAddExpenseClick,
  onViewExpensesClick,
}: BudgetCardProps) {
  const classNames = ["budget-card"]
  if (amount > max) {
    classNames.push("bg-danger", "bg-opacity-10")
  } else if (gray) {
    classNames.push("bg-light")
  }

  return (
    <Card className={classNames.join(" ")}>
      <Card.Body>
        <Card.Title className="budget-card__title d-flex justify-content-between align-items-baseline fw-normal mb-3">
          <div className="me-2">{name}</div>
          <div className="budget-card__amount d-flex align-items-baseline">
            {currencyFormatter.format(amount)}
            {max && (
              <span className="text-muted fs-6 ms-1">
                / {currencyFormatter.format(max)}
              </span>
            )}
          </div>
        </Card.Title>
        {max && (
          <ProgressBar
            className="budget-card__progress rounded-pill"
            variant={getProgressBarVariant(amount, max)}
            min={0}
            max={max}
            now={amount}
          />
        )}
        {!hideButtons && (
          <Stack direction="horizontal" gap={2} className="budget-card__buttons mt-4">
            <Button
              variant="outline-primary"
              className="ms-auto"
              onClick={onAddExpenseClick}
            >
              Add Expense
            </Button>
            <Button onClick={onViewExpensesClick} variant="outline-secondary">
              View Expenses
            </Button>
          </Stack>
        )}
      </Card.Body>
    </Card>
  )
}

function getProgressBarVariant(amount: number, max: number) {
  const ratio = amount / max
  if (ratio < 0.5) return "primary"
  if (ratio < 0.75) return "warning"
  return "danger"
}