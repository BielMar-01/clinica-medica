import { z } from 'zod'

const brazilianStateSchema = z
  .string()
  .trim()
  .length(2, 'A UF do CRM deve possuir 2 caracteres')
  .transform((value) => value.toUpperCase())

const doctorSpecialtySchema = z.object({
  especialidadeId: z
    .string()
    .regex(/^\d+$/, 'A especialidade informada é inválida'),

  principal: z.boolean().default(false),
})

const doctorBaseSchema = z.object({
  usuarioId: z
    .string()
    .regex(/^\d+$/, 'O usuário informado é inválido'),

  nomeCompleto: z
    .string()
    .trim()
    .min(2, 'O nome completo deve possuir pelo menos 2 caracteres')
    .max(180, 'O nome completo deve possuir no máximo 180 caracteres'),

  crmNumero: z
    .string()
    .trim()
    .min(1, 'O CRM é obrigatório')
    .max(20, 'O CRM deve possuir no máximo 20 caracteres'),

  crmUf: brazilianStateSchema,

  telefone: z
    .string()
    .trim()
    .max(20, 'O telefone deve possuir no máximo 20 caracteres')
    .optional()
    .nullable(),

  email: z
    .string()
    .trim()
    .email('E-mail inválido')
    .max(180, 'O e-mail deve possuir no máximo 180 caracteres')
    .transform((value) => value.toLowerCase())
    .optional()
    .nullable(),

  duracaoConsultaMinutos: z.coerce
    .number()
    .int('A duração da consulta deve ser um número inteiro')
    .min(5, 'A duração da consulta deve ser de pelo menos 5 minutos')
    .max(480, 'A duração da consulta deve ser de no máximo 480 minutos'),

  especialidades: z
    .array(doctorSpecialtySchema)
    .min(1, 'O médico deve possuir pelo menos uma especialidade'),
})

function validateDoctorSpecialties(
  data: {
    especialidades: Array<{
      especialidadeId: string
      principal: boolean
    }>
  },
  ctx: z.RefinementCtx,
) {
  const specialtyIds = data.especialidades.map(
    (specialty) => specialty.especialidadeId,
  )

  const uniqueSpecialtyIds = new Set(specialtyIds)

  if (uniqueSpecialtyIds.size !== specialtyIds.length) {
    ctx.addIssue({
      code: 'custom',
      path: ['especialidades'],
      message: 'Não é permitido informar a mesma especialidade mais de uma vez',
    })
  }

  const mainSpecialties = data.especialidades.filter(
    (specialty) => specialty.principal,
  )

  if (mainSpecialties.length !== 1) {
    ctx.addIssue({
      code: 'custom',
      path: ['especialidades'],
      message: 'O médico deve possuir exatamente uma especialidade principal',
    })
  }
}

export const createDoctorSchema = doctorBaseSchema.superRefine(
  validateDoctorSpecialties,
)

export const updateDoctorSchema = doctorBaseSchema.superRefine(
  validateDoctorSpecialties,
)

export const updateDoctorStatusSchema = z.object({
  ativo: z.boolean(),
})

export const doctorIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'O médico informado é inválido'),
})

export const doctorListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10),

  nome: z.string().trim().optional(),

  crm: z.string().trim().optional(),

  crmUf: brazilianStateSchema.optional(),

  especialidadeId: z
    .string()
    .regex(/^\d+$/, 'A especialidade informada é inválida')
    .optional(),

  ativo: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .optional(),
})

export type CreateDoctorInput = z.infer<typeof createDoctorSchema>
export type UpdateDoctorInput = z.infer<typeof updateDoctorSchema>
export type UpdateDoctorStatusInput = z.infer<
  typeof updateDoctorStatusSchema
>
export type DoctorListQuery = z.infer<typeof doctorListQuerySchema>