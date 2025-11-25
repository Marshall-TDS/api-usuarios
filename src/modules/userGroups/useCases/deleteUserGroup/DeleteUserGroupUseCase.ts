import { AppError } from '../../../../core/errors/AppError'
import type { IUserGroupRepository } from '../../repositories/IUserGroupRepository'

export class DeleteUserGroupUseCase {
  constructor(private readonly repository: IUserGroupRepository) {}

  async execute(id: string) {
    const existing = await this.repository.findById(id)

    if (!existing) {
      throw new AppError('Grupo não encontrado', 404)
    }

    await this.repository.delete(id)
  }
}


