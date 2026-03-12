import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExpenseList } from './ExpenseList'
import * as expensesApi from '../api/expenses'
import type { Expense } from '../types/expense'

const mockExpenses: Expense[] = [
  { id: '1', amount: 12.5, category: 'Food', description: 'Lunch' },
  { id: '2', amount: 3.0, category: 'Transport', description: 'Bus' },
]

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('ExpenseList', () => {
  it('shows loading state initially', () => {
    vi.spyOn(expensesApi, 'getExpenses').mockReturnValue(new Promise(() => {}))
    render(<ExpenseList />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders expenses after loading', async () => {
    vi.spyOn(expensesApi, 'getExpenses').mockResolvedValue(mockExpenses)
    render(<ExpenseList />)
    await waitFor(() => expect(screen.getByText('Lunch')).toBeInTheDocument())
    expect(screen.getByText('Bus')).toBeInTheDocument()
    expect(screen.getByText('£12.50')).toBeInTheDocument()
    expect(screen.getByText('Food')).toBeInTheDocument()
  })

  it('shows empty state when no expenses', async () => {
    vi.spyOn(expensesApi, 'getExpenses').mockResolvedValue([])
    render(<ExpenseList />)
    await waitFor(() => expect(screen.getByText('No expenses found.')).toBeInTheDocument())
  })

  it('shows error message on API failure', async () => {
    vi.spyOn(expensesApi, 'getExpenses').mockRejectedValue(new Error('Failed to fetch expenses'))
    render(<ExpenseList />)
    await waitFor(() => expect(screen.getByText('Failed to fetch expenses')).toBeInTheDocument())
  })

  it('filters by category when filter is applied', async () => {
    vi.spyOn(expensesApi, 'getExpenses').mockResolvedValue(mockExpenses)
    render(<ExpenseList />)
    await waitFor(() => screen.getByLabelText('Filter by category'))

    await userEvent.type(screen.getByLabelText('Filter by category'), 'Food')

    vi.spyOn(expensesApi, 'getExpenses').mockResolvedValue([mockExpenses[0]])
    await userEvent.click(screen.getByRole('button', { name: 'Apply filter' }))

    await waitFor(() => expect(expensesApi.getExpenses).toHaveBeenCalledWith({ category: 'Food' }))
  })
})
