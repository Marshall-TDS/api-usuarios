import type { Request, Response, NextFunction } from 'express'
import { AppError } from '../errors/AppError'

/**
 * Middleware de autorização
 * Verifica se o usuário autenticado tem a permissão necessária
 */
export const authorize = (...requiredPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'Usuário não autenticado' })
    }

    const userPermissions = req.user.permissions || []

    // Verificar se o usuário tem todas as permissões necessárias
    const hasAllPermissions = requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    )

    if (!hasAllPermissions) {
      return res.status(403).json({
        status: 'error',
        message: 'Permissão insuficiente',
        required: requiredPermissions,
        userPermissions,
      })
    }

    next()
  }
}

/**
 * Middleware de autorização alternativa
 * Verifica se o usuário tem pelo menos uma das permissões necessárias
 */
export const authorizeAny = (...requiredPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'Usuário não autenticado' })
    }

    const userPermissions = req.user.permissions || []

    // Verificar se o usuário tem pelo menos uma das permissões necessárias
    const hasAnyPermission = requiredPermissions.some((permission) =>
      userPermissions.includes(permission),
    )

    if (!hasAnyPermission) {
      return res.status(403).json({
        status: 'error',
        message: 'Permissão insuficiente',
        required: requiredPermissions,
        userPermissions,
      })
    }

    next()
  }
}

