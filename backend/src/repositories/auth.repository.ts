import { prisma } from '../database/prisma.js'

export async function findUserByEmail(
  email: string,
) {
  return prisma.usuarios.findUnique({
    where: {
      email,
    },
  })
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

export async function revokeRefreshToken(
  id: bigint,
) {
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
  const token =
    await prisma.refresh_tokens.findUnique({
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

type CreatePasswordResetCodeInput = {
  usuarioId: bigint
  codigoHash: string
  expiraEm: Date
}

export async function replacePasswordResetCode(
  input: CreatePasswordResetCodeInput,
) {
  const now = new Date()

  return prisma.$transaction(
    async (tx) => {
      await tx.codigos_redefinicao_senha.updateMany({
        where: {
          usuario_id: input.usuarioId,
          usado_em: null,
          invalidado_em: null,
        },

        data: {
          invalidado_em: now,
        },
      })

      return tx.codigos_redefinicao_senha.create({
        data: {
          usuario_id: input.usuarioId,
          codigo_hash: input.codigoHash,
          expira_em: input.expiraEm,
          tentativas: 0,
        },
      })
    },
  )
}

export async function findLatestActivePasswordResetCode(
  usuarioId: bigint,
) {
  return prisma.codigos_redefinicao_senha.findFirst({
    where: {
      usuario_id: usuarioId,
      usado_em: null,
      invalidado_em: null,
    },

    orderBy: {
      criado_em: 'desc',
    },
  })
}

export async function incrementPasswordResetAttempts(
  id: bigint,
) {
  return prisma.codigos_redefinicao_senha.update({
    where: {
      id,
    },

    data: {
      tentativas: {
        increment: 1,
      },
    },
  })
}

type MarkPasswordResetCodeAsVerifiedInput = {
  id: bigint
  resetTokenHash: string
  resetTokenExpiraEm: Date
}

export async function markPasswordResetCodeAsVerified(
  input: MarkPasswordResetCodeAsVerifiedInput,
) {
  return prisma.codigos_redefinicao_senha.update({
    where: {
      id: input.id,
    },

    data: {
      verificado_em: new Date(),

      reset_token_hash:
        input.resetTokenHash,

      reset_token_expira_em:
        input.resetTokenExpiraEm,
    },
  })
}

export async function findPasswordResetByTokenHash(
  resetTokenHash: string,
) {
  return prisma.codigos_redefinicao_senha.findUnique({
    where: {
      reset_token_hash:
        resetTokenHash,
    },

    include: {
      usuarios: true,
    },
  })
}

export async function markPasswordResetCodeAsUsed(
  id: bigint,
) {
  return prisma.codigos_redefinicao_senha.update({
    where: {
      id,
    },

    data: {
      usado_em: new Date(),
    },
  })
}

export async function invalidatePasswordResetCode(
  id: bigint,
) {
  return prisma.codigos_redefinicao_senha.update({
    where: {
      id,
    },

    data: {
      invalidado_em: new Date(),
    },
  })
}

type CompletePasswordResetInput = {
  resetId: bigint
  usuarioId: bigint
  senhaHash: string
}

export async function completePasswordReset(
  input: CompletePasswordResetInput,
) {
  const now = new Date()

  return prisma.$transaction(
    async (tx) => {
      const consumed =
        await tx.codigos_redefinicao_senha.updateMany({
          where: {
            id: input.resetId,

            usado_em: null,

            invalidado_em: null,

            verificado_em: {
              not: null,
            },

            reset_token_expira_em: {
              gt: now,
            },
          },

          data: {
            usado_em: now,
          },
        })

      if (consumed.count !== 1) {
        return false
      }

      await tx.usuarios.update({
        where: {
          id: input.usuarioId,
        },

        data: {
          senha: input.senhaHash,
          atualizado_em: now,
        },
      })

      await tx.refresh_tokens.updateMany({
        where: {
          usuario_id:
            input.usuarioId,

          revogado_em: null,
        },

        data: {
          revogado_em: now,
        },
      })

      return true
    },
  )
}