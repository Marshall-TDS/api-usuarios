import type { IParameterizationRepository } from '../../repositories/IParameterizationRepository'

export interface ListParameterizationsFilters {
  search?: string | undefined
  scopeType?: string | undefined
}

export class ListParameterizationsUseCase {
  constructor(private readonly repository: IParameterizationRepository) { }

  async execute(filters: ListParameterizationsFilters = {}) {
    const parameterizations = await this.repository.findAll()
    const { search, scopeType } = filters
    const normalizedSearch = search?.toLowerCase()

    return parameterizations.filter((param) => {
      const matchesSearch = normalizedSearch
        ? [param.friendlyName, param.technicalKey, param.value].some((value) =>
          value.toLowerCase().includes(normalizedSearch),
        )
        : true

      const matchesScopeType = scopeType ? param.scopeType === scopeType : true

      return matchesSearch && matchesScopeType
    })
  }
}

