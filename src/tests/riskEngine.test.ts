import { describe, it, expect } from 'vitest'
import { calculateRiskScore } from '../services/riskEngine.js'

describe('Risk Engine', () => {
  it('debería retornar riesgo BAJO para datos normales', () => {
    const input = {
      fullName: 'Juan Pérez',
      email: 'juan.perez@gmail.com',
      phone: '+52 55 1234 5678',
      country: 'México',
      documentType: 'INE' as const,
      documentNumber: '1234567890123',
      imageUrl: null,
    }

    const result = calculateRiskScore(input)

    expect(result.level).toBe('BAJO')
    expect(result.score).toBeLessThan(25)
  })

  it('debería retornar riesgo ALTO para país restringido y email de riesgo', () => {
    const input = {
      fullName: 'Test User',
      email: 'test@tempmail.com',
      phone: '+52 55 1234 5678',
      country: 'Venezuela',
      documentType: 'INE' as const,
      documentNumber: '1234567890123',
      imageUrl: null,
    }

    const result = calculateRiskScore(input)

    expect(result.level).toBe('ALTO')
    expect(result.score).toBeGreaterThanOrEqual(50)
  })
})
