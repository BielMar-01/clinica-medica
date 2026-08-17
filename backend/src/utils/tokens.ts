import crypto from 'node:crypto'

import jwt from 'jsonwebtoken'

import { env } from '../config/env.js'

export type AccessTokenPayload = {
  sub: string
  perfil: string
}

export function generateAccessToken(
  userId: bigint,
  perfil: string,
) {
  const payload: AccessTokenPayload = {
    sub: userId.toString(),
    perfil,
  }

  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRATION_SECONDS,
  })
}

export function verifyAccessToken(
  token: string,
): AccessTokenPayload {
  const decoded = jwt.verify(
    token,
    env.JWT_SECRET,
  )

  if (
    typeof decoded === 'string' ||
    !decoded.sub ||
    typeof decoded.perfil !== 'string'
  ) {
    throw new Error('Token inválido')
  }

  return {
    sub: decoded.sub,
    perfil: decoded.perfil,
  }
}

export function generateRefreshToken() {
  return crypto.randomBytes(64).toString('hex')
}

export function hashRefreshToken(token: string) {
  return crypto
    .createHash('sha256')
    .update(token)
    .digest('hex')
}