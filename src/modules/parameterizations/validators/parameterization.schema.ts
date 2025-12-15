import { z } from 'zod'

const technicalKeySchema = z
  .string()
  .min(3)
  .max(255)
  .transform((value) => value.toUpperCase().replace(/\s/g, '_'))
  .refine((value) => /^[A-Z0-9_]+$/.test(value), {
    message: 'Technical key deve conter apenas letras maiúsculas, números e underscores',
  })

export const createParameterizationSchema = z.object({
  friendlyName: z.string().min(3).max(255),
  technicalKey: technicalKeySchema,
  dataType: z.string().min(1).max(50),
  value: z.string().min(1),
  scopeType: z.string().min(1).max(50),
  scopeTargetId: z.array(z.string().uuid()).optional(),
  createdBy: z.string().min(3),
})

export const updateParameterizationSchema = z
  .object({
    friendlyName: z.string().min(3).max(255).optional(),
    technicalKey: technicalKeySchema.optional(),
    dataType: z.string().min(1).max(50).optional(),
    value: z.string().min(1).optional(),
    scopeType: z.string().min(1).max(50).optional(),
    scopeTargetId: z.array(z.string().uuid()).optional(),
    updatedBy: z.string().min(3),
  })
  .refine((data) => Object.keys(data).some((key) => key !== 'updatedBy'), {
    message: 'Informe ao menos um campo para atualizar',
    path: ['body'],
  })

