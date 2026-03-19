import mongoose from 'mongoose'

const expenseSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['expense', 'income'], required: true },
  date: { type: Number, required: true },
})

export const ExpenseModel = mongoose.model('Expense', expenseSchema)
