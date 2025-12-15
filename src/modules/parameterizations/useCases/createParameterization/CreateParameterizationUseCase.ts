import { AppError } from '../../../../core/errors/AppError'
import type { CreateParameterizationDTO } from '../../dto/CreateParameterizationDTO'
import { Parameterization } from '../../entities/Parameterization'
import type { IParameterizationRepository } from '../../repositories/IParameterizationRepository'

export class CreateParameterizationUseCase {
  constructor(private readonly repository: IParameterizationRepository) { }

  async execute(payload: CreateParameterizationDTO) {
    const normalizedKey = payload.technicalKey.toUpperCase().replace(/\s/g, '_')
    const existing = await this.repository.findByTechnicalKey(normalizedKey)

    if (existing) {
      throw new AppError('Technical key já está em uso', 409)
    }

    const parameterization = Parameterization.create({
      ...payload,
      technicalKey: normalizedKey,
      scopeTargetId: payload.scopeTargetId ?? [],
      updatedBy: payload.createdBy,
    })

    return await this.repository.create(parameterization)
  }
}

