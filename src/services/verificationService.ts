import * as repository from '../repositories/verificationRepository.js'
import { calculateRiskScore } from './riskEngine.js'
import type { CreateVerificationInput, QueryParams, RequestStatus } from '../types/index.js'

export async function createVerification(data: CreateVerificationInput) {
  const riskAssessment = calculateRiskScore(data)

  const verification = await repository.create(
    data,
    riskAssessment.score,
    riskAssessment.level
  )

  return {
    ...verification,
    riskAssessment,
  }
}

export async function getVerifications(params: QueryParams) {
  return repository.findAll(params)
}

export async function getVerificationById(id: string) {
  const verification = await repository.findById(id)

  if (!verification) {
    return null
  }

  // Recalcular factores de riesgo para mostrar en detalle
  const riskAssessment = calculateRiskScore({
    fullName: verification.fullName,
    email: verification.email,
    phone: verification.phone,
    country: verification.country,
    documentType: verification.documentType,
    documentNumber: verification.documentNumber,
    imageUrl: verification.imageUrl,
  })

  return {
    ...verification,
    riskAssessment,
  }
}

export async function updateVerificationStatus(id: string, status: RequestStatus) {
  const exists = await repository.findById(id)

  if (!exists) {
    return null
  }

  return repository.updateStatus(id, status)
}

export async function deleteVerification(id: string) {
  const exists = await repository.findById(id)

  if (!exists) {
    return null
  }

  return repository.deleteById(id)
}
