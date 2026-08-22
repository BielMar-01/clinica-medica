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
      name: 'Pacientes',
      description: 'Cadastro e gerenciamento de pacientes.',
    },
    {
      name: 'Especialidades',
      description:
        'Cadastro e gerenciamento das especialidades médicas.',
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
            example: 'PATIENT_NOT_FOUND',
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

      PatientSummary: {
        type: 'object',

        properties: {
          id: {
            type: 'string',
            example: '1',
          },

          nomeCompleto: {
            type: 'string',
            example: 'João da Silva',
          },

          cpf: {
            type: 'string',
            example: '52998224725',
          },

          dataNascimento: {
            type: 'string',
            format: 'date',
            example: '1990-05-20',
          },

          telefone: {
            type: 'string',
            example: '11999999999',
          },

          email: {
            type: 'string',
            nullable: true,
            format: 'email',
            example: 'joao@example.com',
          },

          ativo: {
            type: 'boolean',
            example: true,
          },
        },
      },

      Patient: {
        type: 'object',

        properties: {
          id: {
            type: 'string',
            example: '1',
          },

          nomeCompleto: {
            type: 'string',
            example: 'João da Silva',
          },

          cpf: {
            type: 'string',
            example: '52998224725',
          },

          dataNascimento: {
            type: 'string',
            format: 'date',
            example: '1990-05-20',
          },

          sexo: {
            type: 'string',
            nullable: true,
            example: 'MASCULINO',
          },

          telefone: {
            type: 'string',
            example: '11999999999',
          },

          telefoneSecundario: {
            type: 'string',
            nullable: true,
            example: '11988888888',
          },

          email: {
            type: 'string',
            nullable: true,
            format: 'email',
            example: 'joao@example.com',
          },

          nomeMae: {
            type: 'string',
            nullable: true,
            example: 'Maria da Silva',
          },

          cep: {
            type: 'string',
            nullable: true,
            example: '01001000',
          },

          logradouro: {
            type: 'string',
            nullable: true,
            example: 'Praça da Sé',
          },

          numero: {
            type: 'string',
            nullable: true,
            example: '100',
          },

          complemento: {
            type: 'string',
            nullable: true,
            example: 'Sala 10',
          },

          bairro: {
            type: 'string',
            nullable: true,
            example: 'Sé',
          },

          cidade: {
            type: 'string',
            nullable: true,
            example: 'São Paulo',
          },

          estado: {
            type: 'string',
            nullable: true,
            example: 'SP',
          },

          observacoes: {
            type: 'string',
            nullable: true,
            example: 'Paciente cadastrado pela API',
          },

          ativo: {
            type: 'boolean',
            example: true,
          },

          criadoEm: {
            type: 'string',
            format: 'date-time',
          },

          criadoPor: {
            type: 'string',
            nullable: true,
            example: '1',
          },

          atualizadoEm: {
            type: 'string',
            nullable: true,
            format: 'date-time',
          },

          atualizadoPor: {
            type: 'string',
            nullable: true,
            example: '1',
          },
        },
      },

      PatientRequest: {
        type: 'object',

        required: [
          'nomeCompleto',
          'cpf',
          'dataNascimento',
          'telefone',
        ],

        properties: {
          nomeCompleto: {
            type: 'string',
            example: 'João da Silva',
          },

          cpf: {
            type: 'string',
            description:
              'Pode ser enviado com ou sem máscara. O backend normaliza e valida os dígitos verificadores.',
            example: '529.982.247-25',
          },

          dataNascimento: {
            type: 'string',
            format: 'date',
            example: '1990-05-20',
          },

          sexo: {
            type: 'string',
            example: 'MASCULINO',
          },

          telefone: {
            type: 'string',
            example: '(11) 99999-9999',
          },

          telefoneSecundario: {
            type: 'string',
            example: '(11) 98888-8888',
          },

          email: {
            type: 'string',
            format: 'email',
            example: 'joao@example.com',
          },

          nomeMae: {
            type: 'string',
            example: 'Maria da Silva',
          },

          cep: {
            type: 'string',
            example: '01001-000',
          },

          logradouro: {
            type: 'string',
            example: 'Praça da Sé',
          },

          numero: {
            type: 'string',
            example: '100',
          },

          complemento: {
            type: 'string',
            example: 'Sala 10',
          },

          bairro: {
            type: 'string',
            example: 'Sé',
          },

          cidade: {
            type: 'string',
            example: 'São Paulo',
          },

          estado: {
            type: 'string',
            example: 'SP',
          },

          observacoes: {
            type: 'string',
            example: 'Observação do paciente',
          },
        },
      },

      PatientStatusRequest: {
        type: 'object',

        required: [
          'ativo',
        ],

        properties: {
          ativo: {
            type: 'boolean',
            example: false,
          },
        },
      },

      SpecialtySummary: {
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

          descricao: {
            type: 'string',
            nullable: true,
            example:
              'Especialidade médica relacionada ao diagnóstico e tratamento de doenças cardiovasculares.',
          },

          ativo: {
            type: 'boolean',
            example: true,
          },
        },
      },

      Specialty: {
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

          descricao: {
            type: 'string',
            nullable: true,
            example:
              'Especialidade médica relacionada ao diagnóstico e tratamento de doenças cardiovasculares.',
          },

          ativo: {
            type: 'boolean',
            example: true,
          },

          criadoEm: {
            type: 'string',
            format: 'date-time',
          },

          criadoPor: {
            type: 'string',
            nullable: true,
            example: '1',
          },

          atualizadoEm: {
            type: 'string',
            nullable: true,
            format: 'date-time',
          },

          atualizadoPor: {
            type: 'string',
            nullable: true,
            example: '1',
          },
        },
      },

      SpecialtyRequest: {
        type: 'object',

        required: [
          'nome',
        ],

        properties: {
          nome: {
            type: 'string',
            minLength: 2,
            maxLength: 120,
            example: 'Neurologia',
          },

          descricao: {
            type: 'string',
            maxLength: 500,
            nullable: true,
            example:
              'Especialidade médica relacionada ao sistema nervoso.',
          },
        },
      },

      SpecialtyStatusRequest: {
        type: 'object',

        required: [
          'ativo',
        ],

        properties: {
          ativo: {
            type: 'boolean',
            example: false,
          },
        },
      },

      Pagination: {
        type: 'object',

        properties: {
          page: {
            type: 'integer',
            example: 1,
          },

          limit: {
            type: 'integer',
            example: 10,
          },

          total: {
            type: 'integer',
            example: 25,
          },

          totalPages: {
            type: 'integer',
            example: 3,
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
                  $ref: '#/components/schemas/HealthResponse',
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
        summary: 'Verificar conexão com PostgreSQL/Supabase',

        responses: {
          '200': {
            description: 'Banco de dados conectado',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/DatabaseHealthResponse',
                },
              },
            },
          },

          '500': {
            description: 'Não foi possível conectar ao banco',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
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
                $ref: '#/components/schemas/LoginRequest',
              },
            },
          },
        },

        responses: {
          '200': {
            description: 'Login realizado com sucesso',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AuthResponse',
                },
              },
            },
          },

          '400': {
            description: 'Dados enviados são inválidos',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },

          '401': {
            description: 'E-mail ou senha inválidos',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
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

        security: [
          {
            refreshCookie: [],
          },
        ],

        responses: {
          '200': {
            description: 'Sessão renovada com sucesso',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AuthResponse',
                },
              },
            },
          },

          '401': {
            description: 'Refresh Token inválido ou ausente',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
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

        security: [
          {
            refreshCookie: [],
          },
        ],

        responses: {
          '204': {
            description: 'Logout realizado com sucesso',
          },
        },
      },
    },

    '/api/auth/me': {
      get: {
        tags: ['Authentication'],
        summary: 'Obter usuário autenticado',

        security: [
          {
            bearerAuth: [],
          },
        ],

        responses: {
          '200': {
            description: 'Usuário autenticado',

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
                      $ref: '#/components/schemas/User',
                    },
                  },
                },
              },
            },
          },

          '401': {
            description: 'Token ausente ou inválido',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },

    '/api/pacientes': {
      get: {
        tags: ['Pacientes'],
        summary: 'Listar pacientes',
        description:
          'Lista pacientes com paginação e filtros opcionais.',

        security: [
          {
            bearerAuth: [],
          },
        ],

        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
          },
          {
            name: 'nome',
            in: 'query',
            schema: {
              type: 'string',
            },
          },
          {
            name: 'cpf',
            in: 'query',
            schema: {
              type: 'string',
            },
          },
          {
            name: 'telefone',
            in: 'query',
            schema: {
              type: 'string',
            },
          },
          {
            name: 'ativo',
            in: 'query',
            schema: {
              type: 'boolean',
            },
          },
        ],

        responses: {
          '200': {
            description: 'Pacientes encontrados',

            content: {
              'application/json': {
                schema: {
                  type: 'object',

                  properties: {
                    status: {
                      type: 'string',
                      example: 'ok',
                    },

                    data: {
                      type: 'array',

                      items: {
                        $ref: '#/components/schemas/PatientSummary',
                      },
                    },

                    pagination: {
                      $ref: '#/components/schemas/Pagination',
                    },
                  },
                },
              },
            },
          },

          '400': {
            description: 'Filtros inválidos',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },

          '401': {
            description: 'Usuário não autenticado',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },

          '403': {
            description: 'Usuário sem permissão',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },

      post: {
        tags: ['Pacientes'],
        summary: 'Cadastrar paciente',
        description:
          'Permitido para ADMIN e RECEPCIONISTA.',

        security: [
          {
            bearerAuth: [],
          },
        ],

        requestBody: {
          required: true,

          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/PatientRequest',
              },
            },
          },
        },

        responses: {
          '201': {
            description: 'Paciente cadastrado com sucesso',

            content: {
              'application/json': {
                schema: {
                  type: 'object',

                  properties: {
                    status: {
                      type: 'string',
                      example: 'ok',
                    },

                    message: {
                      type: 'string',
                      example: 'Paciente cadastrado com sucesso',
                    },

                    data: {
                      $ref: '#/components/schemas/Patient',
                    },
                  },
                },
              },
            },
          },

          '400': {
            description: 'Dados do paciente inválidos',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },

          '401': {
            description: 'Usuário não autenticado',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },

          '403': {
            description: 'Usuário sem permissão',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },

          '409': {
            description: 'CPF já cadastrado',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },

    '/api/pacientes/{id}': {
      get: {
        tags: ['Pacientes'],
        summary: 'Buscar paciente por ID',

        security: [
          {
            bearerAuth: [],
          },
        ],

        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,

            schema: {
              type: 'string',
              example: '1',
            },
          },
        ],

        responses: {
          '200': {
            description: 'Paciente encontrado',

            content: {
              'application/json': {
                schema: {
                  type: 'object',

                  properties: {
                    status: {
                      type: 'string',
                      example: 'ok',
                    },

                    data: {
                      $ref: '#/components/schemas/Patient',
                    },
                  },
                },
              },
            },
          },

          '400': {
            description: 'ID inválido',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },

          '401': {
            description: 'Usuário não autenticado',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },

          '403': {
            description: 'Usuário sem permissão',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },

          '404': {
            description: 'Paciente não encontrado',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },

      put: {
        tags: ['Pacientes'],
        summary: 'Atualizar paciente',
        description:
          'Permitido para ADMIN e RECEPCIONISTA.',

        security: [
          {
            bearerAuth: [],
          },
        ],

        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,

            schema: {
              type: 'string',
              example: '1',
            },
          },
        ],

        requestBody: {
          required: true,

          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/PatientRequest',
              },
            },
          },
        },

        responses: {
          '200': {
            description: 'Paciente atualizado',

            content: {
              'application/json': {
                schema: {
                  type: 'object',

                  properties: {
                    status: {
                      type: 'string',
                      example: 'ok',
                    },

                    message: {
                      type: 'string',
                      example: 'Paciente atualizado com sucesso',
                    },

                    data: {
                      $ref: '#/components/schemas/Patient',
                    },
                  },
                },
              },
            },
          },

          '400': {
            description: 'Dados inválidos',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },

          '401': {
            description: 'Usuário não autenticado',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },

          '403': {
            description: 'Usuário sem permissão',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },

          '404': {
            description: 'Paciente não encontrado',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },

          '409': {
            description: 'CPF já utilizado por outro paciente',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },

    '/api/pacientes/{id}/status': {
      patch: {
        tags: ['Pacientes'],
        summary: 'Ativar ou inativar paciente',
        description:
          'Permitido para ADMIN e RECEPCIONISTA.',

        security: [
          {
            bearerAuth: [],
          },
        ],

        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,

            schema: {
              type: 'string',
              example: '1',
            },
          },
        ],

        requestBody: {
          required: true,

          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/PatientStatusRequest',
              },
            },
          },
        },

        responses: {
          '200': {
            description: 'Status atualizado',

            content: {
              'application/json': {
                schema: {
                  type: 'object',

                  properties: {
                    status: {
                      type: 'string',
                      example: 'ok',
                    },

                    message: {
                      type: 'string',
                      example: 'Paciente inativado com sucesso',
                    },

                    data: {
                      $ref: '#/components/schemas/Patient',
                    },
                  },
                },
              },
            },
          },

          '400': {
            description: 'Status ou ID inválido',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },

          '401': {
            description: 'Usuário não autenticado',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },

          '403': {
            description: 'Usuário sem permissão',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },

          '404': {
            description: 'Paciente não encontrado',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },

          '409': {
            description: 'Paciente já possui o status informado',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },

    '/api/especialidades': {
      get: {
        tags: ['Especialidades'],
        summary: 'Listar especialidades',
        description:
          'Lista especialidades com paginação e filtros opcionais. Permitido para ADMIN, RECEPCIONISTA e MEDICO.',

        security: [
          {
            bearerAuth: [],
          },
        ],

        parameters: [
          {
            name: 'page',
            in: 'query',
            description: 'Página da listagem.',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
          },

          {
            name: 'limit',
            in: 'query',
            description:
              'Quantidade máxima de registros por página.',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
          },

          {
            name: 'nome',
            in: 'query',
            description:
              'Pesquisa parcial pelo nome da especialidade.',
            schema: {
              type: 'string',
              example: 'cardio',
            },
          },

          {
            name: 'ativo',
            in: 'query',
            description:
              'Filtra especialidades por situação.',
            schema: {
              type: 'boolean',
            },
          },
        ],

        responses: {
          '200': {
            description: 'Especialidades encontradas',

            content: {
              'application/json': {
                schema: {
                  type: 'object',

                  properties: {
                    status: {
                      type: 'string',
                      example: 'ok',
                    },

                    data: {
                      type: 'array',

                      items: {
                        $ref: '#/components/schemas/SpecialtySummary',
                      },
                    },

                    pagination: {
                      $ref: '#/components/schemas/Pagination',
                    },
                  },
                },
              },
            },
          },

          '400': {
            description: 'Filtros inválidos',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },

          '401': {
            description: 'Usuário não autenticado',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },

          '403': {
            description: 'Usuário sem permissão',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },

      post: {
        tags: ['Especialidades'],
        summary: 'Cadastrar especialidade',
        description:
          'Cadastra uma nova especialidade médica. Permitido somente para ADMIN.',

        security: [
          {
            bearerAuth: [],
          },
        ],

        requestBody: {
          required: true,

          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SpecialtyRequest',
              },

              example: {
                nome: 'Neurologia',
                descricao:
                  'Especialidade médica relacionada ao sistema nervoso.',
              },
            },
          },
        },

        responses: {
          '201': {
            description: 'Especialidade cadastrada com sucesso',

            content: {
              'application/json': {
                schema: {
                  type: 'object',

                  properties: {
                    status: {
                      type: 'string',
                      example: 'ok',
                    },

                    message: {
                      type: 'string',
                      example:
                        'Especialidade cadastrada com sucesso',
                    },

                    data: {
                      $ref: '#/components/schemas/Specialty',
                    },
                  },
                },
              },
            },
          },

          '400': {
            description: 'Dados da especialidade inválidos',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },

                example: {
                  status: 'error',
                  message:
                    'Dados da especialidade inválidos',
                  code: 'SPECIALTY_VALIDATION_ERROR',
                },
              },
            },
          },

          '401': {
            description: 'Usuário não autenticado',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },

          '403': {
            description:
              'Usuário não possui permissão para cadastrar especialidades',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },

          '409': {
            description:
              'Já existe uma especialidade com o nome informado',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },

                example: {
                  status: 'error',
                  message:
                    'Já existe uma especialidade cadastrada com este nome',
                  code: 'SPECIALTY_NAME_ALREADY_EXISTS',
                },
              },
            },
          },
        },
      },
    },

    '/api/especialidades/{id}': {
      get: {
        tags: ['Especialidades'],
        summary: 'Buscar especialidade por ID',
        description:
          'Permitido para ADMIN, RECEPCIONISTA e MEDICO.',

        security: [
          {
            bearerAuth: [],
          },
        ],

        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID da especialidade.',

            schema: {
              type: 'string',
              example: '1',
            },
          },
        ],

        responses: {
          '200': {
            description: 'Especialidade encontrada',

            content: {
              'application/json': {
                schema: {
                  type: 'object',

                  properties: {
                    status: {
                      type: 'string',
                      example: 'ok',
                    },

                    data: {
                      $ref: '#/components/schemas/Specialty',
                    },
                  },
                },
              },
            },
          },

          '400': {
            description: 'ID inválido',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },

                example: {
                  status: 'error',
                  message:
                    'ID da especialidade inválido',
                  code: 'SPECIALTY_ID_INVALID',
                },
              },
            },
          },

          '401': {
            description: 'Usuário não autenticado',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },

          '403': {
            description: 'Usuário sem permissão',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },

          '404': {
            description: 'Especialidade não encontrada',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },

                example: {
                  status: 'error',
                  message:
                    'Especialidade não encontrada',
                  code: 'SPECIALTY_NOT_FOUND',
                },
              },
            },
          },
        },
      },

      put: {
        tags: ['Especialidades'],
        summary: 'Atualizar especialidade',
        description:
          'Atualiza nome e descrição de uma especialidade. Permitido somente para ADMIN.',

        security: [
          {
            bearerAuth: [],
          },
        ],

        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,

            schema: {
              type: 'string',
              example: '1',
            },
          },
        ],

        requestBody: {
          required: true,

          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SpecialtyRequest',
              },

              example: {
                nome: 'Neurologia',
                descricao:
                  'Atendimento especializado em neurologia.',
              },
            },
          },
        },

        responses: {
          '200': {
            description: 'Especialidade atualizada com sucesso',

            content: {
              'application/json': {
                schema: {
                  type: 'object',

                  properties: {
                    status: {
                      type: 'string',
                      example: 'ok',
                    },

                    message: {
                      type: 'string',
                      example:
                        'Especialidade atualizada com sucesso',
                    },

                    data: {
                      $ref: '#/components/schemas/Specialty',
                    },
                  },
                },
              },
            },
          },

          '400': {
            description:
              'ID ou dados da especialidade inválidos',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },

          '401': {
            description: 'Usuário não autenticado',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },

          '403': {
            description:
              'Usuário não possui permissão para editar especialidades',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },

          '404': {
            description: 'Especialidade não encontrada',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },

                example: {
                  status: 'error',
                  message:
                    'Especialidade não encontrada',
                  code: 'SPECIALTY_NOT_FOUND',
                },
              },
            },
          },

          '409': {
            description:
              'Nome já utilizado por outra especialidade',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },

                example: {
                  status: 'error',
                  message:
                    'Já existe outra especialidade cadastrada com este nome',
                  code: 'SPECIALTY_NAME_ALREADY_EXISTS',
                },
              },
            },
          },
        },
      },
    },

    '/api/especialidades/{id}/status': {
      patch: {
        tags: ['Especialidades'],
        summary: 'Ativar ou inativar especialidade',
        description:
          'Altera a situação de uma especialidade. Permitido somente para ADMIN.',

        security: [
          {
            bearerAuth: [],
          },
        ],

        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,

            schema: {
              type: 'string',
              example: '1',
            },
          },
        ],

        requestBody: {
          required: true,

          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SpecialtyStatusRequest',
              },

              examples: {
                inativar: {
                  summary: 'Inativar especialidade',
                  value: {
                    ativo: false,
                  },
                },

                ativar: {
                  summary: 'Ativar especialidade',
                  value: {
                    ativo: true,
                  },
                },
              },
            },
          },
        },

        responses: {
          '200': {
            description:
              'Status da especialidade atualizado com sucesso',

            content: {
              'application/json': {
                schema: {
                  type: 'object',

                  properties: {
                    status: {
                      type: 'string',
                      example: 'ok',
                    },

                    message: {
                      type: 'string',
                      example:
                        'Especialidade inativada com sucesso',
                    },

                    data: {
                      $ref: '#/components/schemas/Specialty',
                    },
                  },
                },
              },
            },
          },

          '400': {
            description: 'ID ou status inválido',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },

          '401': {
            description: 'Usuário não autenticado',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },

          '403': {
            description:
              'Usuário não possui permissão para alterar especialidades',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },

          '404': {
            description: 'Especialidade não encontrada',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },

                example: {
                  status: 'error',
                  message:
                    'Especialidade não encontrada',
                  code: 'SPECIALTY_NOT_FOUND',
                },
              },
            },
          },

          '409': {
            description:
              'Especialidade já possui o status solicitado',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },

                examples: {
                  alreadyInactive: {
                    value: {
                      status: 'error',
                      message:
                        'Especialidade já está inativa',
                      code: 'SPECIALTY_ALREADY_INACTIVE',
                    },
                  },

                  alreadyActive: {
                    value: {
                      status: 'error',
                      message:
                        'Especialidade já está ativa',
                      code: 'SPECIALTY_ALREADY_ACTIVE',
                    },
                  },
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
        summary: 'Testar autorização de administrador',
        description:
          'Endpoint temporário utilizado para validar RBAC.',

        security: [
          {
            bearerAuth: [],
          },
        ],

        responses: {
          '200': {
            description: 'Usuário possui permissão ADMIN',
          },

          '401': {
            description: 'Usuário não autenticado',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },

          '403': {
            description: 'Usuário sem perfil ADMIN',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
  },
} as const