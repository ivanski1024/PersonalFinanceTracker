import { Router } from 'express'
import { CreateExpenseSchema } from './expense.schema.js'
import { ExpenseModel } from './expense.model.js'

export const expensesRouter = Router()

expensesRouter.post('/', async (req, res) => {
  const result = CreateExpenseSchema.safeParse(req.body)
  if (!result.success) {
    const message = result.error.issues[0].message
    res.status(400).json({ error: message })
    return
  }
  const expense = await ExpenseModel.create(result.data)
  res.status(201).json({
    id: expense._id.toString(),
    amount: expense.amount,
    category: expense.category,
    description: expense.description,
  })
})

expensesRouter.get('/', async (_req, res) => {
  const expenses = await ExpenseModel.find()
  res.status(200).json(expenses)
})
