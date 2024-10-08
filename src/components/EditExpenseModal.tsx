import React, { useRef, useEffect } from "react"
import { Form, Modal, Button } from "react-bootstrap"
import { Expense, useBudgets, UNCATEGORIZED_BUDGET_ID } from "../contexts/BudgetsContext"

interface EditExpenseModalProps {
  show: boolean;
  handleClose: () => void;
  expenseToEdit: Expense | null;
}

export default function EditExpenseModal({ show, handleClose, expenseToEdit }: EditExpenseModalProps) {
  const descriptionRef = useRef<HTMLInputElement>(null)
  const amountRef = useRef<HTMLInputElement>(null)
  const budgetIdRef = useRef<HTMLSelectElement>(null)
  const { editExpense, budgets } = useBudgets()
  
  useEffect(() => {
    if (show && expenseToEdit) {
      if (descriptionRef.current) descriptionRef.current.value = expenseToEdit.description
      if (amountRef.current) amountRef.current.value = expenseToEdit.amount.toString()
      if (budgetIdRef.current) budgetIdRef.current.value = expenseToEdit.budgetId
    }
  }, [show, expenseToEdit])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (descriptionRef.current && amountRef.current && budgetIdRef.current && expenseToEdit) {
      editExpense(expenseToEdit.id, {
        description: descriptionRef.current.value,
        amount: parseFloat(amountRef.current.value),
        budgetId: budgetIdRef.current.value,
      })
      handleClose()
    }
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Expense</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control ref={descriptionRef} type="text" required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="amount">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              ref={amountRef}
              type="number"
              required
              min={0}
              step={0.01}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="budgetId">
            <Form.Label>Budget</Form.Label>
            <Form.Select ref={budgetIdRef}>
              <option id={UNCATEGORIZED_BUDGET_ID}>Uncategorized</option>
              {budgets.map(budget => (
                <option key={budget.id} value={budget.id}>
                  {budget.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="primary" type="submit">
              Update
            </Button>
          </div>
        </Modal.Body>
      </Form>
    </Modal>
  )
}