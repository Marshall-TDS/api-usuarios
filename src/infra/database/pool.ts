import { Pool } from 'pg'
import { env } from '../../config/env'

console.log('[DB Pool] Configurando pool de conexões:', {
  host: env.database.host,
  port: env.database.port,
  database: env.database.name,
  user: env.database.user,
  hasPassword: !!env.database.password,
  passwordLength: env.database.password?.length ?? 0,
})

export const pool = new Pool({
  host: env.database.host,
  port: env.database.port,
  database: env.database.name,
  user: env.database.user,
  password: env.database.password,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

pool.on('error', (error) => {
  console.error('[DB] Unexpected error on idle client', error)
})

pool.on('connect', () => {
  console.log('[DB Pool] Nova conexão estabelecida')
})

pool.on('acquire', () => {
  console.log('[DB Pool] Cliente adquirido do pool')
})

