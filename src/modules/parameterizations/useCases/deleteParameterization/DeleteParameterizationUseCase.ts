import { AppError } from '../../../../core/errors/AppError'
import type { IParameterizationRepository } from '../../repositories/IParameterizationRepository'

export class DeleteParameterizationUseCase {
  constructor(private readonly repository: IParameterizationRepository) { }

  async execute(id: string) {
    const existing = await this.repository.findById(id)

    if (!existing) {
      throw new AppError('Parametrização não encontrada', 404)
    }

    await this.repository.delete(id)
  }
}

