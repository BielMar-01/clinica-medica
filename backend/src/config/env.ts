import 'dotenv/config'

import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),

  PORT: z.coerce
    .number()
    .int()
    .positive()
    .default(3000),

  DATABASE_URL: z
    .string()
    .min(1, 'DATABASE_URL é obrigatória'),

  DIRECT_URL: z
    .string()
    .min(1, 'DIRECT_URL é obrigatória'),

  FRONTEND_URL: z
    .string()
    .url('FRONTEND_URL deve ser uma URL válida'),

  JWT_SECRET: z
    .string()
    .min(
      32,
      'JWT_SECRET deve possuir pelo menos 32 caracteres',
    ),

  JWT_ACCESS_EXPIRATION_SECONDS: z.coerce
    .number()
    .int()
    .positive()
    .default(900),

  REFRESH_TOKEN_EXPIRATION_DAYS: z.coerce
    .number()
    .int()
    .positive()
    .default(7),

  COOKIE_SECURE: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .default(false),

  COOKIE_SAME_SITE: z
    .enum(['lax', 'strict', 'none'])
    .default('lax'),

  ADMIN_NAME: z
    .string()
    .min(2)
    .default('Administrador'),

  ADMIN_EMAIL: z
    .string()
    .email()
    .default('admin@clinica.local'),

  ADMIN_PASSWORD: z
    .string()
    .min(
      8,
      'ADMIN_PASSWORD deve possuir pelo menos 8 caracteres',
    ),

  RESEND_API_KEY: z
    .string()
    .min(
      1,
      'RESEND_API_KEY é obrigatória',
    ),

  RESEND_FROM_EMAIL: z
    .string()
    .min(
      1,
      'RESEND_FROM_EMAIL é obrigatório',
    ),

  RESEND_FROM_NAME: z
    .string()
    .min(2)
    .default('Clínica Médica'),
})

const parsedEnv = envSchema.safeParse(
  process.env,
)

if (!parsedEnv.success) {
  console.error(
    'Variáveis de ambiente inválidas:',
  )

  console.error(
    parsedEnv.error.flatten().fieldErrors,
  )

  throw new Error(
    'Falha na validação das variáveis de ambiente',
  )
}

export const env = parsedEnv.data