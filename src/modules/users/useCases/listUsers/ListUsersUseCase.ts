import type { IUserRepository } from '../../repositories/IUserRepository'

export interface ListUsersFilters {
  search?: string | undefined
  userGroup?: string | undefined
  feature?: string | undefined
}

export class ListUsersUseCase {
  constructor(private readonly usersRepository: IUserRepository) {}

  async execute(filters: ListUsersFilters = {}) {
    const users = await this.usersRepository.findAll()

    const { search, userGroup, feature } = filters
    const normalizedSearch = search?.toLowerCase()

    return users.filter((user) => {
      const matchesSearch = normalizedSearch
        ? [user.fullName, user.login, user.email].some((value) =>
            value.toLowerCase().includes(normalizedSearch),
          )
        : true

      const matchesGroup = userGroup ? user.userGroup.includes(userGroup) : true
      const matchesFeature = feature ? user.features.includes(feature) : true

      return matchesSearch && matchesGroup && matchesFeature
    })
  }
}

