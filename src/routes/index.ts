import { IN_PROD } from '@/config'
import test from '@/controllers/test'
import { FastifyInstance } from 'fastify'

export async function publicRouter(fastify: FastifyInstance) {
    // TODO Remove this route
    if (!IN_PROD) {
        fastify.route({
            method: 'POST',
            url: '/test',
            // schema: createPostSchema,
            // preHandler: [checkValidRequest, checkValidUser],
            handler: test,
        })
    }
}
