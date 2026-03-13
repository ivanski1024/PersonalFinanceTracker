import { screen, render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { vi, beforeEach } from 'vitest'
import App from './App.tsx'
import * as expensesApi from './api/expenses'

beforeEach(() => {
  vi.restoreAllMocks()
  vi.spyOn(expensesApi, 'getExpenses').mockResolvedValue([])
})

describe('App', () => {
  it('renders the expense table on /', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )
    expect(screen.getByLabelText('Filter by category')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Apply filter' })).toBeInTheDocument()
  })
})
