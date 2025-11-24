import type { User, UserProps } from '../entities/User'
import { User as UserEntity } from '../entities/User'
import type { IUserRepository } from './IUserRepository'

const seedUsers: Omit<UserProps, 'createdAt' | 'updatedAt'>[] = [
  {
    id: 'seed-1',
    fullName: 'Mariana Lopes',
    login: 'mlopes',
    email: 'mariana.lopes@example.com',
    userGroup: ['Administradores'],
    features: ['dashboard', 'financeiro'],
    createdBy: 'sistema@erp.com',
    updatedBy: 'sistema@erp.com',
  },
  {
    id: 'seed-2',
    fullName: 'Cláudio Mendes',
    login: 'cmendes',
    email: 'claudio.mendes@example.com',
    userGroup: ['Operações'],
    features: ['estoque'],
    createdBy: 'sistema@erp.com',
    updatedBy: 'sistema@erp.com',
  },
  {
    id: 'seed-3',
    fullName: 'Simone Andrade',
    login: 'sandrade',
    email: 'simone.andrade@example.com',
    userGroup: ['Financeiro'],
    features: ['financeiro', 'credito'],
    createdBy: 'sistema@erp.com',
    updatedBy: 'sistema@erp.com',
  },
]

export class InMemoryUserRepository implements IUserRepository {
  private readonly users = new Map<string, UserProps>()

  constructor() {
    const timestamp = new Date('2025-01-01T10:00:00Z')
    seedUsers.forEach((user) => {
      const entity = UserEntity.restore({
        ...user,
        createdAt: timestamp,
        updatedAt: timestamp,
      })
      this.users.set(entity.toJSON().id, entity.toJSON())
    })
  }

  async findAll(): Promise<UserProps[]> {
    return Array.from(this.users.values())
  }

  async findById(id: string): Promise<UserProps | null> {
    return this.users.get(id) ?? null
  }

  async findByLogin(login: string): Promise<UserProps | null> {
    const user = Array.from(this.users.values()).find(
      (item) => item.login.toLowerCase() === login.toLowerCase(),
    )
    return user ?? null
  }

  async findByEmail(email: string): Promise<UserProps | null> {
    const user = Array.from(this.users.values()).find(
      (item) => item.email.toLowerCase() === email.toLowerCase(),
    )
    return user ?? null
  }

  async create(user: User): Promise<UserProps> {
    const data = user.toJSON()
    this.users.set(data.id, data)
    return data
  }

  async update(user: User): Promise<UserProps> {
    const data = user.toJSON()
    this.users.set(data.id, data)
    return data
  }

  async delete(id: string): Promise<void> {
    this.users.delete(id)
  }
}

