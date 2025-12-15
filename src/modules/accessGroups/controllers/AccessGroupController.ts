import type { NextFunction, Request, Response } from 'express'
import { AppError } from '../../../core/errors/AppError'
import { accessGroupRepository } from '../repositories'
import { CreateAccessGroupUseCase } from '../useCases/createAccessGroup/CreateAccessGroupUseCase'
import { DeleteAccessGroupUseCase } from '../useCases/deleteAccessGroup/DeleteAccessGroupUseCase'
import { GetAccessGroupUseCase } from '../useCases/getAccessGroup/GetAccessGroupUseCase'
import { ListAccessGroupsUseCase } from '../useCases/listAccessGroups/ListAccessGroupsUseCase'
import { UpdateAccessGroupUseCase } from '../useCases/updateAccessGroup/UpdateAccessGroupUseCase'
import {
  createAccessGroupSchema,
  updateAccessGroupSchema,
} from '../validators/accessGroup.schema'

export class AccessGroupController {
  constructor(
    private readonly listGroups: ListAccessGroupsUseCase,
    private readonly getGroup: GetAccessGroupUseCase,
    private readonly createGroup: CreateAccessGroupUseCase,
    private readonly updateGroup: UpdateAccessGroupUseCase,
    private readonly deleteGroup: DeleteAccessGroupUseCase,
  ) { }

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
      const parseResult = createAccessGroupSchema.safeParse(req.body)
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

      // Log detalhado do payload recebido para depuração de features inválidas
      // ATENÇÃO: manter este log apenas em ambiente de desenvolvimento
      console.log('[ACCESS_GROUP_UPDATE] Payload recebido:', {
        id,
        name: req.body?.name,
        code: req.body?.code,
        features: Array.isArray(req.body?.features) ? req.body.features : req.body?.features,
        updatedBy: req.body?.updatedBy,
      })

      const parseResult = updateAccessGroupSchema.safeParse(req.body)
      if (!parseResult.success) {
        // Quando houver erro de validação em features, logar o detalhe bruto
        const flat = parseResult.error.flatten()
        if (flat.fieldErrors?.features) {
          console.error('[ACCESS_GROUP_UPDATE] Erro de validação em features:', {
            rawFeatures: req.body?.features,
            fieldErrors: flat.fieldErrors.features,
          })
        }
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

export const accessGroupController = new AccessGroupController(
  new ListAccessGroupsUseCase(accessGroupRepository),
  new GetAccessGroupUseCase(accessGroupRepository),
  new CreateAccessGroupUseCase(accessGroupRepository),
  new UpdateAccessGroupUseCase(accessGroupRepository),
  new DeleteAccessGroupUseCase(accessGroupRepository),
)


