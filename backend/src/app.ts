import cors from 'cors'
import express from 'express'

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
    version: 'cors-v1',
  })
})

export default app