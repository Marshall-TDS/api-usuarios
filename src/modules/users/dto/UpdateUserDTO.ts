export interface UpdateUserDTO {
  fullName?: string | undefined
  login?: string | undefined
  email?: string | undefined
  userGroup?: string[] | undefined
  features?: string[] | undefined
  updatedBy: string
}

