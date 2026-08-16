import cors from 'cors'
import express from 'express'

import { prisma } from './database/prisma.js'

const app = express()

const allowedOrigins = [
  'http://localhost:5173',
  'https://clinica-medica-galera-do-ti.vercel.app',
]

app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
)

app.use(express.json())

app.get('/', (_req, res) => {
  res.status(200).json({
    message: 'API Clínica Médica',
    status: 'online',
  })
})

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'clinica-medica-api',
  })
})

app.get('/api/database-health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`

    res.status(200).json({
      status: 'ok',
      database: 'connected',
      provider: 'postgresql',
    })
  } catch (error) {
    console.error('Erro ao conectar com o banco:', error)

    res.status(500).json({
      status: 'error',
      database: 'disconnected',
    })
  }
})

app.get('/api/database-test/especialidades', async (_req, res) => {
  try {
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

    const response = especialidades.map((especialidade) => ({
      id: especialidade.id.toString(),
      nome: especialidade.nome,
      ativo: especialidade.ativo,
    }))

    res.status(200).json(response)
  } catch (error) {
    console.error('Erro ao consultar especialidades:', error)

    res.status(500).json({
      status: 'error',
      message: 'Erro ao consultar especialidades',
    })
  }
})

export default app