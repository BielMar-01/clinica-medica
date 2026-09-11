import crypto from 'node:crypto'

import bcrypt from 'bcryptjs'

const PASSWORD_RESET_CODE_ROUNDS = 12

export function generatePasswordResetCode() {
  return crypto.randomInt(0, 1_000_000)
    .toString()
    .padStart(6, '0')
}

export async function hashPasswordResetCode(
  code: string,
) {
  return bcrypt.hash(
    code,
    PASSWORD_RESET_CODE_ROUNDS,
  )
}

export async function comparePasswordResetCode(
  code: string,
  hash: string,
) {
  return bcrypt.compare(code, hash)
}

export function generatePasswordResetToken() {
  return crypto.randomBytes(64).toString('hex')
}

export function hashPasswordResetToken(
  token: string,
) {
  return crypto
    .createHash('sha256')
    .update(token)
    .digest('hex')
}