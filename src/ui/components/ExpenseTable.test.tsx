import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExpenseTable } from './ExpenseTable'
import * as expensesApi from '../../adapters/http/expenses'
import type { Expense } from '../../domain/expense'

beforeEach(() => {
  vi.restoreAllMocks()
})

const makeExpenses = (): Expense[] => [
  { id: '1', description: 'Coffee', amount: 5, category: 'Going out', type: 'expense', date: 1700000000000 },
  { id: '2', description: 'Groceries', amount: 30, category: 'Shopping', type: 'expense', date: 1700000000000 },
  { id: '3', description: 'Salary', amount: 1000, category: 'Job', type: 'income', date: 1700000000000 },
]

// --- Table structure ---

describe('table structure', () => {
  it('displays Name, Amount, Category, and Type column headers', async () => {
    vi.spyOn(expensesApi, 'getExpenses').mockResolvedValue(makeExpenses())
    render(<ExpenseTable />)

    await waitFor(() => screen.getByRole('columnheader', { name: 'Name' }))
    expect(screen.getByRole('columnheader', { name: 'Amount' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Category' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Type' })).toBeInTheDocument()
  })

  it('renders a row for each expense with correct data', async () => {
    vi.spyOn(expensesApi, 'getExpenses').mockResolvedValue(makeExpenses())
    render(<ExpenseTable />)

    await waitFor(() => screen.getByText('Coffee'))
    expect(screen.getByText('Going out')).toBeInTheDocument()
    expect(screen.getByText('£5.00')).toBeInTheDocument()
    expect(screen.getByText('Groceries')).toBeInTheDocument()
    expect(screen.getByText('Shopping')).toBeInTheDocument()
    expect(screen.getByText('£30.00')).toBeInTheDocument()
    expect(screen.getByText('Salary')).toBeInTheDocument()
    expect(screen.getByText('Job')).toBeInTheDocument()
    expect(screen.getByText('£1,000.00')).toBeInTheDocument()
    expect(screen.getAllByText('expense')).toHaveLength(2)
    expect(screen.getByText('income')).toBeInTheDocument()
  })

  it('shows a Total row with the sum of all amounts', async () => {
    vi.spyOn(expensesApi, 'getExpenses').mockResolvedValue(makeExpenses())
    render(<ExpenseTable />)

    await waitFor(() => screen.getByText('Total'))
    expect(screen.getByText('£1,035.00')).toBeInTheDocument()
  })
})

// --- Remove ---

describe('removing an expense', () => {
  it('removes the row and updates the total when Remove is clicked', async () => {
    vi.spyOn(expensesApi, 'getExpenses').mockResolvedValue(makeExpenses())
    vi.spyOn(expensesApi, 'deleteExpense').mockResolvedValue(undefined)
    render(<ExpenseTable />)

    await waitFor(() => screen.getByText('Coffee'))
    const coffeeRow = screen.getByText('Coffee').closest('tr')!
    await userEvent.click(within(coffeeRow).getByRole('button', { name: 'Remove' }))

    await waitFor(() => expect(screen.queryByText('Coffee')).not.toBeInTheDocument())
    expect(screen.getAllByRole('button', { name: 'Remove' })).toHaveLength(2)
    expect(screen.getByText('£1,030.00')).toBeInTheDocument()
  })

  it('shows empty state after removing the last expense', async () => {
    const singleExpense: Expense[] = [
      { id: '1', description: 'Coffee', amount: 5, category: 'Going out', type: 'expense', date: 1700000000000 },
    ]
    vi.spyOn(expensesApi, 'getExpenses').mockResolvedValue(singleExpense)
    vi.spyOn(expensesApi, 'deleteExpense').mockResolvedValue(undefined)
    render(<ExpenseTable />)

    await waitFor(() => screen.getByText('Coffee'))
    await userEvent.click(screen.getByRole('button', { name: 'Remove' }))

    await waitFor(() => expect(screen.getByText('No expenses found.')).toBeInTheDocument())
  })
})

// --- Inline add row ---

describe('inline add row', () => {
  it('shows input fields with placeholders and an Add button', async () => {
    vi.spyOn(expensesApi, 'getExpenses').mockResolvedValue(makeExpenses())
    render(<ExpenseTable />)

    await waitFor(() => screen.getByText('Coffee'))
    expect(screen.getByPlaceholderText('Enter name...')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter amount...')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter category...')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter type...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument()
  })

  it('adds a new row, clears inputs, and updates the total on submit', async () => {
    vi.spyOn(expensesApi, 'getExpenses').mockResolvedValue(makeExpenses())
    vi.spyOn(expensesApi, 'createExpense').mockResolvedValue({
      id: '4',
      description: 'Lunch',
      amount: 12,
      category: 'Food',
      type: 'expense',
      date: 1700000000000,
    })
    render(<ExpenseTable />)

    await waitFor(() => screen.getByText('Coffee'))
    await userEvent.type(screen.getByPlaceholderText('Enter name...'), 'Lunch')
    await userEvent.type(screen.getByPlaceholderText('Enter amount...'), '12')
    await userEvent.type(screen.getByPlaceholderText('Enter category...'), 'Food')
    await userEvent.type(screen.getByPlaceholderText('Enter type...'), 'expense')
    await userEvent.click(screen.getByRole('button', { name: 'Add' }))

    await waitFor(() => screen.getByText('Lunch'))
    expect(screen.getByText('£12.00')).toBeInTheDocument()
    expect(screen.getByText('Food')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter name...')).toHaveValue('')
    expect(screen.getByPlaceholderText('Enter category...')).toHaveValue('')
    expect(screen.getByPlaceholderText('Enter type...')).toHaveValue('')
    expect(screen.getByText('£1,047.00')).toBeInTheDocument()
  })

  it('shows a validation message and does not add a row when fields are empty', async () => {
    vi.spyOn(expensesApi, 'getExpenses').mockResolvedValue(makeExpenses())
    const createSpy = vi.spyOn(expensesApi, 'createExpense')
    render(<ExpenseTable />)

    await waitFor(() => screen.getByText('Coffee'))
    await userEvent.click(screen.getByRole('button', { name: 'Add' }))

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(createSpy).not.toHaveBeenCalled()
  })
})

// --- Filtering ---

describe('filtering by category', () => {
  it('shows only matching expenses when a category filter is applied', async () => {
    vi.spyOn(expensesApi, 'getExpenses').mockResolvedValue(makeExpenses())
    render(<ExpenseTable />)

    await waitFor(() => screen.getByText('Coffee'))
    vi.spyOn(expensesApi, 'getExpenses').mockResolvedValue([
      { id: '2', description: 'Groceries', amount: 30, category: 'Shopping', type: 'expense', date: 1700000000000 },
    ])

    await userEvent.type(screen.getByLabelText('Filter by category'), 'Shopping')
    await userEvent.click(screen.getByRole('button', { name: 'Apply filter' }))

    await waitFor(() => expect(screen.queryByText('Coffee')).not.toBeInTheDocument())
    expect(screen.getByText('Groceries')).toBeInTheDocument()
    expect(screen.queryByText('Salary')).not.toBeInTheDocument()
  })
})
