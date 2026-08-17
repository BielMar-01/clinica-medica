import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'

import { env } from './config/env.js'
import { errorHandlerMiddleware } from './middlewares/error-handler.middleware.js'
import { notFoundMiddleware } from './middlewares/not-found.middleware.js'
import router from './routes/index.js'

const app = express()

const allowedOrigins = [
  'http://localhost:5173',
  env.FRONTEND_URL,
]

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
    ],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
    ],
  }),
)

app.use(express.json())

app.use(cookieParser())

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