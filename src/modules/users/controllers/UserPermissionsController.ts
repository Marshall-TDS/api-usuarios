import type { NextFunction, Request, Response } from 'express'
import { AppError } from '../../../core/errors/AppError'
import { accessGroupRepository } from '../../accessGroups/repositories'
import { userRepository } from '../repositories'
import { GetUserPermissionsUseCase } from '../useCases/getUserPermissions/GetUserPermissionsUseCase'

export class UserPermissionsController {
    constructor(private readonly getUserPermissions: GetUserPermissionsUseCase) { }

    show = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params

            if (!id) {
                throw new AppError('Parâmetro id é obrigatório', 400)
            }

            const permissions = await this.getUserPermissions.execute(id)
            return res.json(permissions)
        } catch (error) {
            return next(error)
        }
    }
}

export const userPermissionsController = new UserPermissionsController(
    new GetUserPermissionsUseCase(userRepository, accessGroupRepository),
)
