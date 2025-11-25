import { formatFeatureKey } from '../../../features/catalog'
import type { IUserGroupRepository } from '../../repositories/IUserGroupRepository'

export interface ListUserGroupsFilters {
  search?: string | undefined
  feature?: string | undefined
}

export class ListUserGroupsUseCase {
  constructor(private readonly repository: IUserGroupRepository) {}

  async execute(filters: ListUserGroupsFilters = {}) {
    const groups = await this.repository.findAll()
    const { search, feature } = filters
    const normalizedSearch = search?.toLowerCase()
    const normalizedFeature =
      typeof feature === 'string' ? formatFeatureKey(feature) : undefined

    return groups.filter((group) => {
      const matchesSearch = normalizedSearch
        ? [group.name, group.code].some((value) => value.toLowerCase().includes(normalizedSearch))
        : true

      const matchesFeature = normalizedFeature ? group.features.includes(normalizedFeature) : true

      return matchesSearch && matchesFeature
    })
  }
}


