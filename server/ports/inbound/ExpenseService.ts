import type { Expense, CreateExpenseInput } from '../../domain/expense.js'
export interface ExpenseService {
  listExpenses(filter?: { category?: string }): Promise<Expense[]>
  getExpense(id: string): Promise<Expense>
  addExpense(input: CreateExpenseInput): Promise<Expense>
  removeExpense(id: string): Promise<void>
}
