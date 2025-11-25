import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken'
import { env } from '../../config/env'

type TokenPayload = JwtPayload & {
  type: 'password_setup'
  login: string
}

export const generatePasswordToken = (userId: string, login: string) => {
  const payload: TokenPayload = {
    type: 'password_setup',
    login,
  }

  const options = {
    subject: userId,
    expiresIn: env.security.jwtExpiresIn,
  } as SignOptions

  return jwt.sign(payload, env.security.jwtSecret, options)
}

export const verifyPasswordToken = (token: string) => {
  const payload = jwt.verify(token, env.security.jwtSecret) as TokenPayload
  if (payload.type !== 'password_setup') {
    throw new Error('Invalid token type')
  }
  if (!payload.sub) {
    throw new Error('Invalid token payload')
  }
  return payload as TokenPayload & { sub: string }
}

