import type { Expense, CreateExpenseInput } from '../../domain/expense.js'
export interface ExpenseRepository {
  findAll(filter?: { category?: string }): Promise<Expense[]>
  findById(id: string): Promise<Expense | null>
  save(input: CreateExpenseInput): Promise<Expense>
  deleteById(id: string): Promise<void>
}
