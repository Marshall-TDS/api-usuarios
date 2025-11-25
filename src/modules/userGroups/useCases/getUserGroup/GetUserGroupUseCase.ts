import { AppError } from '../../../../core/errors/AppError'
import type { IUserGroupRepository } from '../../repositories/IUserGroupRepository'

export class GetUserGroupUseCase {
  constructor(private readonly repository: IUserGroupRepository) {}

  async execute(id: string) {
    const group = await this.repository.findById(id)

    if (!group) {
      throw new AppError('Grupo não encontrado', 404)
    }

    return group
  }
}


