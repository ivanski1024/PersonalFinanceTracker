import { z } from 'zod'

export const CreateExpenseSchema = z.object({
  amount: z
    .number({ error: 'amount is required' })
    .positive('amount must be greater than zero'),
  category: z
    .string({ error: 'category is required' })
    .min(1, 'category is required'),
  description: z
    .string({ error: 'description is required' })
    .min(1, 'description is required'),
  type: z.enum(['expense', 'income'], {
    error: (issue) =>
      issue.input === undefined || issue.input === null
        ? 'type is required'
        : 'type must be expense or income',
  }),
  date: z.number().optional().transform((v) => v ?? Date.now()),
})

export type CreateExpenseInput = z.infer<typeof CreateExpenseSchema>
