import { randomUUID } from 'crypto'

export interface UserProps {
  id: string
  fullName: string
  login: string
  email: string
  userGroup: string[]
  features: string[]
  createdAt: Date
  createdBy: string
  updatedAt: Date
  updatedBy: string
}

export type CreateUserProps = Omit<UserProps, 'id' | 'createdAt' | 'updatedAt'>

export type UpdateUserProps = {
  fullName?: string | undefined
  login?: string | undefined
  email?: string | undefined
  userGroup?: string[] | undefined
  features?: string[] | undefined
  updatedBy: string
}

export class User {
  private constructor(private props: UserProps) {}

  static create(data: CreateUserProps) {
    const timestamp = new Date()
    return new User({
      ...data,
      id: randomUUID(),
      createdAt: timestamp,
      updatedAt: timestamp,
    })
  }

  static restore(props: UserProps) {
    return new User(props)
  }

  update(data: UpdateUserProps) {
    const nextProps: UserProps = { ...this.props }

    if (typeof data.fullName !== 'undefined') {
      nextProps.fullName = data.fullName
    }
    if (typeof data.login !== 'undefined') {
      nextProps.login = data.login
    }
    if (typeof data.email !== 'undefined') {
      nextProps.email = data.email
    }
    if (typeof data.userGroup !== 'undefined') {
      nextProps.userGroup = data.userGroup
    }
    if (typeof data.features !== 'undefined') {
      nextProps.features = data.features
    }

    nextProps.updatedBy = data.updatedBy
    nextProps.updatedAt = new Date()

    this.props = nextProps
  }

  toJSON(): UserProps {
    return { ...this.props }
  }
}

