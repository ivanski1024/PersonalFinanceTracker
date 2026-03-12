import { Router } from 'express'
import mongoose from 'mongoose'
import { CreateExpenseSchema } from './expense.schema.js'
import { ExpenseModel } from './expense.model.js'

export const expensesRouter = Router()

const toExpenseResponse = (doc: InstanceType<typeof ExpenseModel>) => ({
  id: doc._id.toString(),
  amount: doc.amount,
  category: doc.category,
  description: doc.description,
})

expensesRouter.post('/', async (req, res) => {
  const result = CreateExpenseSchema.safeParse(req.body)
  if (!result.success) {
    const message = result.error.issues[0].message
    res.status(400).json({ error: message })
    return
  }
  const expense = await ExpenseModel.create(result.data)
  res.status(201).json(toExpenseResponse(expense))
})

expensesRouter.get('/', async (req, res) => {
  const filter = req.query.category ? { category: req.query.category } : {}
  const expenses = await ExpenseModel.find(filter)
  res.status(200).json(expenses.map(toExpenseResponse))
})

expensesRouter.get('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ error: 'invalid expense id' })
    return
  }
  const expense = await ExpenseModel.findById(req.params.id)
  if (!expense) {
    res.status(404).json({ error: 'expense not found' })
    return
  }
  res.status(200).json(toExpenseResponse(expense))
})
