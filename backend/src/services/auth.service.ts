import { env } from '../config/env.js'
import {
  createRefreshToken,
  findRefreshTokenByHash,
  findUserByEmail,
  revokeRefreshToken,
  revokeRefreshTokenByHash,
  revokeAllActiveRefreshTokensByUser,
} from '../repositories/auth.repository.js'
import type { LoginInput } from '../schemas/auth.schema.js'
import { comparePassword } from '../utils/password.js'
import {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
} from '../utils/tokens.js'

type LoginContext = {
  ip?: string
  userAgent?: string
}

type RefreshContext = {
  ip?: string
  userAgent?: string
}

function calculateRefreshExpiration() {
  const expiresAt = new Date()

  expiresAt.setDate(
    expiresAt.getDate() +
      env.REFRESH_TOKEN_EXPIRATION_DAYS,
  )

  return expiresAt
}

export async function login(
  input: LoginInput,
  context: LoginContext,
) {
  const user = await findUserByEmail(input.email)

  if (!user || !user.ativo) {
    return null
  }

  const validPassword = await comparePassword(
    input.senha,
    user.senha,
  )

  if (!validPassword) {
    return null
  }

  const accessToken = generateAccessToken(
    user.id,
    user.perfil,
  )

  const refreshToken = generateRefreshToken()

  const tokenHash = hashRefreshToken(refreshToken)

  await createRefreshToken({
    usuarioId: user.id,
    tokenHash,
    expiraEm: calculateRefreshExpiration(),
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
    hashRefreshToken(refreshToken)

  const storedToken =
    await findRefreshTokenByHash(tokenHash)

  if (!storedToken) {
    return null
  }

  const user = storedToken.usuarios

  if (!user || !user.ativo) {
    return null
  }

  if (storedToken.revogado_em) {
    await revokeAllActiveRefreshTokensByUser(
      user.id,
    )

    return null
  }

  if (storedToken.expira_em <= new Date()) {
    await revokeRefreshToken(storedToken.id)

    return null
  }

  await revokeRefreshToken(storedToken.id)

  const newRefreshToken =
    generateRefreshToken()

  const newRefreshTokenHash =
    hashRefreshToken(newRefreshToken)

  await createRefreshToken({
    usuarioId: user.id,
    tokenHash: newRefreshTokenHash,
    expiraEm: calculateRefreshExpiration(),
    ipOrigem: context.ip,
    userAgent: context.userAgent,
  })

  const accessToken =
    generateAccessToken(
      user.id,
      user.perfil,
    )

  return {
    accessToken,
    refreshToken: newRefreshToken,

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
  const tokenHash = hashRefreshToken(refreshToken)

  await revokeRefreshTokenByHash(tokenHash)
}