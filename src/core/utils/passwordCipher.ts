import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto'
import { env } from '../../config/env'

const ALGORITHM = 'aes-256-ctr'
const IV_LENGTH = 16

const getKey = () =>
  createHash('sha256').update(env.security.cryptoSecret).digest().subarray(0, 32)

export const encryptPassword = (plainText: string) => {
  const iv = randomBytes(IV_LENGTH)
  const cipher = createCipheriv(ALGORITHM, getKey(), iv)
  const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()])
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`
}

export const decryptPassword = (hash: string) => {
  const [ivHex, encryptedHex] = hash.split(':')
  if (!ivHex || !encryptedHex) {
    throw new Error('Invalid encrypted password format')
  }
  const iv = Buffer.from(ivHex, 'hex')
  const encryptedText = Buffer.from(encryptedHex, 'hex')
  const decipher = createDecipheriv(ALGORITHM, getKey(), iv)
  const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()])
  return decrypted.toString('utf8')
}

