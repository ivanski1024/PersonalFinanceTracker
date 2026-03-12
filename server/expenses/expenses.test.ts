import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../app.js'
import { ExpenseModel } from './expense.model.js'

let mongoServer: MongoMemoryServer

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  await mongoose.connect(mongoServer.getUri())
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

beforeEach(async () => {
  await ExpenseModel.deleteMany({})
})

const validPayload = (overrides = {}) => ({
  amount: 42.5,
  category: 'Food',
  description: 'Lunch',
  ...overrides,
})

describe('POST /expenses', () => {
  it('returns 201 with the created expense and an id', async () => {
    const res = await request(app).post('/expenses').send(validPayload())

    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({
      id: expect.any(String),
      amount: 42.5,
      category: 'Food',
      description: 'Lunch',
    })
  })

  it('persists the expense to the database', async () => {
    const res = await request(app).post('/expenses').send(validPayload())

    const saved = await ExpenseModel.findById(res.body.id)
    expect(saved).not.toBeNull()
    expect(saved?.amount).toBe(42.5)
    expect(saved?.category).toBe('Food')
    expect(saved?.description).toBe('Lunch')
  })

  it("returns 400 with 'amount is required' when amount is omitted", async () => {
    const { amount: _amount, ...payload } = validPayload()
    const res = await request(app).post('/expenses').send(payload)

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ error: 'amount is required' })
  })

  it("returns 400 with 'amount must be greater than zero' when amount is 0", async () => {
    const res = await request(app).post('/expenses').send(validPayload({ amount: 0 }))

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ error: 'amount must be greater than zero' })
  })

  it("returns 400 with 'amount must be greater than zero' when amount is negative", async () => {
    const res = await request(app).post('/expenses').send(validPayload({ amount: -1 }))

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ error: 'amount must be greater than zero' })
  })

  it("returns 400 with 'category is required' when category is omitted", async () => {
    const { category: _category, ...payload } = validPayload()
    const res = await request(app).post('/expenses').send(payload)

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ error: 'category is required' })
  })

  it("returns 400 with 'description is required' when description is omitted", async () => {
    const { description: _description, ...payload } = validPayload()
    const res = await request(app).post('/expenses').send(payload)

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ error: 'description is required' })
  })
})

describe('GET /expenses', () => {
  it('returns 200 with an empty array when no expenses exist', async () => {
    const res = await request(app).get('/expenses')

    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })

  it('returns all expenses with id, amount, category, and description fields', async () => {
    await ExpenseModel.create([
      { amount: 42.5, category: 'Food', description: 'Lunch' },
      { amount: 15, category: 'Transport', description: 'Bus ticket' },
      { amount: 120, category: 'Entertainment', description: 'Cinema' },
    ])

    const res = await request(app).get('/expenses')

    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(3)
    for (const expense of res.body) {
      expect(expense).toMatchObject({
        id: expect.any(String),
        amount: expect.any(Number),
        category: expect.any(String),
        description: expect.any(String),
      })
    }
  })

  it('returns only expenses matching the given category filter', async () => {
    await ExpenseModel.create([
      { amount: 42.5, category: 'Food', description: 'Lunch' },
      { amount: 15, category: 'Transport', description: 'Bus ticket' },
      { amount: 12, category: 'Food', description: 'Coffee' },
    ])

    const res = await request(app).get('/expenses?category=Food')

    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(2)
    for (const expense of res.body) {
      expect(expense.category).toBe('Food')
    }
  })

  it('returns an empty array when no expenses match the category filter', async () => {
    await ExpenseModel.create({ amount: 42.5, category: 'Food', description: 'Lunch' })

    const res = await request(app).get('/expenses?category=Transport')

    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })
})

describe('GET /expenses/:id', () => {
  it('returns 200 with the expense when found', async () => {
    const created = await ExpenseModel.create({ amount: 42.5, category: 'Food', description: 'Lunch' })

    const res = await request(app).get(`/expenses/${created._id.toString()}`)

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({
      id: created._id.toString(),
      amount: 42.5,
      category: 'Food',
      description: 'Lunch',
    })
  })

  it("returns 404 with 'expense not found' when id does not exist", async () => {
    const res = await request(app).get('/expenses/000000000000000000000000')

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ error: 'expense not found' })
  })

  it("returns 400 with 'invalid expense id' when id is malformed", async () => {
    const res = await request(app).get('/expenses/not-a-valid-id')

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ error: 'invalid expense id' })
  })
})
