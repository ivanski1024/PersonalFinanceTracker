import { Routes, Route, Link } from 'react-router'
import { ExpenseList } from './components/ExpenseList'
import { AddExpenseForm } from './components/AddExpenseForm'
import './App.css'

function App() {
  return (
    <>
      <nav>
        <Link to="/">Expenses</Link>
        <Link to="/add">Add Expense</Link>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<ExpenseList />} />
          <Route path="/add" element={<AddExpenseForm />} />
        </Routes>
      </main>
    </>
  )
}

export default App
