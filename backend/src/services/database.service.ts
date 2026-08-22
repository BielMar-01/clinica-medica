import {
  prisma,
} from '../database/prisma.js'

export async function checkDatabaseConnection() {
  await prisma.$queryRaw`
    SELECT 1
  `

  return {
    status: 'ok',
    database: 'connected',
    provider: 'postgresql',
  }
}