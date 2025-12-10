import type { Request, Response } from 'express'
import { z } from 'zod'
import { LoginUseCase } from '../useCases/login/LoginUseCase'
import { LogoutUseCase } from '../useCases/logout/LogoutUseCase'
import { RefreshTokenUseCase } from '../useCases/refreshToken/RefreshTokenUseCase'
import { loginSchema, logoutSchema, refreshTokenSchema } from '../validators/auth.schema'
import { AppError } from '../../../core/errors/AppError'

export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
  ) { }

  login = async (req: Request, res: Response) => {
    try {
      const validated = loginSchema.parse(req.body)
      const result = await this.loginUseCase.execute(validated)
      return res.status(200).json(result)
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ status: 'error', message: error.message })
      }
      if (error instanceof z.ZodError) {
        return res.status(400).json({ status: 'error', message: 'Dados inválidos', errors: error.issues })
      }
      return res.status(500).json({ status: 'error', message: 'Erro interno do servidor' })
    }
  }

  logout = async (req: Request, res: Response) => {
    try {
      const validated = logoutSchema.parse(req.body)
      await this.logoutUseCase.execute(validated.refreshToken)
      return res.status(200).json({ status: 'success', message: 'Logout realizado com sucesso' })
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ status: 'error', message: error.message })
      }
      if (error instanceof z.ZodError) {
        return res.status(400).json({ status: 'error', message: 'Dados inválidos', errors: error.issues })
      }
      return res.status(500).json({ status: 'error', message: 'Erro interno do servidor' })
    }
  }

  refreshToken = async (req: Request, res: Response) => {
    try {
      const validated = refreshTokenSchema.parse(req.body)
      const result = await this.refreshTokenUseCase.execute(validated.refreshToken)
      return res.status(200).json(result)
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ status: 'error', message: error.message })
      }
      if (error instanceof z.ZodError) {
        return res.status(400).json({ status: 'error', message: 'Dados inválidos', errors: error.issues })
      }
      return res.status(500).json({ status: 'error', message: 'Erro interno do servidor' })
    }
  }
}

