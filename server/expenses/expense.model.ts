import mongoose from 'mongoose'

const expenseSchema = new mongoose.Schema({
  amount: { type: Number },
  category: { type: String },
  description: { type: String },
})

export const ExpenseModel = mongoose.model('Expense', expenseSchema)
