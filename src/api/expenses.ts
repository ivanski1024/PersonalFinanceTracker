import type { Expense, CreateExpenseInput } from '../types/expense'

export const getExpenses = async (): Promise<Expense[]> => {
  throw new Error('not implemented')
}

export const getExpense = async (_id: string): Promise<Expense> => {
  throw new Error('not implemented')
}

export const deleteExpense = async (_id: string): Promise<void> => {
  throw new Error('not implemented')
}

export const createExpense = async (_input: CreateExpenseInput): Promise<Expense> => {
  throw new Error('not implemented')
}
