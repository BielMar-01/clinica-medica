import { Router } from 'express'
import swaggerUi from 'swagger-ui-express'

import { openApiDocument } from '../docs/openapi.js'

const docsRouter = Router()

docsRouter.get(
  '/docs.json',
  (_req, res) => {
    res.status(200).json(openApiDocument)
  },
)

docsRouter.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(
    openApiDocument,
    {
      customSiteTitle:
        'Clínica Médica API - Swagger',

      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true,
      },
    },
  ),
)

export default docsRouter