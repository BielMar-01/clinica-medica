export const openApiDocument = {
  openapi: '3.0.3',

  info: {
    title: 'Clínica Médica API',
    version: '1.0.0',
    description:
      'API REST do sistema de gestão da Clínica Médica - Galera do TI.',
  },

  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Ambiente local',
    },
    {
      url: 'https://clinica-medica-api.vercel.app',
      description: 'Produção',
    },
  ],

  tags: [
    {
      name: 'Health',
      description: 'Verificação de disponibilidade da API.',
    },
    {
      name: 'Database',
      description: 'Verificação da conexão com o banco de dados.',
    },
    {
      name: 'Authentication',
      description: 'Autenticação e gerenciamento da sessão.',
    },
    {
      name: 'Internal',
      description:
        'Rotas temporárias utilizadas durante o desenvolvimento.',
    },
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },

      refreshCookie: {
        type: 'apiKey',
        in: 'cookie',
        name: 'refresh_token',
      },
    },

    schemas: {
      ErrorResponse: {
        type: 'object',

        properties: {
          status: {
            type: 'string',
            example: 'error',
          },

          message: {
            type: 'string',
            example: 'Erro ao processar a requisição',
          },

          code: {
            type: 'string',
            nullable: true,
            example: 'ACCESS_TOKEN_INVALID',
          },

          details: {
            nullable: true,
          },
        },
      },

      User: {
        type: 'object',

        properties: {
          id: {
            type: 'string',
            example: '1',
          },

          nome: {
            type: 'string',
            example: 'Administrador',
          },

          email: {
            type: 'string',
            format: 'email',
            example: 'admin@clinica.local',
          },

          perfil: {
            type: 'string',
            enum: [
              'ADMIN',
              'RECEPCIONISTA',
              'MEDICO',
            ],
            example: 'ADMIN',
          },
        },
      },

      LoginRequest: {
        type: 'object',

        required: [
          'email',
          'senha',
        ],

        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'admin@clinica.local',
          },

          senha: {
            type: 'string',
            format: 'password',
            example: 'sua-senha',
          },
        },
      },

      AuthResponse: {
        type: 'object',

        properties: {
          status: {
            type: 'string',
            example: 'ok',
          },

          accessToken: {
            type: 'string',
            description:
              'JWT utilizado no header Authorization das rotas protegidas.',
            example: 'eyJhbGciOi...',
          },

          user: {
            $ref: '#/components/schemas/User',
          },
        },
      },

      HealthResponse: {
        type: 'object',

        properties: {
          status: {
            type: 'string',
            example: 'ok',
          },

          service: {
            type: 'string',
            example: 'clinica-medica-api',
          },
        },
      },

      DatabaseHealthResponse: {
        type: 'object',

        properties: {
          status: {
            type: 'string',
            example: 'ok',
          },

          database: {
            type: 'string',
            example: 'connected',
          },

          provider: {
            type: 'string',
            example: 'postgresql',
          },
        },
      },

      Especialidade: {
        type: 'object',

        properties: {
          id: {
            type: 'string',
            example: '1',
          },

          nome: {
            type: 'string',
            example: 'Cardiologia',
          },

          ativo: {
            type: 'boolean',
            example: true,
          },
        },
      },
    },
  },

  paths: {
    '/': {
      get: {
        tags: ['Health'],

        summary: 'Informações básicas da API',

        responses: {
          '200': {
            description: 'API disponível',

            content: {
              'application/json': {
                schema: {
                  type: 'object',

                  properties: {
                    message: {
                      type: 'string',
                      example: 'API Clínica Médica',
                    },

                    status: {
                      type: 'string',
                      example: 'online',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    '/api/health': {
      get: {
        tags: ['Health'],

        summary: 'Verificar disponibilidade da API',

        responses: {
          '200': {
            description: 'API disponível',

            content: {
              'application/json': {
                schema: {
                  $ref:
                    '#/components/schemas/HealthResponse',
                },
              },
            },
          },
        },
      },
    },

    '/api/database-health': {
      get: {
        tags: ['Database'],

        summary:
          'Verificar conexão com PostgreSQL/Supabase',

        responses: {
          '200': {
            description:
              'Banco de dados conectado',

            content: {
              'application/json': {
                schema: {
                  $ref:
                    '#/components/schemas/DatabaseHealthResponse',
                },
              },
            },
          },

          '500': {
            description:
              'Não foi possível conectar ao banco',

            content: {
              'application/json': {
                schema: {
                  $ref:
                    '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },

    '/api/database-test/especialidades': {
      get: {
        tags: ['Internal'],

        summary:
          'Listar especialidades para teste da integração',

        description:
          'Endpoint temporário. Será substituído pelo módulo oficial de especialidades.',

        responses: {
          '200': {
            description:
              'Especialidades encontradas',

            content: {
              'application/json': {
                schema: {
                  type: 'array',

                  items: {
                    $ref:
                      '#/components/schemas/Especialidade',
                  },
                },
              },
            },
          },
        },
      },
    },

    '/api/auth/login': {
      post: {
        tags: ['Authentication'],

        summary: 'Realizar login',

        description:
          'Autentica o usuário, retorna um Access Token JWT e cria um Refresh Token em cookie HttpOnly.',

        requestBody: {
          required: true,

          content: {
            'application/json': {
              schema: {
                $ref:
                  '#/components/schemas/LoginRequest',
              },
            },
          },
        },

        responses: {
          '200': {
            description:
              'Login realizado com sucesso',

            headers: {
              'Set-Cookie': {
                description:
                  'Cookie HttpOnly contendo o refresh token.',

                schema: {
                  type: 'string',
                },
              },
            },

            content: {
              'application/json': {
                schema: {
                  $ref:
                    '#/components/schemas/AuthResponse',
                },
              },
            },
          },

          '400': {
            description:
              'Dados enviados são inválidos',

            content: {
              'application/json': {
                schema: {
                  $ref:
                    '#/components/schemas/ErrorResponse',
                },
              },
            },
          },

          '401': {
            description:
              'E-mail ou senha inválidos',

            content: {
              'application/json': {
                schema: {
                  $ref:
                    '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },

    '/api/auth/refresh': {
      post: {
        tags: ['Authentication'],

        summary: 'Renovar sessão',

        description:
          'Utiliza o refresh_token armazenado em cookie HttpOnly para gerar um novo Access Token e realizar a rotação do Refresh Token.',

        security: [
          {
            refreshCookie: [],
          },
        ],

        responses: {
          '200': {
            description:
              'Sessão renovada com sucesso',

            content: {
              'application/json': {
                schema: {
                  $ref:
                    '#/components/schemas/AuthResponse',
                },
              },
            },
          },

          '401': {
            description:
              'Refresh Token ausente, inválido, expirado ou revogado',

            content: {
              'application/json': {
                schema: {
                  $ref:
                    '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },

    '/api/auth/logout': {
      post: {
        tags: ['Authentication'],

        summary: 'Encerrar sessão',

        description:
          'Revoga o Refresh Token atual e remove o cookie da sessão.',

        security: [
          {
            refreshCookie: [],
          },
        ],

        responses: {
          '204': {
            description:
              'Logout realizado com sucesso',
          },
        },
      },
    },

    '/api/auth/me': {
      get: {
        tags: ['Authentication'],

        summary:
          'Obter usuário autenticado',

        security: [
          {
            bearerAuth: [],
          },
        ],

        responses: {
          '200': {
            description:
              'Usuário autenticado',

            content: {
              'application/json': {
                schema: {
                  type: 'object',

                  properties: {
                    status: {
                      type: 'string',
                      example: 'ok',
                    },

                    user: {
                      $ref:
                        '#/components/schemas/User',
                    },
                  },
                },
              },
            },
          },

          '401': {
            description:
              'Access Token ausente ou inválido',

            content: {
              'application/json': {
                schema: {
                  $ref:
                    '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },

    '/api/authorization-test/admin': {
      get: {
        tags: ['Internal'],

        summary:
          'Testar autorização de administrador',

        description:
          'Endpoint temporário utilizado para validar RBAC.',

        security: [
          {
            bearerAuth: [],
          },
        ],

        responses: {
          '200': {
            description:
              'Usuário possui permissão ADMIN',
          },

          '401': {
            description:
              'Usuário não autenticado',

            content: {
              'application/json': {
                schema: {
                  $ref:
                    '#/components/schemas/ErrorResponse',
                },
              },
            },
          },

          '403': {
            description:
              'Usuário autenticado sem perfil ADMIN',

            content: {
              'application/json': {
                schema: {
                  $ref:
                    '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
  },
} as const