import { Prisma } from '@prisma/client'

export function isPrismaKnownRequestError(
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError {
  return (
    error instanceof
    Prisma.PrismaClientKnownRequestError
  )
}

export function isPrismaUniqueConstraintError(
  error: unknown,
) {
  return (
    isPrismaKnownRequestError(error) &&
    error.code === 'P2002'
  )
}

export function isPrismaRecordNotFoundError(
  error: unknown,
) {
  return (
    isPrismaKnownRequestError(error) &&
    error.code === 'P2025'
  )
}