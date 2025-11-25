import { AppError } from '../../../../core/errors/AppError'
import { formatGroupCode } from '../../../../core/utils/formatGroupCode'
import type { CreateUserGroupDTO } from '../../dto/CreateUserGroupDTO'
import { UserGroup } from '../../entities/UserGroup'
import type { IUserGroupRepository } from '../../repositories/IUserGroupRepository'

export class CreateUserGroupUseCase {
  constructor(private readonly repository: IUserGroupRepository) {}

  async execute(payload: CreateUserGroupDTO) {
    const normalizedCode = formatGroupCode(payload.code)
    const codeTaken = await this.repository.findByCode(normalizedCode)

    if (codeTaken) {
      throw new AppError('Código do grupo já está em uso', 409)
    }

    const group = UserGroup.create({
      ...payload,
      code: normalizedCode,
      features: payload.features ?? [],
      updatedBy: payload.createdBy,
    })

    return this.repository.create(group)
  }
}


