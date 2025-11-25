import type { NextFunction, Request, Response } from 'express'
import { AppError } from '../../../core/errors/AppError'
import { SetPasswordUseCase } from '../useCases/setPassword/SetPasswordUseCase'
import { userRepository } from '../repositories'
import { setPasswordSchema } from '../validators/setPassword.schema'

export class UserPasswordController {
  constructor(private readonly setPassword: SetPasswordUseCase) {}

  store = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parseResult = setPasswordSchema.safeParse(req.body)
      if (!parseResult.success) {
        throw new AppError('Falha de validação', 422, parseResult.error.flatten())
      }

      await this.setPassword.execute(parseResult.data.token, parseResult.data.password)
      return res.status(204).send()
    } catch (error) {
      return next(error)
    }
  }
}

export const userPasswordController = new UserPasswordController(
  new SetPasswordUseCase(userRepository),
)

