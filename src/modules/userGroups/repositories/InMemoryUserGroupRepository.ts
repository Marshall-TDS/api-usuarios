import type { UserGroup, UserGroupProps } from '../entities/UserGroup'
import type { IUserGroupRepository } from './IUserGroupRepository'

export class InMemoryUserGroupRepository implements IUserGroupRepository {
  private readonly groups = new Map<string, UserGroupProps>()

  async findAll(): Promise<UserGroupProps[]> {
    return Array.from(this.groups.values())
  }

  async findById(id: string): Promise<UserGroupProps | null> {
    return this.groups.get(id) ?? null
  }

  async findByCode(code: string): Promise<UserGroupProps | null> {
    const found = Array.from(this.groups.values()).find(
      (group) => group.code.toUpperCase() === code.toUpperCase(),
    )
    return found ?? null
  }

  async findManyByIds(ids: string[]): Promise<UserGroupProps[]> {
    const unique = Array.from(new Set(ids))
    return unique
      .map((id) => this.groups.get(id))
      .filter((group): group is UserGroupProps => Boolean(group))
  }

  async create(group: UserGroup): Promise<UserGroupProps> {
    const data = group.toJSON()
    this.groups.set(data.id, data)
    return data
  }

  async update(group: UserGroup): Promise<UserGroupProps> {
    const data = group.toJSON()
    this.groups.set(data.id, data)
    return data
  }

  async delete(id: string): Promise<void> {
    this.groups.delete(id)
  }
}


