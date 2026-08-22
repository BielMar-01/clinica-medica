import type { Prisma } from '@prisma/client'

import { prisma } from '../database/prisma.js'

type CreateSpecialtyData = {
  nome: string
  descricao?: string | null
  criadoPor: bigint
}

type UpdateSpecialtyData = {
  nome: string
  descricao?: string | null
  atualizadoPor: bigint
}

type ListSpecialtiesParams = {
  page: number
  limit: number
  nome?: string
  ativo?: boolean
}

export async function findSpecialtyById(
  id: bigint,
) {
  return prisma.especialidades.findUnique({
    where: {
      id,
    },
  })
}

export async function findSpecialtyByName(
  nome: string,
) {
  return prisma.especialidades.findUnique({
    where: {
      nome,
    },
  })
}

export async function listSpecialties(
  params: ListSpecialtiesParams,
) {
  const where: Prisma.especialidadesWhereInput = {}

  if (params.nome) {
    where.nome = {
      contains: params.nome,
      mode: 'insensitive',
    }
  }

  if (params.ativo !== undefined) {
    where.ativo = params.ativo
  }

  const skip =
    (params.page - 1) * params.limit

  const [specialties, total] =
    await prisma.$transaction([
      prisma.especialidades.findMany({
        where,
        skip,
        take: params.limit,

        orderBy: {
          nome: 'asc',
        },
      }),

      prisma.especialidades.count({
        where,
      }),
    ])

  return {
    specialties,
    total,
  }
}

export async function createSpecialty(
  data: CreateSpecialtyData,
) {
  return prisma.especialidades.create({
    data: {
      nome: data.nome,
      descricao: data.descricao ?? null,
      criado_por: data.criadoPor,
    },
  })
}

export async function updateSpecialty(
  id: bigint,
  data: UpdateSpecialtyData,
) {
  return prisma.especialidades.update({
    where: {
      id,
    },

    data: {
      nome: data.nome,
      descricao: data.descricao ?? null,
      atualizado_em: new Date(),
      atualizado_por: data.atualizadoPor,
    },
  })
}

export async function updateSpecialtyStatus(
  id: bigint,
  ativo: boolean,
  atualizadoPor: bigint,
) {
  return prisma.especialidades.update({
    where: {
      id,
    },

    data: {
      ativo,
      atualizado_em: new Date(),
      atualizado_por: atualizadoPor,
    },
  })
}