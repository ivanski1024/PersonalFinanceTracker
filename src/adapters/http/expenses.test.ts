import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getExpenses, getExpense, createExpense, deleteExpense } from './expenses'
import type { Expense, CreateExpenseInput } from '../../domain/expense'

const mockExpense: Expense = {
  id: 'abc123',
  amount: 42.5,
  category: 'Food',
  description: 'Lunch',
  type: 'expense',
}

const mockFetch = (body: unknown, status = 200) =>
  vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  })

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('getExpenses', () => {
  it('returns list of expenses', async () => {
    vi.stubGlobal('fetch', mockFetch([mockExpense]))
    const result = await getExpenses()
    expect(result).toEqual([mockExpense])
    expect(fetch).toHaveBeenCalledWith('/expenses', expect.any(Object))
  })

  it('filters by category when provided', async () => {
    vi.stubGlobal('fetch', mockFetch([mockExpense]))
    await getExpenses({ category: 'Food' })
    expect(fetch).toHaveBeenCalledWith('/expenses?category=Food', expect.any(Object))
  })

  it('throws on non-ok response', async () => {
    vi.stubGlobal('fetch', mockFetch({ error: 'server error' }, 500))
    await expect(getExpenses()).rejects.toThrow('Failed to fetch expenses')
  })
})

describe('getExpense', () => {
  it('returns a single expense by id', async () => {
    vi.stubGlobal('fetch', mockFetch(mockExpense))
    const result = await getExpense('abc123')
    expect(result).toEqual(mockExpense)
    expect(fetch).toHaveBeenCalledWith('/expenses/abc123', expect.any(Object))
  })

  it('throws on 404', async () => {
    vi.stubGlobal('fetch', mockFetch({ error: 'expense not found' }, 404))
    await expect(getExpense('missing')).rejects.toThrow('expense not found')
  })
})

describe('createExpense', () => {
  const input: CreateExpenseInput = { amount: 10, category: 'Transport', description: 'Bus', type: 'expense' }

  it('posts and returns created expense', async () => {
    vi.stubGlobal('fetch', mockFetch({ ...input, id: 'new1' }, 201))
    const result = await createExpense(input)
    expect(result).toEqual({ ...input, id: 'new1' })
    expect(fetch).toHaveBeenCalledWith(
      '/expenses',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      }),
    )
  })

  it('throws with server error message on 400', async () => {
    vi.stubGlobal('fetch', mockFetch({ error: 'amount must be greater than zero' }, 400))
    await expect(createExpense({ ...input, amount: -1 })).rejects.toThrow(
      'amount must be greater than zero',
    )
  })
})

describe('deleteExpense', () => {
  it('sends a DELETE request to the expense endpoint', async () => {
    vi.stubGlobal('fetch', mockFetch(null, 204))
    await deleteExpense('abc123')
    expect(fetch).toHaveBeenCalledWith(
      '/expenses/abc123',
      expect.objectContaining({ method: 'DELETE' }),
    )
  })

  it('throws on non-ok response', async () => {
    vi.stubGlobal('fetch', mockFetch({ error: 'not found' }, 404))
    await expect(deleteExpense('missing')).rejects.toThrow('Failed to delete expense')
  })
})
