import { AppError } from '../../../../core/errors/AppError'
import { formatGroupCode } from '../../../../core/utils/formatGroupCode'
import type { UpdateUserGroupDTO } from '../../dto/UpdateUserGroupDTO'
import { UserGroup } from '../../entities/UserGroup'
import type { IUserGroupRepository } from '../../repositories/IUserGroupRepository'

export class UpdateUserGroupUseCase {
  constructor(private readonly repository: IUserGroupRepository) {}

  async execute(id: string, payload: UpdateUserGroupDTO) {
    const existing = await this.repository.findById(id)

    if (!existing) {
      throw new AppError('Grupo não encontrado', 404)
    }

    if (payload.code) {
      const normalizedCode = formatGroupCode(payload.code)
      if (normalizedCode !== existing.code) {
        const codeTaken = await this.repository.findByCode(normalizedCode)
        if (codeTaken) {
          throw new AppError('Código do grupo já está em uso', 409)
        }
      }
      payload.code = normalizedCode
    }

    const group = UserGroup.restore(existing)
    group.update(payload)

    return this.repository.update(group)
  }
}


