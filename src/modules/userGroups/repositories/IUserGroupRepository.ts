import type { UserGroup, UserGroupProps } from '../entities/UserGroup'

export interface IUserGroupRepository {
  findAll(): Promise<UserGroupProps[]>
  findById(id: string): Promise<UserGroupProps | null>
  findByCode(code: string): Promise<UserGroupProps | null>
  findManyByIds(ids: string[]): Promise<UserGroupProps[]>
  create(group: UserGroup): Promise<UserGroupProps>
  update(group: UserGroup): Promise<UserGroupProps>
  delete(id: string): Promise<void>
}


