import swaggerJsdoc from 'swagger-jsdoc'
import { FEATURE_CATALOG, FEATURE_KEYS } from '../modules/features/catalog'

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
  groupIds: {
    type: 'array',
    items: { type: 'string', format: 'uuid' },
    example: ['0d9a5a3b-1d2f-4cb6-9f92-4f19298d9640'],
  },
  allowFeatures: {
    type: 'array',
    description: 'Lista de funcionalidades permitidas explicitamente (chaves do catálogo)',
    items: { type: 'string', enum: FEATURE_KEYS },
    example: [],
  },
  deniedFeatures: {
    type: 'array',
    description: 'Lista de funcionalidades negadas explicitamente (chaves do catálogo)',
    items: { type: 'string', enum: FEATURE_KEYS },
    example: [],
  },
  createdBy: {
    type: 'string',
    example: 'admin',
  },
  updatedBy: {
    type: 'string',
    example: 'admin',
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

const userGroupProperties = {
  id: {
    type: 'string',
    format: 'uuid',
    example: '0d9a5a3b-1d2f-4cb6-9f92-4f19298d9640',
  },
  name: {
    type: 'string',
    example: 'Administradores',
  },
  code: {
    type: 'string',
    example: 'ADM-GLOBAL',
  },
  features: {
    type: 'array',
    description: 'Funcionalidades padrão entregues por este grupo',
    items: { type: 'string', enum: FEATURE_KEYS },
    example: ['GESTAO-USUARIOS', 'FINANCEIRO'],
  },
  createdBy: userProperties.createdBy,
  updatedBy: userProperties.updatedBy,
  createdAt: userProperties.createdAt,
  updatedAt: userProperties.updatedAt,
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
    { name: 'UserGroups', description: 'Catálogo de grupos e funcionalidades' },
    { name: 'Features', description: 'Lista estática de funcionalidades suportadas' },
  ],
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: userProperties,
      },
      CreateUserInput: {
        type: 'object',
        required: ['fullName', 'login', 'email', 'groupIds', 'createdBy'],
        properties: {
          fullName: userProperties.fullName,
          login: userProperties.login,
          email: userProperties.email,
          groupIds: userProperties.groupIds,
          allowFeatures: userProperties.allowFeatures,
          deniedFeatures: userProperties.deniedFeatures,
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
          groupIds: { ...userProperties.groupIds, nullable: true },
          allowFeatures: { ...userProperties.allowFeatures, nullable: true },
          deniedFeatures: { ...userProperties.deniedFeatures, nullable: true },
          updatedBy: userProperties.updatedBy,
        },
      },
      UserGroup: {
        type: 'object',
        properties: userGroupProperties,
      },
      CreateUserGroupInput: {
        type: 'object',
        required: ['name', 'code', 'createdBy'],
        properties: {
          name: userGroupProperties.name,
          code: userGroupProperties.code,
          features: userGroupProperties.features,
          createdBy: userGroupProperties.createdBy,
        },
      },
      UpdateUserGroupInput: {
        type: 'object',
        required: ['updatedBy'],
        properties: {
          name: { ...userGroupProperties.name, nullable: true },
          code: { ...userGroupProperties.code, nullable: true },
          features: { ...userGroupProperties.features, nullable: true },
          updatedBy: userGroupProperties.updatedBy,
        },
      },
      SetPasswordInput: {
        type: 'object',
        required: ['token', 'password', 'confirmPassword'],
        properties: {
          token: { type: 'string', example: 'jwt.token.aqui' },
          password: { type: 'string', minLength: 8, example: 'NovaSenhaSegura@123' },
          confirmPassword: { type: 'string', minLength: 8, example: 'NovaSenhaSegura@123' },
        },
      },
      Feature: {
        type: 'object',
        properties: {
          key: { type: 'string', enum: FEATURE_KEYS, example: FEATURE_KEYS[0] },
          name: { type: 'string', example: FEATURE_CATALOG[0]?.name ?? 'Dashboard Executivo' },
          description: {
            type: 'string',
            example:
              FEATURE_CATALOG[0]?.description ??
              'Visualização consolidada de KPIs e status em tempo real.',
          },
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
    '/features': {
      get: {
        tags: ['Features'],
        summary: 'Lista o catálogo estático de funcionalidades suportadas',
        responses: {
          200: {
            description: 'Catálogo disponível para vinculação em usuários e grupos',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Feature' },
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
            name: 'groupId',
            schema: { type: 'string', format: 'uuid' },
            description: 'Filtra usuários vinculados a um grupo específico (UUID)',
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
    '/groups': {
      get: {
        tags: ['UserGroups'],
        summary: 'Lista grupos de usuários',
        parameters: [
          {
            in: 'query',
            name: 'search',
            schema: { type: 'string' },
            description: 'Busca por nome ou código',
          },
          {
            in: 'query',
            name: 'feature',
            schema: { type: 'string' },
            description: 'Filtra grupos que contem a funcionalidade informada',
          },
        ],
        responses: {
          200: {
            description: 'Lista de grupos',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/UserGroup' },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['UserGroups'],
        summary: 'Cria um novo grupo de usuários',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateUserGroupInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'Grupo criado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserGroup' },
              },
            },
          },
          409: {
            description: 'Código duplicado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/groups/{id}': {
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'string', format: 'uuid' },
        },
      ],
      get: {
        tags: ['UserGroups'],
        summary: 'Busca detalhes de um grupo',
        responses: {
          200: {
            description: 'Grupo encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserGroup' },
              },
            },
          },
          404: {
            description: 'Grupo não encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      put: {
        tags: ['UserGroups'],
        summary: 'Atualiza um grupo existente',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateUserGroupInput' },
            },
          },
        },
        responses: {
          200: {
            description: 'Grupo atualizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserGroup' },
              },
            },
          },
          404: {
            description: 'Grupo não encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['UserGroups'],
        summary: 'Remove um grupo',
        responses: {
          204: { description: 'Grupo removido' },
          404: {
            description: 'Grupo não encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/users/password/reset': {
      post: {
        tags: ['Users'],
        summary: 'Define ou redefine a senha de um usuário a partir do token enviado por e-mail',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SetPasswordInput' },
            },
          },
        },
        responses: {
          204: { description: 'Senha atualizada' },
          401: {
            description: 'Token inválido ou expirado',
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

