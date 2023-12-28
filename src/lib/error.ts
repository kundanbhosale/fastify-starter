import { IN_PROD } from '@/config'
import { logger } from '@/config/logger'
import { captureException } from '@sentry/node'
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { ZodError } from 'zod'

const errCode = {
    400: 'cancelled',
    401: 'unauthenticated',
    403: 'permission-denied',
    429: 'resource-exhausted',
    404: 'not-found',
    500: 'internal',
}

export const createError = (
    statusCode: keyof typeof errCode,
    message: string,
    trace?: any,
    details?: Record<string, any>
) => {
    return {
        name: 'customErr',
        statusCode,
        message,
        stack: trace?.stack || trace,
        details,
    }
}

const handleCustomErr = (
    error: ReturnType<typeof createError>,
    request: FastifyRequest,
    reply: FastifyReply
) => {
    const code = errCode[(error.statusCode || '400') as keyof typeof errCode]
    return reply.status(error.statusCode || 500).send({
        req_id: request.id,
        code,
        message: error.message,
        details: error.details,
        stack: !IN_PROD ? error.stack : undefined,
    })
}

const handleZodErr = (
    error: ZodError,
    request: FastifyRequest,
    reply: FastifyReply
) => {
    return reply.status(400).send({
        req_id: request.id,
        code: 'invalid_arguments',
        message: 'Validator Error',
        details: (error as any)?.issues,
        stack: !IN_PROD ? error.stack : undefined,
    })
}

export const errorHandler = (
    error: FastifyError & ReturnType<typeof createError>,
    request: FastifyRequest,
    reply: FastifyReply
) => {
    logger.error(error)

    if (IN_PROD) {
        captureException(error)
    }

    // reply.send(error)

    if (error?.name === 'customErr')
        return handleCustomErr(error, request, reply)

    if (error.name === 'ZodError')
        return handleZodErr(error as any, request, reply)

    return reply.status(500).send({
        req_id: request.id,
        code: 'internal',
        message: 'Something went wrong!',
        stack: !IN_PROD ? error.stack : undefined,
    })
}
