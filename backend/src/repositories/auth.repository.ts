import { prisma } from '../database/prisma.js'

export async function findUserByEmail(email: string) {
  return prisma.usuarios.findUnique({
    where: {
      email,
    },
  })
}

export async function findUserById(id: bigint) {
  return prisma.usuarios.findUnique({
    where: {
      id,
    },
  })
}

type CreateRefreshTokenInput = {
  usuarioId: bigint
  tokenHash: string
  expiraEm: Date
  ipOrigem?: string
  userAgent?: string
}

export async function createRefreshToken(
  input: CreateRefreshTokenInput,
) {
  return prisma.refresh_tokens.create({
    data: {
      usuario_id: input.usuarioId,
      token_hash: input.tokenHash,
      expira_em: input.expiraEm,
      ip_origem: input.ipOrigem,
      user_agent: input.userAgent,
    },
  })
}

export async function findRefreshTokenByHash(
  tokenHash: string,
) {
  return prisma.refresh_tokens.findUnique({
    where: {
      token_hash: tokenHash,
    },
    include: {
      usuarios: true,
    },
  })
}

export async function revokeRefreshToken(id: bigint) {
  return prisma.refresh_tokens.update({
    where: {
      id,
    },
    data: {
      revogado_em: new Date(),
    },
  })
}

export async function revokeRefreshTokenByHash(
  tokenHash: string,
) {
  const token = await prisma.refresh_tokens.findUnique({
    where: {
      token_hash: tokenHash,
    },
  })

  if (!token || token.revogado_em) {
    return null
  }

  return prisma.refresh_tokens.update({
    where: {
      id: token.id,
    },
    data: {
      revogado_em: new Date(),
    },
  })
}

export async function revokeAllActiveRefreshTokensByUser(
  usuarioId: bigint,
) {
  return prisma.refresh_tokens.updateMany({
    where: {
      usuario_id: usuarioId,
      revogado_em: null,
    },
    data: {
      revogado_em: new Date(),
    },
  })
}

export async function revokeAllRefreshTokensExcept(
  usuarioId: bigint,
  exceptTokenId: bigint,
) {
  return prisma.refresh_tokens.updateMany({
    where: {
      usuario_id: usuarioId,
      id: {
        not: exceptTokenId,
      },
      revogado_em: null,
    },
    data: {
      revogado_em: new Date(),
    },
  })
}