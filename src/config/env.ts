import { config } from 'dotenv'

config()

// Log das variáveis de ambiente do banco (sem mostrar a senha completa)
console.log('[Env Config] Variáveis de ambiente do banco:', {
  DB_HOST: process.env.DB_HOST || 'NÃO DEFINIDO',
  DB_PORT: process.env.DB_PORT || 'NÃO DEFINIDO',
  DB_NAME: process.env.DB_NAME || 'NÃO DEFINIDO',
  DB_USER: process.env.DB_USER || 'NÃO DEFINIDO',
  DB_PASS: process.env.DB_PASS ? `***${process.env.DB_PASS.slice(-3)}` : 'NÃO DEFINIDO',
  NODE_ENV: process.env.NODE_ENV,
})

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  app: {
    port: Number(process.env.PORT ?? 3333),
    webUrl: process.env.APP_WEB_URL ?? 'http://localhost:5173',
    passwordResetPath: process.env.PASSWORD_RESET_PATH ?? '/account/set-password',
  },
  database: {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    name: process.env.DB_NAME ?? 'marshall',
    user: process.env.DB_USER ?? 'developer',
    password: process.env.DB_PASS ?? '',
  },
  security: {
    jwtSecret: process.env.JWT_SECRET ?? 'default-jwt-secret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '2h',
    cryptoSecret: process.env.CRYPTO_SECRET ?? 'default-crypto-secret',
  },
  apiComunicacoes: {
    url: process.env.API_COMUNICACOES_URL ?? 'http://localhost:3334/api',
  },
}

