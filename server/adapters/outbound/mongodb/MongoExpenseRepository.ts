import type { ExpenseRepository } from '../../../ports/outbound/ExpenseRepository.js'
import type { Expense, CreateExpenseInput } from '../../../domain/expense.js'

export class MongoExpenseRepository implements ExpenseRepository {
  findAll(_filter?: { category?: string }): Promise<Expense[]> {
    throw new Error('not implemented')
  }

  findById(_id: string): Promise<Expense | null> {
    throw new Error('not implemented')
  }

  save(_input: CreateExpenseInput): Promise<Expense> {
    throw new Error('not implemented')
  }

  deleteById(_id: string): Promise<void> {
    throw new Error('not implemented')
  }
}
