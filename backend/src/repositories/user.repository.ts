import type {
  Prisma,
} from '@prisma/client'

import {
  prisma,
} from '../database/prisma.js'

import type {
  UserRole,
} from '../schemas/user.schema.js'

type ListUsersParams = {
  page: number
  limit: number
  nome?: string
  email?: string
  perfil?: UserRole
  ativo?: boolean
}

type UpdateUserData = {
  nome: string
  email: string
  perfil: UserRole
  atualizadoPor: bigint
}

export async function findUserById(
  id: bigint,
) {
  return prisma.usuarios.findUnique({
    where: {
      id,
    },
  })
}

export async function findUserByEmail(
  email: string,
) {
  return prisma.usuarios.findUnique({
    where: {
      email,
    },
  })
}

export async function listUsers(
  params: ListUsersParams,
) {
  const where:
    Prisma.usuariosWhereInput =
    {}

  if (params.nome) {
    where.nome = {
      contains:
        params.nome,
      mode: 'insensitive',
    }
  }

  if (params.email) {
    where.email = {
      contains:
        params.email,
      mode: 'insensitive',
    }
  }

  if (params.perfil) {
    where.perfil =
      params.perfil
  }

  if (
    params.ativo !==
    undefined
  ) {
    where.ativo =
      params.ativo
  }

  const skip =
    (params.page - 1) *
    params.limit

  const [
    users,
    total,
  ] =
    await prisma.$transaction([
      prisma.usuarios.findMany({
        where,

        skip,

        take:
          params.limit,

        orderBy: {
          nome: 'asc',
        },
      }),

      prisma.usuarios.count({
        where,
      }),
    ])

  return {
    users,
    total,
  }
}

export async function updateUser(
  id: bigint,
  data: UpdateUserData,
) {
  return prisma.usuarios.update({
    where: {
      id,
    },

    data: {
      nome:
        data.nome,

      email:
        data.email,

      perfil:
        data.perfil,

      atualizado_em:
        new Date(),

      atualizado_por:
        data.atualizadoPor,
    },
  })
}

export async function updateUserStatus(
  id: bigint,
  ativo: boolean,
  atualizadoPor: bigint,
) {
  return prisma.usuarios.update({
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

export async function revokeUserRefreshTokens(
  userId: bigint,
) {
  return prisma.refresh_tokens.updateMany({
    where: {
      usuario_id:
        userId,

      revogado_em:
        null,
    },

    data: {
      revogado_em:
        new Date(),
    },
  })
}