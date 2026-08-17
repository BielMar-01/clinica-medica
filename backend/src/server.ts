import app from './app.js'
import { env } from './config/env.js'

app.listen(env.PORT, () => {
  console.log(
    `API Clínica Médica rodando em http://localhost:${env.PORT}`,
  )
})

export default app