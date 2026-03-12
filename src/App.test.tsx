import { screen, render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { vi, beforeEach } from 'vitest'
import App from './App.tsx'
import * as expensesApi from './api/expenses'

beforeEach(() => {
  vi.restoreAllMocks()
  vi.spyOn(expensesApi, 'getExpenses').mockResolvedValue([])
})

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )

describe('App', () => {
  it('renders expense list on /', () => {
    renderAt('/')
    expect(screen.getByLabelText('Filter by category')).toBeInTheDocument()
  })

  it('renders add expense form on /add', () => {
    renderAt('/add')
    expect(screen.getByRole('button', { name: 'Add Expense' })).toBeInTheDocument()
  })

  it('shows nav links on every page', () => {
    renderAt('/')
    expect(screen.getByRole('link', { name: 'Expenses' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Add Expense' })).toBeInTheDocument()
  })
})
