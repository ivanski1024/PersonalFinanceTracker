import mongoose from 'mongoose'
import { app } from './app.js'

const PORT = process.env.PORT ?? 3000
const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://localhost:27017/personal-finance'

await mongoose.connect(MONGO_URI)
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
