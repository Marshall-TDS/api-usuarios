import { z } from 'zod'

const groupValues = [
  'Administradores',
  'Operações',
  'Financeiro',
  'Comercial',
  'RH',
  'Jurídico',
  'Tecnologia',
  'Expansão',
  'Suporte Avançado',
] as const

const featureValues = ['dashboard', 'credito', 'compras', 'estoque', 'financeiro'] as const

export const createUserSchema = z.object({
  fullName: z.string().min(3),
  login: z.string().min(3),
  email: z.string().email(),
  userGroup: z.array(z.enum(groupValues)).nonempty(),
  features: z.array(z.enum(featureValues)).optional(),
  createdBy: z.string().email(),
})

export const updateUserSchema = z
  .object({
    fullName: z.string().min(3).optional(),
    login: z.string().min(3).optional(),
    email: z.string().email().optional(),
    userGroup: z.array(z.enum(groupValues)).nonempty().optional(),
    features: z.array(z.enum(featureValues)).optional(),
    updatedBy: z.string().email(),
  })
  .refine((data) => Object.keys(data).some((key) => key !== 'updatedBy'), {
    message: 'Informe ao menos um campo para atualizar',
    path: ['body'],
  })

