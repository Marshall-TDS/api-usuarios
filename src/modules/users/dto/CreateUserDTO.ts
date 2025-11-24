export interface CreateUserDTO {
  fullName: string
  login: string
  email: string
  userGroup: string[]
  features?: string[] | undefined
  createdBy: string
}

