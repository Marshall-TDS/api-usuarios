import { z } from "zod";

const technicalKeySchema = z
  .string()
  .min(3)
  .max(255)
  .transform((value) => value.toUpperCase().replace(/\s/g, "_"))
  .refine((value) => /^[A-Z0-9_]+$/.test(value), {
    message:
      "Technical key deve conter apenas letras maiúsculas, números e underscores",
  });

// Mapeamento de valores modernos para valores aceitos pela constraint CHECK do banco
const dataTypeMapping: Record<string, string> = {
  // Números
  decimal: "Número",
  number: "Número",
  integer: "Número",
  int: "Número",
  float: "Número",
  double: "Número",
  numeric: "Número",
  // Textos
  string: "Texto",
  text: "Texto",
  varchar: "Texto",
  char: "Texto",
  // Datas
  date: "Data",
  datetime: "Data",
  timestamp: "Data",
  time: "Data",
  // Booleanos
  boolean: "Booleano",
  bool: "Booleano",
};

const dataTypeSchema = z
  .string()
  .min(1)
  .max(50)
  .transform((value) => {
    const normalized = value.toLowerCase().trim();
    // Se existe no mapeamento, retorna o valor mapeado
    if (dataTypeMapping[normalized]) {
      return dataTypeMapping[normalized];
    }
    // Caso contrário, retorna o valor original (pode ser um dos valores aceitos pela constraint)
    return value;
  });

export const createParameterizationSchema = z.object({
  friendlyName: z.string().min(3).max(255),
  technicalKey: technicalKeySchema,
  dataType: dataTypeSchema,
  value: z.string().min(1),
  scopeType: z.string().min(1).max(50),
  scopeTargetId: z.array(z.string().uuid()).optional(),
  editable: z.boolean().optional(),
  createdBy: z.string().min(3),
});

export const updateParameterizationSchema = z
  .object({
    friendlyName: z.string().min(3).max(255).optional(),
    technicalKey: technicalKeySchema.optional(),
    dataType: dataTypeSchema.optional(),
    value: z.string().min(1).optional(),
    scopeType: z.string().min(1).max(50).optional(),
    scopeTargetId: z.array(z.string().uuid()).optional(),
    editable: z.boolean().optional(),
    updatedBy: z.string().min(3),
  })
  .refine((data) => Object.keys(data).some((key) => key !== "updatedBy"), {
    message: "Informe ao menos um campo para atualizar",
    path: ["body"],
  });
