import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AddExpenseForm } from './AddExpenseForm'
import * as expensesApi from '../api/expenses'
import type { Expense } from '../types/expense'

const createdExpense: Expense = {
  id: 'new1',
  amount: 10,
  category: 'Transport',
  description: 'Bus',
}

beforeEach(() => {
  vi.restoreAllMocks()
})

const fillForm = async (amount: string, category: string, description: string) => {
  await userEvent.type(screen.getByLabelText('Amount'), amount)
  await userEvent.type(screen.getByLabelText('Category'), category)
  await userEvent.type(screen.getByLabelText('Description'), description)
}

describe('AddExpenseForm', () => {
  it('renders all form fields and a submit button', () => {
    render(<AddExpenseForm />)
    expect(screen.getByLabelText('Amount')).toBeInTheDocument()
    expect(screen.getByLabelText('Category')).toBeInTheDocument()
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add Expense' })).toBeInTheDocument()
  })

  it('submits valid data to the API', async () => {
    vi.spyOn(expensesApi, 'createExpense').mockResolvedValue(createdExpense)
    render(<AddExpenseForm />)

    await fillForm('10', 'Transport', 'Bus')
    await userEvent.click(screen.getByRole('button', { name: 'Add Expense' }))

    await waitFor(() =>
      expect(expensesApi.createExpense).toHaveBeenCalledWith({
        amount: 10,
        category: 'Transport',
        description: 'Bus',
      }),
    )
  })

  it('shows success message after submission', async () => {
    vi.spyOn(expensesApi, 'createExpense').mockResolvedValue(createdExpense)
    render(<AddExpenseForm />)

    await fillForm('10', 'Transport', 'Bus')
    await userEvent.click(screen.getByRole('button', { name: 'Add Expense' }))

    await waitFor(() => expect(screen.getByText('Expense added!')).toBeInTheDocument())
  })

  it('clears the form after successful submission', async () => {
    vi.spyOn(expensesApi, 'createExpense').mockResolvedValue(createdExpense)
    render(<AddExpenseForm />)

    await fillForm('10', 'Transport', 'Bus')
    await userEvent.click(screen.getByRole('button', { name: 'Add Expense' }))

    await waitFor(() => {
      expect((screen.getByLabelText('Amount') as HTMLInputElement).value).toBe('')
      expect((screen.getByLabelText('Category') as HTMLInputElement).value).toBe('')
      expect((screen.getByLabelText('Description') as HTMLInputElement).value).toBe('')
    })
  })

  it('shows API error message on failure', async () => {
    vi.spyOn(expensesApi, 'createExpense').mockRejectedValue(
      new Error('amount must be greater than zero'),
    )
    render(<AddExpenseForm />)

    await fillForm('-1', 'Food', 'Lunch')
    await userEvent.click(screen.getByRole('button', { name: 'Add Expense' }))

    await waitFor(() =>
      expect(screen.getByText('amount must be greater than zero')).toBeInTheDocument(),
    )
  })

  it('disables submit button while submitting', async () => {
    vi.spyOn(expensesApi, 'createExpense').mockReturnValue(new Promise(() => {}))
    render(<AddExpenseForm />)

    await fillForm('10', 'Transport', 'Bus')
    await userEvent.click(screen.getByRole('button', { name: 'Add Expense' }))

    expect(screen.getByRole('button', { name: 'Adding...' })).toBeDisabled()
  })
})
