import type { Context, Next } from 'hono'

export async function errorHandler(c: Context, next: Next) {
  try {
    await next()
  } catch (error) {
    console.error('[ERROR] Unhandled error:', error)

    // No exponer detalles de errores internos en producción
    const isDev = process.env.NODE_ENV !== 'production'

    return c.json({
      success: false,
      error: 'Error interno del servidor',
      ...(isDev && error instanceof Error && { details: error.message }),
    }, 500)
  }
}
