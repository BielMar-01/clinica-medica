import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email('E-mail inválido')
    .transform((email) => email.toLowerCase()),

  senha: z
    .string()
    .min(1, 'Senha é obrigatória'),
})

export type LoginInput = z.infer<typeof loginSchema>