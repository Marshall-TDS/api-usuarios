import { AppError } from '../../../../core/errors/AppError'
import type { IParameterizationRepository } from '../../repositories/IParameterizationRepository'

export class GetParameterizationUseCase {
  constructor(private readonly repository: IParameterizationRepository) { }

  async execute(id: string) {
    const parameterization = await this.repository.findById(id)

    if (!parameterization) {
      throw new AppError('Parametrização não encontrada', 404)
    }

    return parameterization
  }
}

