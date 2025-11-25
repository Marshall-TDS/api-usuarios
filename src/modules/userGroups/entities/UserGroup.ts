import { randomUUID } from 'crypto'

export interface UserGroupProps {
  id: string
  name: string
  code: string
  features: string[]
  createdAt: Date
  createdBy: string
  updatedAt: Date
  updatedBy: string
}

export type CreateUserGroupProps = Omit<UserGroupProps, 'id' | 'createdAt' | 'updatedAt'>

export type UpdateUserGroupProps = {
  name?: string | undefined
  code?: string | undefined
  features?: string[] | undefined
  updatedBy: string
}

export class UserGroup {
  private constructor(private props: UserGroupProps) {}

  static create(data: CreateUserGroupProps) {
    const timestamp = new Date()
    return new UserGroup({
      ...data,
      id: randomUUID(),
      createdAt: timestamp,
      updatedAt: timestamp,
    })
  }

  static restore(props: UserGroupProps) {
    return new UserGroup(props)
  }

  update(data: UpdateUserGroupProps) {
    const nextProps: UserGroupProps = { ...this.props }

    if (typeof data.name !== 'undefined') {
      nextProps.name = data.name
    }

    if (typeof data.code !== 'undefined') {
      nextProps.code = data.code
    }

    if (typeof data.features !== 'undefined') {
      nextProps.features = data.features
    }

    nextProps.updatedBy = data.updatedBy
    nextProps.updatedAt = new Date()

    this.props = nextProps
  }

  toJSON(): UserGroupProps {
    return { ...this.props }
  }
}


