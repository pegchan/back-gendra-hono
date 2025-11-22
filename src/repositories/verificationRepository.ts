import prisma from '../config/database.js'
import type { CreateVerificationInput, QueryParams, RiskLevel } from '../types/index.js'

export async function create(
  data: CreateVerificationInput,
  riskScore: number,
  riskLevel: RiskLevel
) {
  return prisma.verificationRequest.create({
    data: {
      ...data,
      riskScore,
      riskLevel,
    },
  })
}

export async function findAll(params: QueryParams) {
  const { search, status, page, limit } = params
  const skip = (page - 1) * limit

  const where: Record<string, unknown> = {}

  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (status) {
    where.status = status
  }

  const [data, total] = await Promise.all([
    prisma.verificationRequest.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.verificationRequest.count({ where }),
  ])

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

export async function findById(id: string) {
  return prisma.verificationRequest.findUnique({
    where: { id },
  })
}

export async function updateStatus(id: string, status: string) {
  return prisma.verificationRequest.update({
    where: { id },
    data: { status: status as never },
  })
}

export async function deleteById(id: string) {
  return prisma.verificationRequest.delete({
    where: { id },
  })
}
