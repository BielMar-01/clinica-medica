import { prisma } from '../database/prisma.js'

export async function checkDatabaseConnection() {
  await prisma.$queryRaw`SELECT 1`

  return {
    status: 'ok',
    database: 'connected',
    provider: 'postgresql',
  }
}

export async function listEspecialidades() {
  const especialidades = await prisma.especialidades.findMany({
    select: {
      id: true,
      nome: true,
      ativo: true,
    },
    orderBy: {
      nome: 'asc',
    },
  })

  return especialidades.map((especialidade) => ({
    id: especialidade.id.toString(),
    nome: especialidade.nome,
    ativo: especialidade.ativo,
  }))
}