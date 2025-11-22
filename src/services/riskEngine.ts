import type { CreateVerificationInput, RiskAssessment, RiskLevel } from '../types/index.js'

// Lista de dominios de email de alto riesgo (hardcodeada)
const RISKY_EMAIL_DOMAINS = [
  'tempmail.com',
  'throwaway.com',
  'guerrillamail.com',
  'mailinator.com',
  'fakeinbox.com',
  '10minutemail.com',
  'trashmail.com',
  'yopmail.com',
]

// Lista de países restringidos (hardcodeada)
const RESTRICTED_COUNTRIES = [
  'Corea del Norte',
  'Irán',
  'Siria',
  'Cuba',
  'Venezuela',
  'Afganistán',
  'Myanmar',
]

// Longitud mínima de documento por tipo
const MIN_DOCUMENT_LENGTH: Record<string, number> = {
  INE: 13,
  PASAPORTE: 9,
  LICENCIA: 8,
}

export function calculateRiskScore(data: CreateVerificationInput): RiskAssessment {
  let score = 0
  const factors: string[] = []

  // Regla 1: Verificar dominio de email
  const emailDomain = data.email.split('@')[1]?.toLowerCase()
  if (emailDomain && RISKY_EMAIL_DOMAINS.includes(emailDomain)) {
    score += 40
    factors.push(`Dominio de email de alto riesgo: ${emailDomain}`)
  }

  // Regla 2: Verificar país restringido
  const normalizedCountry = data.country.trim().toLowerCase()
  if (RESTRICTED_COUNTRIES.some(c => c.toLowerCase() === normalizedCountry)) {
    score += 35
    factors.push(`País restringido: ${data.country}`)
  }

  // Regla 3: Verificar longitud del documento
  const minLength = MIN_DOCUMENT_LENGTH[data.documentType] || 8
  if (data.documentNumber.length < minLength) {
    score += 25
    factors.push(`Número de documento muy corto (mínimo ${minLength} caracteres para ${data.documentType})`)
  }

  // Regla adicional: Email con números excesivos (posible bot)
  const emailLocal = data.email.split('@')[0]
  const numbersInEmail = (emailLocal.match(/\d/g) || []).length
  if (numbersInEmail > 5) {
    score += 10
    factors.push('Email con muchos números (posible generado automáticamente)')
  }

  // Regla adicional: Teléfono con patrón repetitivo
  const cleanPhone = data.phone.replace(/\D/g, '')
  if (/(\d)\1{5,}/.test(cleanPhone)) {
    score += 15
    factors.push('Teléfono con patrón repetitivo sospechoso')
  }

  // nivel de riesgo
  let level: RiskLevel
  if (score >= 50) {
    level = 'ALTO'
  } else if (score >= 25) {
    level = 'MEDIO'
  } else {
    level = 'BAJO'
  }

  if (factors.length === 0) {
    factors.push('Sin factores de riesgo detectados')
  }

  return { score, level, factors }
}

export function getRiskyDomains(): string[] {
  return [...RISKY_EMAIL_DOMAINS]
}

export function getRestrictedCountries(): string[] {
  return [...RESTRICTED_COUNTRIES]
}
