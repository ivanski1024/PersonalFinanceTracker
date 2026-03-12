import express from 'express'
import { expensesRouter } from './expenses/expenses.router.js'

export const app = express()
app.use(express.json())
app.use('/expenses', expensesRouter)
