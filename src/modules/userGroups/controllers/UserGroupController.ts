import type { NextFunction, Request, Response } from 'express'
import { AppError } from '../../../core/errors/AppError'
import { userGroupRepository } from '../repositories'
import { CreateUserGroupUseCase } from '../useCases/createUserGroup/CreateUserGroupUseCase'
import { DeleteUserGroupUseCase } from '../useCases/deleteUserGroup/DeleteUserGroupUseCase'
import { GetUserGroupUseCase } from '../useCases/getUserGroup/GetUserGroupUseCase'
import { ListUserGroupsUseCase } from '../useCases/listUserGroups/ListUserGroupsUseCase'
import { UpdateUserGroupUseCase } from '../useCases/updateUserGroup/UpdateUserGroupUseCase'
import {
  createUserGroupSchema,
  updateUserGroupSchema,
} from '../validators/userGroup.schema'

export class UserGroupController {
  constructor(
    private readonly listGroups: ListUserGroupsUseCase,
    private readonly getGroup: GetUserGroupUseCase,
    private readonly createGroup: CreateUserGroupUseCase,
    private readonly updateGroup: UpdateUserGroupUseCase,
    private readonly deleteGroup: DeleteUserGroupUseCase,
  ) {}

  index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search, feature } = req.query
      const groups = await this.listGroups.execute({
        search: typeof search === 'string' ? search : undefined,
        feature: typeof feature === 'string' ? feature : undefined,
      })

      return res.json(groups)
    } catch (error) {
      return next(error)
    }
  }

  show = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      if (!id) {
        throw new AppError('Parâmetro id é obrigatório', 400)
      }

      const group = await this.getGroup.execute(id)
      return res.json(group)
    } catch (error) {
      return next(error)
    }
  }

  store = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parseResult = createUserGroupSchema.safeParse(req.body)
      if (!parseResult.success) {
        throw new AppError('Falha de validação', 422, parseResult.error.flatten())
      }

      const group = await this.createGroup.execute(parseResult.data)
      return res.status(201).json(group)
    } catch (error) {
      return next(error)
    }
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      if (!id) {
        throw new AppError('Parâmetro id é obrigatório', 400)
      }

      const parseResult = updateUserGroupSchema.safeParse(req.body)
      if (!parseResult.success) {
        throw new AppError('Falha de validação', 422, parseResult.error.flatten())
      }

      const group = await this.updateGroup.execute(id, parseResult.data)
      return res.json(group)
    } catch (error) {
      return next(error)
    }
  }

  destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      if (!id) {
        throw new AppError('Parâmetro id é obrigatório', 400)
      }

      await this.deleteGroup.execute(id)
      return res.status(204).send()
    } catch (error) {
      return next(error)
    }
  }
}

export const userGroupController = new UserGroupController(
  new ListUserGroupsUseCase(userGroupRepository),
  new GetUserGroupUseCase(userGroupRepository),
  new CreateUserGroupUseCase(userGroupRepository),
  new UpdateUserGroupUseCase(userGroupRepository),
  new DeleteUserGroupUseCase(userGroupRepository),
)


