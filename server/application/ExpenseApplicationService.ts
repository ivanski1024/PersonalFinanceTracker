import type { ExpenseService } from '../ports/inbound/ExpenseService.js'
import type { ExpenseRepository } from '../ports/outbound/ExpenseRepository.js'
import type { Expense, CreateExpenseInput } from '../domain/expense.js'

export class ExpenseApplicationService implements ExpenseService {
  constructor(_repository: ExpenseRepository) {}

  listExpenses(_filter?: { category?: string }): Promise<Expense[]> {
    throw new Error('not implemented')
  }

  getExpense(_id: string): Promise<Expense> {
    throw new Error('not implemented')
  }

  addExpense(_input: CreateExpenseInput): Promise<Expense> {
    throw new Error('not implemented')
  }

  removeExpense(_id: string): Promise<void> {
    throw new Error('not implemented')
  }
}
