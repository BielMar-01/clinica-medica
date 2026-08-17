import { z } from 'zod'

import {
  isValidCpf,
  onlyDigits,
} from '../utils/cpf.js'

const optionalEmailSchema = z
  .string()
  .trim()
  .email('E-mail inválido')
  .optional()
  .or(z.literal(''))

const optionalString = (
  max: number,
) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(''))

const cpfSchema = z
  .string()
  .trim()
  .transform(onlyDigits)
  .refine(
    (cpf) => cpf.length === 11,
    {
      message:
        'CPF deve conter 11 números',
    },
  )
  .refine(
    isValidCpf,
    {
      message:
        'CPF inválido',
    },
  )

const cepSchema = z
  .string()
  .trim()
  .transform(onlyDigits)
  .refine(
    (cep) =>
      cep === '' ||
      cep.length === 8,
    {
      message:
        'CEP deve conter 8 números',
    },
  )
  .optional()
  .or(z.literal(''))

const phoneSchema = z
  .string()
  .trim()
  .transform(onlyDigits)
  .refine(
    (telefone) =>
      telefone.length >= 8 &&
      telefone.length <= 20,
    {
      message:
        'Telefone inválido',
    },
  )

const optionalPhoneSchema = z
  .string()
  .trim()
  .transform(onlyDigits)
  .refine(
    (telefone) =>
      telefone === '' ||
      (
        telefone.length >= 8 &&
        telefone.length <= 20
      ),
    {
      message:
        'Telefone secundário inválido',
    },
  )
  .optional()
  .or(z.literal(''))

export const createPatientSchema =
  z.object({
    nomeCompleto: z
      .string()
      .trim()
      .min(
        3,
        'Nome completo é obrigatório',
      )
      .max(180),

    cpf: cpfSchema,

    dataNascimento: z
      .string()
      .date(
        'Data de nascimento inválida',
      ),

    sexo: optionalString(30),

    telefone: phoneSchema,

    telefoneSecundario:
      optionalPhoneSchema,

    email: optionalEmailSchema,

    nomeMae:
      optionalString(180),

    cep: cepSchema,

    logradouro:
      optionalString(180),

    numero:
      optionalString(20),

    complemento:
      optionalString(100),

    bairro:
      optionalString(100),

    cidade:
      optionalString(100),

    estado: z
      .string()
      .trim()
      .length(
        2,
        'Estado deve conter 2 caracteres',
      )
      .transform(
        (estado) =>
          estado.toUpperCase(),
      )
      .optional()
      .or(z.literal('')),

    observacoes: z
      .string()
      .trim()
      .optional()
      .or(z.literal('')),
  })

export const updatePatientSchema =
  createPatientSchema

export const updatePatientStatusSchema =
  z.object({
    ativo: z.boolean(),
  })

export const patientIdSchema =
  z.object({
    id: z
      .string()
      .regex(
        /^\d+$/,
        'ID do paciente inválido',
      ),
  })

export const patientListQuerySchema =
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

    cpf: z
      .string()
      .trim()
      .transform(onlyDigits)
      .optional(),

    telefone: z
      .string()
      .trim()
      .transform(onlyDigits)
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

export type CreatePatientInput =
  z.infer<
    typeof createPatientSchema
  >

export type UpdatePatientInput =
  z.infer<
    typeof updatePatientSchema
  >

export type UpdatePatientStatusInput =
  z.infer<
    typeof updatePatientStatusSchema
  >

export type PatientListQuery =
  z.infer<
    typeof patientListQuerySchema
  >