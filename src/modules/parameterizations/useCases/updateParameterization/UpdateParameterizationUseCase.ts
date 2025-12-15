import { AppError } from '../../../../core/errors/AppError'
import type { UpdateParameterizationDTO } from '../../dto/UpdateParameterizationDTO'
import { Parameterization } from '../../entities/Parameterization'
import type { IParameterizationRepository } from '../../repositories/IParameterizationRepository'

export class UpdateParameterizationUseCase {
  constructor(private readonly repository: IParameterizationRepository) { }

  async execute(id: string, payload: UpdateParameterizationDTO) {
    const existing = await this.repository.findById(id)

    if (!existing) {
      throw new AppError('Parametrização não encontrada', 404)
    }

    // Se está atualizando technical_key, verificar se não está em uso por outro registro
    if (payload.technicalKey) {
      const normalizedKey = payload.technicalKey.toUpperCase().replace(/\s/g, '_')
      const keyExists = await this.repository.findByTechnicalKey(normalizedKey)

      if (keyExists && keyExists.id !== id) {
        throw new AppError('Technical key já está em uso', 409)
      }

      payload.technicalKey = normalizedKey
    }

    const parameterization = Parameterization.restore(existing)
    parameterization.update(payload)

    return await this.repository.update(parameterization)
  }
}

