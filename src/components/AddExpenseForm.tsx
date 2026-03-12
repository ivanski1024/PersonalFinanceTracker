import { useState } from 'react'
import { createExpense } from '../api/expenses'

type FormState = {
  amount: string
  category: string
  description: string
}

type SubmitState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success' }
  | { status: 'error'; message: string }

const emptyForm: FormState = { amount: '', category: '', description: '' }

export const AddExpenseForm = () => {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [submitState, setSubmitState] = useState<SubmitState>({ status: 'idle' })

  const handleChange = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitState({ status: 'submitting' })
    try {
      await createExpense({
        amount: Number(form.amount),
        category: form.category,
        description: form.description,
      })
      setForm(emptyForm)
      setSubmitState({ status: 'success' })
    } catch (err) {
      setSubmitState({
        status: 'error',
        message: err instanceof Error ? err.message : 'Unknown error',
      })
    }
  }

  const isSubmitting = submitState.status === 'submitting'

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          type="number"
          value={form.amount}
          onChange={handleChange('amount')}
        />
      </div>
      <div>
        <label htmlFor="category">Category</label>
        <input
          id="category"
          type="text"
          value={form.category}
          onChange={handleChange('category')}
        />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <input
          id="description"
          type="text"
          value={form.description}
          onChange={handleChange('description')}
        />
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Adding...' : 'Add Expense'}
      </button>

      {submitState.status === 'success' && <p>Expense added!</p>}
      {submitState.status === 'error' && <p>{submitState.message}</p>}
    </form>
  )
}
