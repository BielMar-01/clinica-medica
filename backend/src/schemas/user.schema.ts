import { z } from 'zod'

export const userRoleSchema =
  z.enum([
    'ADMIN',
    'RECEPCIONISTA',
    'MEDICO',
  ])

export const updateUserSchema =
  z.object({
    nome: z
      .string()
      .trim()
      .min(
        2,
        'Nome do usuário é obrigatório',
      )
      .max(
        150,
        'Nome deve possuir no máximo 150 caracteres',
      ),

    email: z
      .string()
      .trim()
      .email(
        'E-mail inválido',
      )
      .max(
        180,
        'E-mail deve possuir no máximo 180 caracteres',
      )
      .transform(
        (value) =>
          value.toLowerCase(),
      ),

    perfil:
      userRoleSchema,
  })

export const updateUserStatusSchema =
  z.object({
    ativo: z.boolean(),
  })

export const userIdSchema =
  z.object({
    id: z
      .string()
      .regex(
        /^\d+$/,
        'ID do usuário inválido',
      ),
  })

export const userListQuerySchema =
  z.object({
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

    email: z
      .string()
      .trim()
      .optional(),

    perfil:
      userRoleSchema
        .optional(),

    ativo: z
      .enum([
        'true',
        'false',
      ])
      .transform(
        (value) =>
          value === 'true',
      )
      .optional(),
  })

export type UserRole =
  z.infer<
    typeof userRoleSchema
  >

export type UpdateUserInput =
  z.infer<
    typeof updateUserSchema
  >

export type UserListQuery =
  z.infer<
    typeof userListQuerySchema
  >