export type EntryType = 'expense' | 'income'
export type Expense = { id: string; amount: number; category: string; description: string; type: EntryType }
export type CreateExpenseInput = Omit<Expense, 'id'>
