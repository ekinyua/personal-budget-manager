import React, { useRef, useEffect } from "react"
import { Form, Modal, Button } from "react-bootstrap"
import { Budget, useBudgets } from "../contexts/BudgetsContext"

interface EditBudgetModalProps {
  show: boolean;
  handleClose: () => void;
  budgetToEdit: Budget | null;
}

export default function EditBudgetModal({ show, handleClose, budgetToEdit }: EditBudgetModalProps) {
  const nameRef = useRef<HTMLInputElement>(null)
  const maxRef = useRef<HTMLInputElement>(null)
  const { editBudget } = useBudgets()
  
  useEffect(() => {
    if (show && budgetToEdit) {
      if (nameRef.current) nameRef.current.value = budgetToEdit.name
      if (maxRef.current) maxRef.current.value = budgetToEdit.max.toString()
    }
  }, [show, budgetToEdit])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (nameRef.current && maxRef.current && budgetToEdit) {
      editBudget(budgetToEdit.id, {
        name: nameRef.current.value,
        max: parseFloat(maxRef.current.value),
      })
      handleClose()
    }
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Budget</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control ref={nameRef} type="text" required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="max">
            <Form.Label>Maximum Spending</Form.Label>
            <Form.Control
              ref={maxRef}
              type="number"
              required
              min={0}
              step={0.01}
            />
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