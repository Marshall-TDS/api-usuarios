# Dockerfile para API de Usuários
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY tsconfig.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY src ./src

# Compilar TypeScript
RUN npm run build

# Stage de produção
FROM node:20-alpine

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar apenas dependências de produção
RUN npm ci --only=production && npm cache clean --force

# Copiar código compilado do builder
COPY --from=builder /app/dist ./dist

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Mudar propriedade dos arquivos
RUN chown -R nodejs:nodejs /app

USER nodejs

# Expor porta (será sobrescrita pelo docker-compose)
EXPOSE 3333

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:${PORT:-3333}/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

# Comando para iniciar a aplicação
CMD ["node", "dist/server.js"]

