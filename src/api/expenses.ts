import type { Expense, CreateExpenseInput } from '../types/expense'

type GetExpensesOptions = {
  category?: string
}

const buildUrl = (base: string, params: Record<string, string>) => {
  const query = new URLSearchParams(params).toString()
  return query ? `${base}?${query}` : base
}

export const getExpenses = async ({ category }: GetExpensesOptions = {}): Promise<Expense[]> => {
  const url = category ? buildUrl('/expenses', { category }) : '/expenses'
  const response = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!response.ok) throw new Error('Failed to fetch expenses')
  return response.json() as Promise<Expense[]>
}

export const getExpense = async (id: string): Promise<Expense> => {
  const response = await fetch(`/expenses/${id}`, { headers: { Accept: 'application/json' } })
  if (!response.ok) {
    const body = (await response.json()) as { error: string }
    throw new Error(body.error)
  }
  return response.json() as Promise<Expense>
}

export const deleteExpense = async (id: string): Promise<void> => {
  const response = await fetch(`/expenses/${id}`, { method: 'DELETE' })
  if (!response.ok) throw new Error('Failed to delete expense')
}

export const createExpense = async (input: CreateExpenseInput): Promise<Expense> => {
  const response = await fetch('/expenses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!response.ok) {
    const body = (await response.json()) as { error: string }
    throw new Error(body.error)
  }
  return response.json() as Promise<Expense>
}
