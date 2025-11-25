## API de Usuários

API REST construída com Express + TypeScript aplicada ao domínio de usuários e grupos do `app-erp`. O projeto aplica princípios SOLID, padrão MVC e separação clara de camadas (Config → Core → Módulos → Infra).

### Stack Principal
- Node.js 20+
- TypeScript 5
- Express 5
- Zod para validações
- Helmet + CORS para hardening básico

### Scripts
- `npm run dev` — executa a API com reload automático
- `npm run build` — compila para `dist`
- `npm start` — sobe a versão compilada
- `npm run lint` — valida tipos com `tsc --noEmit`

> **Observação**: o versionamento de banco de dados é tratado pelo serviço dedicado `db-migrations` (ver pasta irmã no workspace). Mantemos as APIs desacopladas para que múltiplos serviços compartilhem o mesmo histórico de versões.

### Estrutura de Pastas
```
src
├── app.ts                 # Configuração do servidor Express
├── config/env.ts          # Carrega variáveis de ambiente
├── core                   # Cross-cutting (erros, middlewares)
├── modules
│   ├── features           # Catálogo estático de funcionalidades + rota pública
│   ├── userGroups         # CRUD de grupos + catálogo de features
│   └── users              # Módulo de domínio dos usuários
│       ├── dto            # Contratos de entrada (DTOs)
│       ├── entities       # Entidade rica + regras de negócio
│       ├── repositories   # Porta (interface) + adaptação in-memory
│       ├── useCases       # Casos de uso (aplicação)
│       ├── controllers    # Camada MVC (interface HTTP)
│       └── routes         # Rotas específicas do módulo
└── routes/index.ts        # Agregador das rotas públicas
```

### Fluxo de Vida da Arquitetura
1. **Entrada HTTP (Controller/MVC)**  
   A requisição chega via `src/routes`. Cada rota delega para `UserController`, responsável por tratar o protocolo (status, headers) e acionar o caso de uso adequado.
2. **Validação (Core + DTO + Zod)**  
   O controller valida o payload com os schemas Zod (`createUserSchema` / `updateUserSchema`). Erros de validação geram `AppError` com status 422 antes de qualquer regra de negócio.
3. **Casos de Uso (SOLID - Single Responsibility)**  
   Cada classe em `useCases` executa um cenário único (`CreateUserUseCase`, `ListUsersUseCase`, etc.), aplicando regras como unicidade de login/e-mail ou filtros de busca.
4. **Entidade de Domínio (SOLID - Encapsulation)**  
   `User` centraliza a criação/atualização de usuários (timestamps, defaults, consistência de arrays) via métodos `create`, `restore` e `update`.
5. **Repositório (SOLID - Dependency Inversion)**  
   Os use cases dependem apenas de `IUserRepository`. O projeto fornece `InMemoryUserRepository`, mas pode receber outra implementação (ex.: PostgreSQL) sem alterar regras de negócio.
6. **Resposta + Middlewares Globais**  
   `requestLogger` registra o ciclo, `notFound` trata rotas inexistentes e `errorHandler` transforma exceções (incluindo `AppError`) em respostas JSON consistentes.

### Campos do CRUD de Usuários
| Campo            | Tipo        | Descrição |
|------------------|-------------|-----------|
| `fullName`       | string      | Nome completo |
| `login`          | string      | Login único |
| `email`          | string      | E-mail corporativo |
| `groupIds`       | string[]    | Lista de UUIDs de grupos vinculados |
| `features`       | string[]    | Funcionalidades extras específicas do usuário |
| `allowFeatures`  | string[]    | Funcionalidades permitidas explicitamente (chaves do catálogo) |
| `deniedFeatures`  | string[]    | Funcionalidades negadas explicitamente (chaves do catálogo) |
| `createdBy`      | string      | E-mail de quem criou |
| `updatedBy`      | string      | E-mail de quem fez a última alteração |
| `createdAt`      | ISO string  | Gerado automaticamente |
| `updatedAt`      | ISO string  | Gerado automaticamente |

### Campos do CRUD de Grupos de Usuários
| Campo        | Tipo        | Descrição |
|--------------|-------------|-----------|
| `name`       | string      | Nome exibido do grupo |
| `code`       | string      | Código único (sempre MAIÚSCULO com hífens) |
| `features`   | string[]    | Funcionalidades padrão entregues pelo grupo |
| `createdBy`  | string      | Quem criou |
| `updatedBy`  | string      | Quem atualizou por último |
| `createdAt`  | ISO string  | Gerado automaticamente |
| `updatedAt`  | ISO string  | Gerado automaticamente |

### Catálogo de Funcionalidades
- Fonte única: `src/modules/features/features.json`.
- Cada item possui `key` (sempre MAIÚSCULA com hífens), `name` e `description`.
- Os schemas Zod convertem entradas para o formato correto e validam contra este catálogo.
- Endpoint público `GET /api/features` devolve o JSON para que o front-end possa montar selects.

### Rotas Disponíveis (`/api`)
| Método | Rota            | Descrição |
|--------|-----------------|-----------|
| GET    | `/health`       | Status da API |
| GET    | `/users`        | Lista usuários (filtros `search`, `groupId`, `feature`) |
| GET    | `/users/:id`    | Detalha um usuário |
| POST   | `/users`        | Cria usuário |
| PUT    | `/users/:id`    | Atualiza usuário |
| DELETE | `/users/:id`    | Remove usuário |
| GET    | `/groups`       | Lista grupos com filtros `search` e `feature` |
| GET    | `/groups/:id`   | Detalha um grupo |
| POST   | `/groups`       | Cria grupo (gera UUID + valida código) |
| PUT    | `/groups/:id`   | Atualiza grupo |
| DELETE | `/groups/:id`   | Remove grupo |
| GET    | `/features`     | Lista o catálogo estático de funcionalidades |

### Como Executar
```bash
cp .env.example .env   # Ajuste PORT se necessário
npm install
npm run dev
```

API disponível em `http://localhost:3333/api`.

### Documentação Swagger
- Acesse `http://localhost:3333/docs` após subir o servidor (`npm run dev`).
- Endpoint base configurado como `http://localhost:3333/api`.
- Inclui operações de health, CRUD completo de usuários, CRUD de grupos e catálogo de funcionalidades, com exemplos de payloads para cada recurso.
