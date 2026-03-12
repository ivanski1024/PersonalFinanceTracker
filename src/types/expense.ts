export type Expense = {
  id: string
  amount: number
  category: string
  description: string
}

export type CreateExpenseInput = {
  amount: number
  category: string
  description: string
}
