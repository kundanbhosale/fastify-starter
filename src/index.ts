import fastify, { FastifyInstance } from 'fastify'
import { logger, loggerOpts } from './config/logger'
import { errorHandler } from './lib/error'
import cors from '@fastify/cors'
import { publicRouter } from './routes'
import { connectRedis } from './config/redis'
import { captureException, init } from '@sentry/node'
import { IN_PROD, serverConfig } from './config'

const startServer = async () => {
    try {
        const server: FastifyInstance = fastify({
            pluginTimeout: 15 * 1000, // millisec
            requestTimeout: 300,
            logger: loggerOpts,
        })

        init({
            dsn: process.env.SENTRY_DSN,
            environment: process.env.NODE_ENV,
        })

        //! CORS
        await server.register(cors, {
            // put your options here
            origin: IN_PROD ? 'https://www.lipy.ai' : '*',
            methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        })

        server.setErrorHandler(errorHandler)

        server.decorateRequest('user', '')

        /***********************************************************************************
         * Routes
         ************************************************************************************/

        await server.register(publicRouter)

        server.addHook('onReady', async () => {
            // IN_STAGING
            //     ? initializeApp({ projectId: process.env.GOOGLE_CLOUD_PROJECT })
            //     : initializeApp({
            //           credential: applicationDefault(),
            //       })

            return await connectRedis()
        })

        for (const signal of ['SIGINT', 'SIGTERM']) {
            process.on(signal, (e) =>
                server.close().then((err) => {
                    logger.warn(`close application on ${signal}`, { err, e })
                    process.exit(err ? 1 : 0)
                })
            )
        }

        logger.warn(`Mode: ${serverConfig.node_env}`)
        await server.listen({
            port: serverConfig.port,
            host: serverConfig.host,
        })
    } catch (e) {
        logger.error(e)
        return
    }
}

process.on('unhandledRejection', (e) => {
    captureException(e)
    process.exit(1)
})

export const viteNodeApp = startServer()
