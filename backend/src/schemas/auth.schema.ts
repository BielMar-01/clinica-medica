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

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email('E-mail inválido')
    .transform((email) => email.toLowerCase()),
})

export const verifyResetCodeSchema = z.object({
  email: z
    .string()
    .trim()
    .email('E-mail inválido')
    .transform((email) => email.toLowerCase()),

  codigo: z
    .string()
    .trim()
    .regex(
      /^\d{6}$/,
      'O código deve possuir exatamente 6 dígitos',
    ),
})

export type LoginInput = z.infer<
  typeof loginSchema
>

export type ForgotPasswordInput = z.infer<
  typeof forgotPasswordSchema
>

export type VerifyResetCodeInput = z.infer<
  typeof verifyResetCodeSchema
>