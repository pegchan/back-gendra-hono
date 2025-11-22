# Backend -  KYC API

API REST para gestion de solicitudes de verificacion KYC (Know Your Customer) desarrollada con HonoJS y TypeScript.

## Tecnologias Utilizadas

| Tecnologia | Version | Proposito |
|------------|---------|-----------|
| **HonoJS** | 4.10.6 | Framework web ultraligero |
| **TypeScript** | 5.x | Tipado estatico |
| **Prisma** | 5.x | ORM para PostgreSQL |
| **Zod** | 4.x | Validacion de esquemas |
| **Vitest** | 4.x | Testing |
| **Node.js** | 18+ | Runtime |

## Estructura del Proyecto

```
back-gendra-hono/
├── src/
│   ├── config/
│   │   └── database.ts          # Configuracion de Prisma Client
│   ├── controllers/
│   │   └── verificationController.ts  # Controladores HTTP
│   ├── middleware/
│   │   └── errorHandler.ts      # Manejo global de errores
│   ├── repositories/
│   │   └── verificationRepository.ts  # Acceso a datos
│   ├── routes/
│   │   └── verification.ts      # Definicion de rutas
│   ├── services/
│   │   ├── riskEngine.ts        # Motor de reglas de riesgo
│   │   └── verificationService.ts     # Logica de negocio
│   ├── tests/
│   │   ├── riskEngine.test.ts   # Tests del motor de riesgo
│   │   └── validation.test.ts   # Tests de validacion
│   ├── types/
│   │   └── index.ts             # Tipos y schemas Zod
│   └── index.ts                 # Punto de entrada
├── prisma/
│   ├── schema.prisma            # Esquema de base de datos
│   └── seed.ts                  # Datos de ejemplo
├── .env                         # Variables de entorno (no commitear)
├── .env.example                 # Plantilla de variables
└── package.json
```

## Requisitos Previos

- Node.js 18 o superior
- PostgreSQL 14 o superior
- npm o yarn

## Instalacion

```bash
# Clonar e instalar dependencias
cd back-gendra-hono
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de PostgreSQL
```

## Configuracion de Base de Datos

### 1. Crear la base de datos

```sql
-- Conectar a PostgreSQL
psql -U postgres

-- Crear base de datos
CREATE DATABASE gendra;
```
### 1.1 justificacion del uso de PostgresSQL
  1. Datos sensibles requieren confiabilidad
    - Los datos de verificacion de identidad (nombres, documentos, evaluaciones de riesgo) son informacion critica que no puede perderse ni corromperse
  2. Estandar en la industria financiera
    - Cumple con estandares de la industria para manejo de datos sensibles
  3. Gratuito y de codigo abierto
    - Sin costos de licencia, ideal para un proyecto de prueba tecnica
    - Gran comunidad y documentacion disponible
  4. Compatibilidad con Prisma
    - Prisma (el ORM usado) tiene excelente soporte para PostgreSQL
    - Facilita las consultas, migraciones y mantenimiento del esquema
  5. Escalabilidad
    - Puede manejar desde pocas solicitudes hasta millones sin cambiar de tecnologia
    - Crece con el negocio
  6. Preferencia del desarrollador :) 

### 2. Variables de entorno (.env)

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_password
DB_NAME=gendra

# Prisma Database URL
DATABASE_URL="postgresql://postgres:tu_password@localhost:5432/gendra?schema=public"

# Server Configuration
PORT=3000
```

### 3. Generar cliente y crear tablas

```bash
# Generar cliente de Prisma
npm run db:generate

# Crear tablas en la base de datos
npm run db:push

# (Opcional) Cargar datos de ejemplo
npm run db:seed
```

## Scripts Disponibles

| Comando | Descripcion |
|---------|-------------|
| `npm run dev` | Inicia servidor en modo desarrollo con hot-reload |
| `npm run build` | Compila TypeScript a JavaScript |
| `npm run start` | Inicia servidor en produccion |
| `npm test` | Ejecuta tests |
| `npm run test:watch` | Ejecuta tests en modo watch |
| `npm run db:generate` | Genera cliente de Prisma |
| `npm run db:push` | Sincroniza schema con la base de datos |
| `npm run db:migrate` | Crea migracion de base de datos |
| `npm run db:studio` | Abre Prisma Studio (GUI) |
| `npm run db:seed` | Carga datos de ejemplo |

## API Endpoints

### Base URL: `http://localhost:3000/api`

### Health Check

```
GET /
```

Respuesta:
```json
{
  "status": "ok",
  "message": "KYC Verification API - Gendra",
  "version": "1.0.0"
}
```

### Solicitudes de Verificacion

#### Listar solicitudes

```
GET /verifications
```

**Query Parameters:**
| Parametro | Tipo | Descripcion |
|-----------|------|-------------|
| `search` | string | Buscar por nombre o email |
| `status` | string | Filtrar por estado |
| `page` | number | Numero de pagina (default: 1) |
| `limit` | number | Registros por pagina (default: 10, max: 100) |

**Ejemplo:**
```bash
curl "http://localhost:3000/api/verifications?status=PENDIENTE&page=1&limit=10"
```

**Respuesta:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

#### Obtener detalle

```
GET /verifications/:id
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "fullName": "Juan Perez",
    "email": "juan@email.com",
    "phone": "+52 55 1234 5678",
    "country": "Mexico",
    "documentType": "INE",
    "documentNumber": "1234567890123",
    "status": "PENDIENTE",
    "riskScore": 15,
    "riskLevel": "BAJO",
    "riskAssessment": {
      "score": 15,
      "level": "BAJO",
      "factors": ["Sin factores de riesgo detectados"]
    },
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

#### Crear solicitud

```
POST /verifications
```

**Body:**
```json
{
  "fullName": "Juan Perez Garcia",
  "email": "juan@email.com",
  "phone": "+52 55 1234 5678",
  "country": "Mexico",
  "documentType": "INE",
  "documentNumber": "1234567890123",
  "imageUrl": "https://example.com/imagen.jpg"
}
```

**Campos requeridos:** `fullName`, `email`, `phone`, `country`, `documentType`, `documentNumber`

**Campos opcionales:** `imageUrl` (URL de imagen del documento o selfie)

**Tipos de documento:** `INE`, `PASAPORTE`, `LICENCIA`

#### Actualizar estado

```
PATCH /verifications/:id/status
```

**Body:**
```json
{
  "status": "APROBADA"
}
```

**Estados validos:** `PENDIENTE`, `APROBADA`, `RECHAZADA`, `REQUIERE_INFORMACION`

#### Eliminar solicitud

```
DELETE /verifications/:id
```

## Motor de Reglas de Riesgo

El sistema calcula automaticamente un score de riesgo basado en las siguientes reglas:

### Reglas de Penalizacion

| Regla | Puntos | Descripcion |
|-------|--------|-------------|
| Email de dominio riesgoso | +40 | Dominios como tempmail.com, mailinator.com, etc. |
| Pais restringido | +35 | Venezuela, Cuba, Iran, Corea del Norte, etc. |
| Documento muy corto | +25 | INE < 13, Pasaporte < 9, Licencia < 8 caracteres |
| Email con muchos numeros | +10 | Mas de 5 numeros en la parte local del email |
| Telefono con patron repetitivo | +15 | Patrones como 1111111, 9999999 |

### Clasificacion de Riesgo

| Score | Nivel |
|-------|-------|
| 0-24 | BAJO |
| 25-49 | MEDIO |
| 50+ | ALTO |

### Dominios de Email Riesgosos (hardcodeados)

- tempmail.com
- throwaway.com
- guerrillamail.com
- mailinator.com
- fakeinbox.com
- 10minutemail.com
- trashmail.com
- yopmail.com

### Paises Restringidos (hardcodeados)

- Corea del Norte
- Iran
- Siria
- Cuba
- Venezuela
- Afganistan
- Myanmar

## Tests

El proyecto incluye 2 tests unitarios del motor de riesgo:

```bash
# Ejecutar tests
npm test

# Ejecutar en modo watch
npm run test:watch
```

### Tests incluidos

- **riskEngine.test.ts** (2 tests)
  - Calculo de riesgo BAJO para datos normales
  - Calculo de riesgo ALTO para pais restringido y email de riesgo

## Modelo de Datos

```prisma
model VerificationRequest {
  id              String        @id @default(uuid())
  fullName        String
  email           String
  phone           String
  country         String
  documentType    DocumentType  // INE, PASAPORTE, LICENCIA
  documentNumber  String
  imageUrl        String?       // URL de imagen (documento o selfie)
  status          RequestStatus // PENDIENTE, APROBADA, RECHAZADA, REQUIERE_INFORMACION
  riskScore       Int           @default(0)
  riskLevel       RiskLevel     // BAJO, MEDIO, ALTO
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}
```

## Arquitectura

El proyecto sigue una arquitectura en capas:

```
Request → Routes → Controllers → Services → Repositories → Database
                                    ↓
                              Risk Engine
```

- **Routes**: Define endpoints y metodos HTTP
- **Controllers**: Maneja requests/responses, validacion de entrada
- **Services**: Logica de negocio, orquestacion
- **Repositories**: Acceso a datos con Prisma
- **Risk Engine**: Calculo de score de riesgo (capa independiente y testeable)

## Seguridad

- CORS configurado para origenes localhost en desarrollo
- Validacion de entrada con Zod
- No se exponen detalles de errores internos en produccion
- Variables de entorno para credenciales sensibles
- Sanitizacion de datos en respuestas de error

## Desarrollo

```bash
# Iniciar en modo desarrollo
npm run dev

# El servidor estara disponible en http://localhost:3000
```

## Produccion

```bash
# Compilar
npm run build

# Iniciar
npm start
```

## Docker

```dockerfile
# Construir imagen
docker build -t gendra-backend .

# Ejecutar
docker run -p 3000:3000 --env-file .env gendra-backend
```

