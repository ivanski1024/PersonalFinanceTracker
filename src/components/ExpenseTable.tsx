import { useState, useEffect } from 'react'
import { getExpenses, createExpense, deleteExpense } from '../api/expenses'
import type { Expense } from '../types/expense'

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; expenses: Expense[] }

type AddForm = { name: string; amount: string; category: string }

const emptyForm: AddForm = { name: '', amount: '', category: '' }

const formatAmount = (amount: number) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount)

export const ExpenseTable = () => {
  const [state, setState] = useState<LoadState>({ status: 'loading' })
  const [categoryInput, setCategoryInput] = useState('')
  const [appliedCategory, setAppliedCategory] = useState('')
  const [form, setForm] = useState<AddForm>(emptyForm)
  const [validationError, setValidationError] = useState('')

  useEffect(() => {
    setState({ status: 'loading' })
    const options = appliedCategory ? { category: appliedCategory } : {}
    getExpenses(options)
      .then((expenses) => setState({ status: 'success', expenses }))
      .catch((err: unknown) =>
        setState({
          status: 'error',
          message: err instanceof Error ? err.message : 'Unknown error',
        }),
      )
  }, [appliedCategory])

  const handleRemove = (id: string) => {
    deleteExpense(id).then(() =>
      setState((prev) =>
        prev.status === 'success'
          ? { ...prev, expenses: prev.expenses.filter((e) => e.id !== id) }
          : prev,
      ),
    )
  }

  const handleAdd = () => {
    if (!form.name || !form.amount || !form.category) {
      setValidationError('All fields are required.')
      return
    }
    setValidationError('')
    createExpense({ description: form.name, amount: Number(form.amount), category: form.category })
      .then((created) => {
        setState((prev) =>
          prev.status === 'success'
            ? { ...prev, expenses: [...prev.expenses, created] }
            : prev,
        )
        setForm(emptyForm)
      })
  }

  const setField = (field: keyof AddForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const expenses = state.status === 'success' ? state.expenses : []
  const total = expenses.reduce((sum, e) => sum + e.amount, 0)

  return (
    <div>
      <div>
        <label htmlFor="category-filter">Filter by category</label>
        <input
          id="category-filter"
          type="text"
          value={categoryInput}
          onChange={(e) => setCategoryInput(e.target.value)}
        />
        <button onClick={() => setAppliedCategory(categoryInput)}>Apply filter</button>
      </div>

      {state.status === 'loading' && <p>Loading...</p>}
      {state.status === 'error' && <p>{state.message}</p>}
      {state.status === 'success' && expenses.length === 0 && <p>No expenses found.</p>}

      {state.status === 'success' && expenses.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Amount</th>
              <th>Category</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td>{expense.description}</td>
                <td>{formatAmount(expense.amount)}</td>
                <td>{expense.category}</td>
                <td>
                  <button onClick={() => handleRemove(expense.id)}>Remove</button>
                </td>
              </tr>
            ))}
            <tr>
              <td>
                <input
                  type="text"
                  placeholder="Enter name..."
                  value={form.name}
                  onChange={setField('name')}
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Enter amount..."
                  value={form.amount}
                  onChange={setField('amount')}
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Enter category..."
                  value={form.category}
                  onChange={setField('category')}
                />
              </td>
              <td>
                <button onClick={handleAdd}>Add</button>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td>Total</td>
              <td>{formatAmount(total)}</td>
              <td></td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      )}

      {validationError && <p role="alert">{validationError}</p>}
    </div>
  )
}
