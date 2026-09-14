import { env } from '../config/env.js'
import {
  completePasswordReset,
  createRefreshToken,
  findLatestActivePasswordResetCode,
  findPasswordResetByTokenHash,
  findRefreshTokenByHash,
  findUserByEmail,
  incrementPasswordResetAttempts,
  invalidatePasswordResetCode,
  markPasswordResetCodeAsUsed,
  markPasswordResetCodeAsVerified,
  replacePasswordResetCode,
  revokeAllActiveRefreshTokensByUser,
  revokeRefreshToken,
  revokeRefreshTokenByHash,
} from '../repositories/auth.repository.js'
import type {
  LoginInput,
  ResetPasswordInput,
} from '../schemas/auth.schema.js'
import {
  comparePassword,
  hashPassword,
} from '../utils/password.js'
import {
  comparePasswordResetCode,
  generatePasswordResetCode,
  generatePasswordResetToken,
  hashPasswordResetCode,
  hashPasswordResetToken,
} from '../utils/password-reset.js'
import {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
} from '../utils/tokens.js'

const PASSWORD_RESET_CODE_EXPIRATION_MINUTES = 10

const PASSWORD_RESET_TOKEN_EXPIRATION_MINUTES = 15

const PASSWORD_RESET_MAX_ATTEMPTS = 5

type LoginContext = {
  ip?: string
  userAgent?: string
}

type RefreshContext = {
  ip?: string
  userAgent?: string
}

export type VerifyPasswordResetCodeResult =
  | {
      status: 'verified'
      resetToken: string
    }
  | {
      status: 'invalid'
    }
  | {
      status: 'expired'
    }
  | {
      status: 'attempts_exceeded'
    }

function calculateRefreshExpiration() {
  const expiresAt = new Date()

  expiresAt.setDate(
    expiresAt.getDate() +
      env.REFRESH_TOKEN_EXPIRATION_DAYS,
  )

  return expiresAt
}

function calculatePasswordResetCodeExpiration() {
  const expiresAt = new Date()

  expiresAt.setMinutes(
    expiresAt.getMinutes() +
      PASSWORD_RESET_CODE_EXPIRATION_MINUTES,
  )

  return expiresAt
}

function calculatePasswordResetTokenExpiration() {
  const expiresAt = new Date()

  expiresAt.setMinutes(
    expiresAt.getMinutes() +
      PASSWORD_RESET_TOKEN_EXPIRATION_MINUTES,
  )

  return expiresAt
}

export async function login(
  input: LoginInput,
  context: LoginContext,
) {
  const user =
    await findUserByEmail(
      input.email,
    )

  if (!user || !user.ativo) {
    return null
  }

  const validPassword =
    await comparePassword(
      input.senha,
      user.senha,
    )

  if (!validPassword) {
    return null
  }

  const accessToken =
    generateAccessToken(
      user.id,
      user.perfil,
    )

  const refreshToken =
    generateRefreshToken()

  const tokenHash =
    hashRefreshToken(
      refreshToken,
    )

  await createRefreshToken({
    usuarioId: user.id,
    tokenHash,
    expiraEm:
      calculateRefreshExpiration(),
    ipOrigem: context.ip,
    userAgent: context.userAgent,
  })

  return {
    accessToken,
    refreshToken,

    user: {
      id: user.id.toString(),
      nome: user.nome,
      email: user.email,
      perfil: user.perfil,
    },
  }
}

export async function refreshSession(
  refreshToken: string,
  context: RefreshContext,
) {
  const tokenHash =
    hashRefreshToken(
      refreshToken,
    )

  const storedToken =
    await findRefreshTokenByHash(
      tokenHash,
    )

  if (!storedToken) {
    return null
  }

  const user =
    storedToken.usuarios

  if (!user || !user.ativo) {
    return null
  }

  if (storedToken.revogado_em) {
    await revokeAllActiveRefreshTokensByUser(
      user.id,
    )

    return null
  }

  if (
    storedToken.expira_em <=
    new Date()
  ) {
    await revokeRefreshToken(
      storedToken.id,
    )

    return null
  }

  await revokeRefreshToken(
    storedToken.id,
  )

  const newRefreshToken =
    generateRefreshToken()

  const newRefreshTokenHash =
    hashRefreshToken(
      newRefreshToken,
    )

  await createRefreshToken({
    usuarioId: user.id,

    tokenHash:
      newRefreshTokenHash,

    expiraEm:
      calculateRefreshExpiration(),

    ipOrigem: context.ip,

    userAgent:
      context.userAgent,
  })

  const accessToken =
    generateAccessToken(
      user.id,
      user.perfil,
    )

  return {
    accessToken,

    refreshToken:
      newRefreshToken,

    user: {
      id: user.id.toString(),
      nome: user.nome,
      email: user.email,
      perfil: user.perfil,
    },
  }
}

export async function logout(
  refreshToken: string,
) {
  const tokenHash =
    hashRefreshToken(
      refreshToken,
    )

  await revokeRefreshTokenByHash(
    tokenHash,
  )
}

export async function createPasswordResetCode(
  email: string,
) {
  const normalizedEmail =
    email
      .trim()
      .toLowerCase()

  const user =
    await findUserByEmail(
      normalizedEmail,
    )

  if (!user || !user.ativo) {
    return null
  }

  const code =
    generatePasswordResetCode()

  const codeHash =
    await hashPasswordResetCode(
      code,
    )

  await replacePasswordResetCode({
    usuarioId: user.id,

    codigoHash: codeHash,

    expiraEm:
      calculatePasswordResetCodeExpiration(),
  })

  return {
    code,

    user: {
      id: user.id.toString(),
      nome: user.nome,
      email: user.email,
    },
  }
}

export async function verifyPasswordResetCode(
  email: string,
  code: string,
): Promise<VerifyPasswordResetCodeResult> {
  const normalizedEmail =
    email
      .trim()
      .toLowerCase()

  const user =
    await findUserByEmail(
      normalizedEmail,
    )

  if (!user || !user.ativo) {
    return {
      status: 'invalid',
    }
  }

  const resetCode =
    await findLatestActivePasswordResetCode(
      user.id,
    )

  if (!resetCode) {
    return {
      status: 'invalid',
    }
  }

  if (
    resetCode.tentativas >=
    PASSWORD_RESET_MAX_ATTEMPTS
  ) {
    if (
      !resetCode.invalidado_em
    ) {
      await invalidatePasswordResetCode(
        resetCode.id,
      )
    }

    return {
      status:
        'attempts_exceeded',
    }
  }

  if (
    resetCode.expira_em <=
    new Date()
  ) {
    await invalidatePasswordResetCode(
      resetCode.id,
    )

    return {
      status: 'expired',
    }
  }

  if (
    resetCode.verificado_em
  ) {
    return {
      status: 'invalid',
    }
  }

  const validCode =
    await comparePasswordResetCode(
      code,
      resetCode.codigo_hash,
    )

  if (!validCode) {
    const nextAttempt =
      resetCode.tentativas + 1

    await incrementPasswordResetAttempts(
      resetCode.id,
    )

    if (
      nextAttempt >=
      PASSWORD_RESET_MAX_ATTEMPTS
    ) {
      await invalidatePasswordResetCode(
        resetCode.id,
      )

      return {
        status:
          'attempts_exceeded',
      }
    }

    return {
      status: 'invalid',
    }
  }

  const resetToken =
    generatePasswordResetToken()

  const resetTokenHash =
    hashPasswordResetToken(
      resetToken,
    )

  await markPasswordResetCodeAsVerified({
    id: resetCode.id,

    resetTokenHash,

    resetTokenExpiraEm:
      calculatePasswordResetTokenExpiration(),
  })

  return {
    status: 'verified',
    resetToken,
  }
}

export async function validatePasswordResetToken(
  resetToken: string,
) {
  const resetTokenHash =
    hashPasswordResetToken(
      resetToken,
    )

  const reset =
    await findPasswordResetByTokenHash(
      resetTokenHash,
    )

  if (!reset) {
    return null
  }

  if (
    reset.usado_em ||
    reset.invalidado_em ||
    !reset.verificado_em ||
    !reset.reset_token_expira_em
  ) {
    return null
  }

  if (
    reset.reset_token_expira_em <=
    new Date()
  ) {
    await invalidatePasswordResetCode(
      reset.id,
    )

    return null
  }

  if (!reset.usuarios.ativo) {
    return null
  }

  return reset
}

export async function consumePasswordResetToken(
  resetId: bigint,
) {
  await markPasswordResetCodeAsUsed(
    resetId,
  )
}

export async function resetPassword(
  input: ResetPasswordInput,
) {
  const reset =
    await validatePasswordResetToken(
      input.resetToken,
    )

  if (!reset) {
    return false
  }

  const passwordHash =
    await hashPassword(
      input.novaSenha,
    )

  const completed =
    await completePasswordReset({
      resetId: reset.id,

      usuarioId:
        reset.usuario_id,

      senhaHash:
        passwordHash,
    })

  return completed
}