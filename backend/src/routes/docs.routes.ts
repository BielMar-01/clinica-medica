import { Router } from 'express'

import { openApiDocument } from '../docs/openapi.js'

const docsRouter = Router()

docsRouter.get('/docs.json', (_req, res) => {
  res.status(200).json(openApiDocument)
})

docsRouter.get('/docs', (_req, res) => {
  res
    .status(200)
    .type('html')
    .send(`
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8" />

          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />

          <title>Clínica Médica API - Swagger</title>

          <link
            rel="stylesheet"
            href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css"
          />

          <style>
            html {
              box-sizing: border-box;
              overflow-y: scroll;
            }

            *,
            *::before,
            *::after {
              box-sizing: inherit;
            }

            body {
              margin: 0;
              background: #fafafa;
            }
          </style>
        </head>

        <body>
          <div id="swagger-ui"></div>

          <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>

          <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>

          <script>
            window.onload = () => {
              window.ui = SwaggerUIBundle({
                url: '/api/docs.json',

                dom_id: '#swagger-ui',

                deepLinking: true,

                persistAuthorization: true,

                displayRequestDuration: true,

                filter: true,

                presets: [
                  SwaggerUIBundle.presets.apis,
                  SwaggerUIStandalonePreset
                ],

                layout: 'StandaloneLayout'
              })
            }
          </script>
        </body>
      </html>
    `)
})

export default docsRouter