import type { Expense, CreateExpenseInput } from '../domain/expense'
export interface ExpensePort {
  getExpenses(filter?: { category?: string }): Promise<Expense[]>
  getExpense(id: string): Promise<Expense>
  createExpense(input: CreateExpenseInput): Promise<Expense>
  deleteExpense(id: string): Promise<void>
}
