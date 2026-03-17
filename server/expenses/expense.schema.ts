import { z } from 'zod'

export const CreateExpenseSchema = z.object({
  amount: z.number(),
  category: z.string(),
  description: z.string(),
})

export type CreateExpenseInput = z.infer<typeof CreateExpenseSchema>
