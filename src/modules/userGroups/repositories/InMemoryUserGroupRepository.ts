import type { UserGroup, UserGroupProps } from '../entities/UserGroup'
import { UserGroup as UserGroupEntity } from '../entities/UserGroup'
import type { IUserGroupRepository } from './IUserGroupRepository'

const seedGroups: Omit<UserGroupProps, 'createdAt' | 'updatedAt'>[] = [
  {
    id: '0d9a5a3b-1d2f-4cb6-9f92-4f19298d9640',
    name: 'Administradores',
    code: 'ADM-GLOBAL',
    features: ['DASHBOARD', 'FINANCEIRO', 'GESTAO-USUARIOS'],
    createdBy: 'sistema@erp.com',
    updatedBy: 'sistema@erp.com',
  },
  {
    id: '3a6b29a5-2757-4a79-9a6c-0cacbc9afd42',
    name: 'Operações',
    code: 'OPERACOES-BASE',
    features: ['ESTOQUE', 'LOGISTICA'],
    createdBy: 'sistema@erp.com',
    updatedBy: 'sistema@erp.com',
  },
  {
    id: 'f5c5dd85-1565-4f6e-b2d3-3bb5942e8f9c',
    name: 'Financeiro',
    code: 'FINANCEIRO-BASE',
    features: ['FINANCEIRO', 'CREDITO'],
    createdBy: 'sistema@erp.com',
    updatedBy: 'sistema@erp.com',
  },
]

export class InMemoryUserGroupRepository implements IUserGroupRepository {
  private readonly groups = new Map<string, UserGroupProps>()

  constructor() {
    const timestamp = new Date('2025-01-01T10:00:00Z')
    seedGroups.forEach((group) => {
      const entity = UserGroupEntity.restore({
        ...group,
        createdAt: timestamp,
        updatedAt: timestamp,
      })
      this.groups.set(entity.toJSON().id, entity.toJSON())
    })
  }

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


