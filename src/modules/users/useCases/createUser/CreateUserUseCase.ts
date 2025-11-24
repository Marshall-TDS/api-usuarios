import { AppError } from '../../../../core/errors/AppError'
import type { CreateUserDTO } from '../../dto/CreateUserDTO'
import { User } from '../../entities/User'
import type { IUserRepository } from '../../repositories/IUserRepository'

export class CreateUserUseCase {
  constructor(private readonly usersRepository: IUserRepository) {}

  async execute(payload: CreateUserDTO) {
    const [loginExists, emailExists] = await Promise.all([
      this.usersRepository.findByLogin(payload.login),
      this.usersRepository.findByEmail(payload.email),
    ])

    if (loginExists) {
      throw new AppError('Login já está em uso', 409)
    }

    if (emailExists) {
      throw new AppError('E-mail já está em uso', 409)
    }

    const user = User.create({
      ...payload,
      features: payload.features ?? [],
      updatedBy: payload.createdBy,
    })

    return this.usersRepository.create(user)
  }
}

