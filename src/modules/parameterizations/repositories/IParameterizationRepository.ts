import type { ParameterizationProps } from '../entities/Parameterization'

export interface IParameterizationRepository {
  findAll(): Promise<ParameterizationProps[]>
  findById(id: string): Promise<ParameterizationProps | null>
  findByTechnicalKey(technicalKey: string): Promise<ParameterizationProps | null>
  create(parameterization: { toJSON(): ParameterizationProps }): Promise<ParameterizationProps>
  update(parameterization: { toJSON(): ParameterizationProps }): Promise<ParameterizationProps>
  delete(id: string): Promise<void>
}

