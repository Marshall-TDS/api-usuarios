import type { NextFunction, Request, Response } from 'express'
import { AppError } from '../../../core/errors/AppError'
import { parameterizationRepository } from '../repositories'
import { CreateParameterizationUseCase } from '../useCases/createParameterization/CreateParameterizationUseCase'
import { DeleteParameterizationUseCase } from '../useCases/deleteParameterization/DeleteParameterizationUseCase'
import { GetParameterizationUseCase } from '../useCases/getParameterization/GetParameterizationUseCase'
import { ListParameterizationsUseCase } from '../useCases/listParameterizations/ListParameterizationsUseCase'
import { UpdateParameterizationUseCase } from '../useCases/updateParameterization/UpdateParameterizationUseCase'
import {
  createParameterizationSchema,
  updateParameterizationSchema,
} from '../validators/parameterization.schema'

export class ParameterizationController {
  constructor(
    private readonly listParameterizations: ListParameterizationsUseCase,
    private readonly getParameterization: GetParameterizationUseCase,
    private readonly createParameterization: CreateParameterizationUseCase,
    private readonly updateParameterization: UpdateParameterizationUseCase,
    private readonly deleteParameterization: DeleteParameterizationUseCase,
  ) { }

  index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search, scopeType } = req.query
      const parameterizations = await this.listParameterizations.execute({
        search: typeof search === 'string' ? search : undefined,
        scopeType: typeof scopeType === 'string' ? scopeType : undefined,
      })

      return res.json(parameterizations)
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

      const parameterization = await this.getParameterization.execute(id)
      return res.json(parameterization)
    } catch (error) {
      return next(error)
    }
  }

  store = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parseResult = createParameterizationSchema.safeParse(req.body)
      if (!parseResult.success) {
        throw new AppError('Falha de validação', 422, parseResult.error.flatten())
      }

      const parameterization = await this.createParameterization.execute(parseResult.data)
      return res.status(201).json(parameterization)
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

      const parseResult = updateParameterizationSchema.safeParse(req.body)
      if (!parseResult.success) {
        throw new AppError('Falha de validação', 422, parseResult.error.flatten())
      }

      const parameterization = await this.updateParameterization.execute(id, parseResult.data)
      return res.json(parameterization)
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

      await this.deleteParameterization.execute(id)
      return res.status(204).send()
    } catch (error) {
      return next(error)
    }
  }
}

export const parameterizationController = new ParameterizationController(
  new ListParameterizationsUseCase(parameterizationRepository),
  new GetParameterizationUseCase(parameterizationRepository),
  new CreateParameterizationUseCase(parameterizationRepository),
  new UpdateParameterizationUseCase(parameterizationRepository),
  new DeleteParameterizationUseCase(parameterizationRepository),
)

