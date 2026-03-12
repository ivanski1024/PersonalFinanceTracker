import { useState, useEffect } from 'react'
import { getExpenses } from '../api/expenses'
import type { Expense } from '../types/expense'

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; expenses: Expense[] }

const formatAmount = (amount: number) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount)

export const ExpenseList = () => {
  const [state, setState] = useState<State>({ status: 'loading' })
  const [category, setCategory] = useState('')
  const [appliedCategory, setAppliedCategory] = useState('')

  useEffect(() => {
    setState({ status: 'loading' })
    const options = appliedCategory ? { category: appliedCategory } : {}
    getExpenses(options)
      .then((expenses) => setState({ status: 'success', expenses }))
      .catch((err: unknown) =>
        setState({ status: 'error', message: err instanceof Error ? err.message : 'Unknown error' }),
      )
  }, [appliedCategory])

  const handleApplyFilter = () => setAppliedCategory(category)

  return (
    <div>
      <div>
        <label htmlFor="category-filter">Filter by category</label>
        <input
          id="category-filter"
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <button onClick={handleApplyFilter}>Apply filter</button>
      </div>

      {state.status === 'loading' && <p>Loading...</p>}
      {state.status === 'error' && <p>{state.message}</p>}
      {state.status === 'success' && state.expenses.length === 0 && <p>No expenses found.</p>}
      {state.status === 'success' && state.expenses.length > 0 && (
        <ul>
          {state.expenses.map((expense) => (
            <li key={expense.id}>
              <span>{expense.description}</span>
              <span>{expense.category}</span>
              <span>{formatAmount(expense.amount)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
