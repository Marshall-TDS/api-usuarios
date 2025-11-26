import type { AccessGroup, AccessGroupProps } from '../entities/AccessGroup'
import type { IAccessGroupRepository } from './IAccessGroupRepository'

export class InMemoryAccessGroupRepository implements IAccessGroupRepository {
  private readonly groups = new Map<string, AccessGroupProps>()

  async findAll(): Promise<AccessGroupProps[]> {
    return Array.from(this.groups.values())
  }

  async findById(id: string): Promise<AccessGroupProps | null> {
    return this.groups.get(id) ?? null
  }

  async findByCode(code: string): Promise<AccessGroupProps | null> {
    const found = Array.from(this.groups.values()).find(
      (group) => group.code.toUpperCase() === code.toUpperCase(),
    )
    return found ?? null
  }

  async findManyByIds(ids: string[]): Promise<AccessGroupProps[]> {
    const unique = Array.from(new Set(ids))
    return unique
      .map((id) => this.groups.get(id))
      .filter((group): group is AccessGroupProps => Boolean(group))
  }

  async create(group: AccessGroup): Promise<AccessGroupProps> {
    const data = group.toJSON()
    this.groups.set(data.id, data)
    return data
  }

  async update(group: AccessGroup): Promise<AccessGroupProps> {
    const data = group.toJSON()
    this.groups.set(data.id, data)
    return data
  }

  async delete(id: string): Promise<void> {
    this.groups.delete(id)
  }
}


