export interface CreateUserDTO {
  fullName: string
  login: string
  email: string
  groupIds: string[]
  allowFeatures?: string[] | undefined
  deniedFeatures?: string[] | undefined
  createdBy: string
}

