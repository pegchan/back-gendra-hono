import type { Context } from 'hono'
import * as service from '../services/verificationService.js'
import { CreateVerificationSchema, UpdateStatusSchema, QueryParamsSchema } from '../types/index.js'

export async function create(c: Context) {
  try {
    const body = await c.req.json()
    const validatedData = CreateVerificationSchema.parse(body)

    const result = await service.createVerification(validatedData)

    console.log(`[INFO] Nueva solicitud creada: ${result.id}`)

    return c.json({
      success: true,
      data: result,
      message: 'Solicitud de verificación creada exitosamente',
    }, 201)
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return c.json({
        success: false,
        error: 'Datos de entrada inválidos',
        details: (error as unknown as { errors: unknown[] }).errors,
      }, 400)
    }

    console.error('[ERROR] Error creando solicitud:', error)
    return c.json({
      success: false,
      error: 'Error interno del servidor',
    }, 500)
  }
}

export async function getAll(c: Context) {
  try {
    const query = c.req.query()
    const params = QueryParamsSchema.parse({
      search: query.search,
      status: query.status,
      page: query.page ? parseInt(query.page) : 1,
      limit: query.limit ? parseInt(query.limit) : 10,
    })

    const result = await service.getVerifications(params)

    return c.json({
      success: true,
      ...result,
    })
  } catch (error) {
    console.error('[ERROR] Error obteniendo solicitudes:', error)
    return c.json({
      success: false,
      error: 'Error interno del servidor',
    }, 500)
  }
}

export async function getById(c: Context) {
  try {
    const id = c.req.param('id')
    const result = await service.getVerificationById(id)

    if (!result) {
      return c.json({
        success: false,
        error: 'Solicitud no encontrada',
      }, 404)
    }

    return c.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('[ERROR] Error obteniendo solicitud:', error)
    return c.json({
      success: false,
      error: 'Error interno del servidor',
    }, 500)
  }
}

export async function updateStatus(c: Context) {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    const { status } = UpdateStatusSchema.parse(body)

    const result = await service.updateVerificationStatus(id, status)

    if (!result) {
      return c.json({
        success: false,
        error: 'Solicitud no encontrada',
      }, 404)
    }

    console.log(`[INFO] Estado actualizado para ${id}: ${status}`)

    return c.json({
      success: true,
      data: result,
      message: 'Estado actualizado exitosamente',
    })
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return c.json({
        success: false,
        error: 'Estado inválido',
        details: (error as unknown as { errors: unknown[] }).errors,
      }, 400)
    }

    console.error('[ERROR] Error actualizando estado:', error)
    return c.json({
      success: false,
      error: 'Error interno del servidor',
    }, 500)
  }
}

export async function remove(c: Context) {
  try {
    const id = c.req.param('id')
    const result = await service.deleteVerification(id)

    if (!result) {
      return c.json({
        success: false,
        error: 'Solicitud no encontrada',
      }, 404)
    }

    console.log(`[INFO] Solicitud eliminada: ${id}`)

    return c.json({
      success: true,
      message: 'Solicitud eliminada exitosamente',
    })
  } catch (error) {
    console.error('[ERROR] Error eliminando solicitud:', error)
    return c.json({
      success: false,
      error: 'Error interno del servidor',
    }, 500)
  }
}
