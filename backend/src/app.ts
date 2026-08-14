import express from 'express'

const app = express()

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

export default app