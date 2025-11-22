import { Hono } from 'hono'
import * as controller from '../controllers/verificationController.js'

const verificationRoutes = new Hono()

// GET /api/verifications - Listar todas las solicitudes
verificationRoutes.get('/', controller.getAll)

// GET /api/verifications/:id - Obtener detalle de una solicitud
verificationRoutes.get('/:id', controller.getById)

// POST /api/verifications - Crear nueva solicitud
verificationRoutes.post('/', controller.create)

// PATCH /api/verifications/:id/status - Actualizar estado
verificationRoutes.patch('/:id/status', controller.updateStatus)

// DELETE /api/verifications/:id - Eliminar solicitud
verificationRoutes.delete('/:id', controller.remove)

export default verificationRoutes
