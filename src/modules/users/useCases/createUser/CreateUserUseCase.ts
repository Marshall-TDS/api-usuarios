import { AppError } from '../../../../core/errors/AppError'
import type { CreateUserDTO } from '../../dto/CreateUserDTO'
import { User } from '../../entities/User'
import type { IUserRepository } from '../../repositories/IUserRepository'
import type { IUserGroupRepository } from '../../../userGroups/repositories/IUserGroupRepository'
import { PasswordSetupService } from '../../services/PasswordSetupService'

export class CreateUserUseCase {
  constructor(
    private readonly usersRepository: IUserRepository,
    private readonly userGroupsRepository: IUserGroupRepository,
    private readonly passwordSetup: PasswordSetupService,
  ) {}

  async execute(payload: CreateUserDTO) {
    const [loginExists, emailExists, validGroups] = await Promise.all([
      this.usersRepository.findByLogin(payload.login),
      this.usersRepository.findByEmail(payload.email),
      this.userGroupsRepository.findManyByIds(payload.groupIds),
    ])

    if (loginExists) {
      throw new AppError('Login já está em uso', 409)
    }

    if (emailExists) {
      throw new AppError('E-mail já está em uso', 409)
    }

    if (validGroups.length !== new Set(payload.groupIds).size) {
      throw new AppError('Um ou mais grupos não foram encontrados', 404)
    }

    const user = User.create({
      ...payload,
      groupIds: payload.groupIds,
      allowFeatures: payload.allowFeatures ?? [],
      deniedFeatures: payload.deniedFeatures ?? [],
      updatedBy: payload.createdBy,
    })

    const createdUser = await this.usersRepository.create(user)
    await this.passwordSetup.send(createdUser)
    return createdUser
  }
}

