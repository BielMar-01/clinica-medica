import cors from 'cors'
import express from 'express'

import { errorHandlerMiddleware } from './middlewares/error-handler.middleware.js'
import { notFoundMiddleware } from './middlewares/not-found.middleware.js'
import router from './routes/index.js'

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

app.use('/api', router)

app.use(notFoundMiddleware)

app.use(errorHandlerMiddleware)

export default app