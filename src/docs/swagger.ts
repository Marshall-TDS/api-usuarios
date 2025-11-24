import swaggerJsdoc from 'swagger-jsdoc'

const userProperties = {
  id: {
    type: 'string',
    format: 'uuid',
    example: '18f9c754-764e-4ea1-9f2c-59fbf5ffc111',
  },
  fullName: {
    type: 'string',
    example: 'Mariana Lopes',
  },
  login: {
    type: 'string',
    example: 'mlopes',
  },
  email: {
    type: 'string',
    format: 'email',
    example: 'mariana.lopes@example.com',
  },
  userGroup: {
    type: 'array',
    items: { type: 'string' },
    example: ['Administradores'],
  },
  features: {
    type: 'array',
    items: { type: 'string' },
    example: ['dashboard', 'financeiro'],
  },
  createdBy: {
    type: 'string',
    format: 'email',
    example: 'admin@marshall.com',
  },
  updatedBy: {
    type: 'string',
    format: 'email',
    example: 'admin@marshall.com',
  },
  createdAt: {
    type: 'string',
    format: 'date-time',
    example: '2025-10-02T10:45:00Z',
  },
  updatedAt: {
    type: 'string',
    format: 'date-time',
    example: '2025-11-05T17:30:00Z',
  },
}

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'API de Usuários',
    version: '1.0.0',
    description:
      'Documentação do CRUD de usuários seguindo arquitetura SOLID/MVC.\n\n' +
      'Todas as rotas respondem com JSON e estão versionadas sob `/api`.',
  },
  servers: [
    {
      url: 'http://localhost:3333/api',
      description: 'Desenvolvimento local',
    },
  ],
  tags: [
    { name: 'Health', description: 'Status do serviço' },
    { name: 'Users', description: 'Gestão de usuários corporativos' },
  ],
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: userProperties,
      },
      CreateUserInput: {
        type: 'object',
        required: ['fullName', 'login', 'email', 'userGroup', 'createdBy'],
        properties: {
          fullName: userProperties.fullName,
          login: userProperties.login,
          email: userProperties.email,
          userGroup: userProperties.userGroup,
          features: userProperties.features,
          createdBy: userProperties.createdBy,
        },
      },
      UpdateUserInput: {
        type: 'object',
        required: ['updatedBy'],
        properties: {
          fullName: { ...userProperties.fullName, nullable: true },
          login: { ...userProperties.login, nullable: true },
          email: { ...userProperties.email, nullable: true },
          userGroup: { ...userProperties.userGroup, nullable: true },
          features: { ...userProperties.features, nullable: true },
          updatedBy: userProperties.updatedBy,
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'error' },
          message: { type: 'string', example: 'Descrição do erro' },
          details: { type: 'object', nullable: true },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Verifica status da API',
        responses: {
          200: {
            description: 'Serviço operante',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/users': {
      get: {
        tags: ['Users'],
        summary: 'Lista usuários com filtros opcionais',
        parameters: [
          {
            in: 'query',
            name: 'search',
            schema: { type: 'string' },
            description: 'Filtro por nome, login ou e-mail',
          },
          {
            in: 'query',
            name: 'userGroup',
            schema: { type: 'string' },
          },
          {
            in: 'query',
            name: 'feature',
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Lista de usuários',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/User' },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Users'],
        summary: 'Cria um novo usuário',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateUserInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'Usuário criado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' },
              },
            },
          },
          409: {
            description: 'Login ou e-mail duplicado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/users/{id}': {
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'string', format: 'uuid' },
        },
      ],
      get: {
        tags: ['Users'],
        summary: 'Busca detalhes de um usuário',
        responses: {
          200: {
            description: 'Usuário encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' },
              },
            },
          },
          404: {
            description: 'Usuário não encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      put: {
        tags: ['Users'],
        summary: 'Atualiza um usuário existente',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateUserInput' },
            },
          },
        },
        responses: {
          200: {
            description: 'Usuário atualizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' },
              },
            },
          },
          404: {
            description: 'Usuário não encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Users'],
        summary: 'Remove um usuário',
        responses: {
          204: { description: 'Usuário removido' },
          404: {
            description: 'Usuário não encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
  },
}

const swaggerOptions = {
  definition: swaggerDefinition,
  apis: [],
}

export const swaggerSpec = swaggerJsdoc(swaggerOptions)

