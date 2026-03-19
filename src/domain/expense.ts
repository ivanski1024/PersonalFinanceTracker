export type EntryType = 'expense' | 'income'

export type Expense = {
  id: string
  amount: number
  category: string
  description: string
  type: EntryType
  date: number
}

export type CreateExpenseInput = {
  amount: number
  category: string
  description: string
  type: EntryType
  date?: number
}
