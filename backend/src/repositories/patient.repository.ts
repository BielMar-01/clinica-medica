import type { Prisma } from '@prisma/client'

import { prisma } from '../database/prisma.js'

type CreatePatientData = {
  nomeCompleto: string
  cpf: string
  dataNascimento: Date
  sexo?: string | null
  telefone: string
  telefoneSecundario?: string | null
  email?: string | null
  nomeMae?: string | null
  cep?: string | null
  logradouro?: string | null
  numero?: string | null
  complemento?: string | null
  bairro?: string | null
  cidade?: string | null
  estado?: string | null
  observacoes?: string | null
  criadoPor: bigint
}

type UpdatePatientData = {
  nomeCompleto: string
  cpf: string
  dataNascimento: Date
  sexo?: string | null
  telefone: string
  telefoneSecundario?: string | null
  email?: string | null
  nomeMae?: string | null
  cep?: string | null
  logradouro?: string | null
  numero?: string | null
  complemento?: string | null
  bairro?: string | null
  cidade?: string | null
  estado?: string | null
  observacoes?: string | null
  atualizadoPor: bigint
}

type ListPatientsParams = {
  page: number
  limit: number
  nome?: string
  cpf?: string
  telefone?: string
  ativo?: boolean
}

export async function findPatientByCpf(
  cpf: string,
) {
  return prisma.pacientes.findUnique({
    where: {
      cpf,
    },
  })
}

export async function findPatientById(
  id: bigint,
) {
  return prisma.pacientes.findUnique({
    where: {
      id,
    },
  })
}

export async function listPatients(
  params: ListPatientsParams,
) {
  const where: Prisma.pacientesWhereInput = {}

  if (params.nome) {
    where.nome_completo = {
      contains: params.nome,
      mode: 'insensitive',
    }
  }

  if (params.cpf) {
    where.cpf = {
      contains: params.cpf,
    }
  }

  if (params.telefone) {
    where.OR = [
      {
        telefone: {
          contains: params.telefone,
        },
      },
      {
        telefone_secundario: {
          contains: params.telefone,
        },
      },
    ]
  }

  if (params.ativo !== undefined) {
    where.ativo = params.ativo
  }

  const skip =
    (params.page - 1) *
    params.limit

  const [patients, total] =
    await prisma.$transaction([
      prisma.pacientes.findMany({
        where,
        skip,
        take: params.limit,
        orderBy: {
          nome_completo: 'asc',
        },
      }),

      prisma.pacientes.count({
        where,
      }),
    ])

  return {
    patients,
    total,
  }
}

export async function createPatient(
  data: CreatePatientData,
) {
  return prisma.pacientes.create({
    data: {
      nome_completo:
        data.nomeCompleto,

      cpf:
        data.cpf,

      data_nascimento:
        data.dataNascimento,

      sexo:
        data.sexo ?? null,

      telefone:
        data.telefone,

      telefone_secundario:
        data.telefoneSecundario ??
        null,

      email:
        data.email ?? null,

      nome_mae:
        data.nomeMae ?? null,

      cep:
        data.cep ?? null,

      logradouro:
        data.logradouro ?? null,

      numero:
        data.numero ?? null,

      complemento:
        data.complemento ?? null,

      bairro:
        data.bairro ?? null,

      cidade:
        data.cidade ?? null,

      estado:
        data.estado ?? null,

      observacoes:
        data.observacoes ?? null,

      criado_por:
        data.criadoPor,
    },
  })
}

export async function updatePatient(
  id: bigint,
  data: UpdatePatientData,
) {
  return prisma.pacientes.update({
    where: {
      id,
    },

    data: {
      nome_completo:
        data.nomeCompleto,

      cpf:
        data.cpf,

      data_nascimento:
        data.dataNascimento,

      sexo:
        data.sexo ?? null,

      telefone:
        data.telefone,

      telefone_secundario:
        data.telefoneSecundario ??
        null,

      email:
        data.email ?? null,

      nome_mae:
        data.nomeMae ?? null,

      cep:
        data.cep ?? null,

      logradouro:
        data.logradouro ?? null,

      numero:
        data.numero ?? null,

      complemento:
        data.complemento ?? null,

      bairro:
        data.bairro ?? null,

      cidade:
        data.cidade ?? null,

      estado:
        data.estado ?? null,

      observacoes:
        data.observacoes ?? null,

      atualizado_em:
        new Date(),

      atualizado_por:
        data.atualizadoPor,
    },
  })
}

export async function updatePatientStatus(
  id: bigint,
  ativo: boolean,
  atualizadoPor: bigint,
) {
  return prisma.pacientes.update({
    where: {
      id,
    },

    data: {
      ativo,

      atualizado_em:
        new Date(),

      atualizado_por:
        atualizadoPor,
    },
  })
}