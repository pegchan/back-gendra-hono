import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const sampleData = [
  {
    fullName: 'María García López',
    email: 'maria.garcia@gmail.com',
    phone: '+52 55 1234 5678',
    country: 'México',
    documentType: 'INE' as const,
    documentNumber: '1234567890123',
    imageUrl: 'https://example.com/docs/maria_ine.jpg',
    status: 'PENDIENTE' as const,
    riskScore: 0,
    riskLevel: 'BAJO' as const,
  },
  {
    fullName: 'Carlos Rodríguez Martínez',
    email: 'carlos.rodriguez@outlook.com',
    phone: '+52 33 9876 5432',
    country: 'México',
    documentType: 'PASAPORTE' as const,
    documentNumber: 'G12345678',
    imageUrl: 'https://example.com/docs/carlos_passport.jpg',
    status: 'APROBADA' as const,
    riskScore: 10,
    riskLevel: 'BAJO' as const,
  },
  {
    fullName: 'Ana Fernández Torres',
    email: 'ana.fernandez@tempmail.com',
    phone: '+52 81 5555 4444',
    country: 'México',
    documentType: 'LICENCIA' as const,
    documentNumber: 'LIC123456',
    imageUrl: 'https://example.com/docs/ana_license.jpg',
    status: 'REQUIERE_INFORMACION' as const,
    riskScore: 40,
    riskLevel: 'MEDIO' as const,
  },
  {
    fullName: 'Pedro Sánchez Díaz',
    email: 'pedro.sanchez@yahoo.com',
    phone: '+58 212 1234567',
    country: 'Venezuela',
    documentType: 'PASAPORTE' as const,
    documentNumber: 'V87654321',
    imageUrl: 'https://example.com/docs/pedro_passport.jpg',
    status: 'RECHAZADA' as const,
    riskScore: 55,
    riskLevel: 'ALTO' as const,
  },
  {
    fullName: 'Laura Jiménez Ruiz',
    email: 'laura.jimenez@empresa.mx',
    phone: '+52 55 2222 3333',
    country: 'México',
    documentType: 'INE' as const,
    documentNumber: '9876543210987',
    imageUrl: 'https://example.com/docs/laura_ine.jpg',
    status: 'PENDIENTE' as const,
    riskScore: 0,
    riskLevel: 'BAJO' as const,
  },
]

async function main() {
  console.log('Seeding database...')

  for (const data of sampleData) {
    const record = await prisma.verificationRequest.create({
      data,
    })
    console.log(`Created verification request: ${record.id} - ${record.fullName}`)
  }

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
