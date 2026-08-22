import { z } from 'zod'

export const createSpecialtySchema = z.object({
  nome: z
    .string()
    .trim()
    .min(2, 'Nome da especialidade é obrigatório')
    .max(120, 'Nome deve possuir no máximo 120 caracteres'),

  descricao: z
    .string()
    .trim()
    .max(500, 'Descrição deve possuir no máximo 500 caracteres')
    .optional()
    .or(z.literal('')),
})

export const updateSpecialtySchema =
  createSpecialtySchema

export const updateSpecialtyStatusSchema = z.object({
  ativo: z.boolean(),
})

export const specialtyIdSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'ID da especialidade inválido'),
})

export const specialtyListQuerySchema = z.object({
  page: z.coerce
    .number()
    .int()
    .positive()
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(10),

  nome: z
    .string()
    .trim()
    .optional(),

  ativo: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .optional(),
})

export type CreateSpecialtyInput =
  z.infer<typeof createSpecialtySchema>

export type UpdateSpecialtyInput =
  z.infer<typeof updateSpecialtySchema>

export type SpecialtyListQuery =
  z.infer<typeof specialtyListQuerySchema>