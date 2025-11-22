import { z } from 'zod'

export const DocumentTypeEnum = z.enum(['INE', 'PASAPORTE', 'LICENCIA'])
export const RequestStatusEnum = z.enum(['PENDIENTE', 'APROBADA', 'RECHAZADA', 'REQUIERE_INFORMACION'])
export const RiskLevelEnum = z.enum(['BAJO', 'MEDIO', 'ALTO'])

export type DocumentType = z.infer<typeof DocumentTypeEnum>
export type RequestStatus = z.infer<typeof RequestStatusEnum>
export type RiskLevel = z.infer<typeof RiskLevelEnum>

export const CreateVerificationSchema = z.object({
  fullName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.email('Email inválido'),
  phone: z.string().min(10, 'El teléfono debe tener al menos 10 dígitos').regex(/^[\d\s\-+()]+$/, 'Formato de teléfono inválido'),
  country: z.string().min(2, 'El país es requerido'),
  documentType: DocumentTypeEnum,
  documentNumber: z.string().min(5, 'El número de documento debe tener al menos 5 caracteres'),
  imageUrl: z.url('URL de imagen inválida').optional().nullable(),
})

export const UpdateStatusSchema = z.object({
  status: RequestStatusEnum,
})

export const QueryParamsSchema = z.object({
  search: z.string().optional(),
  status: RequestStatusEnum.optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
})

export type CreateVerificationInput = z.infer<typeof CreateVerificationSchema>
export type UpdateStatusInput = z.infer<typeof UpdateStatusSchema>
export type QueryParams = z.infer<typeof QueryParamsSchema>

export interface RiskAssessment {
  score: number
  level: RiskLevel
  factors: string[]
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
