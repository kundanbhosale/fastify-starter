import { RedisClientType, createClient } from 'redis'
import { logger } from './logger'
import { serverConfig } from '.'

export let redisClient: RedisClientType
export const connectRedis = async () => {
    redisClient = createClient(serverConfig.redis)
    await redisClient.connect()

    redisClient.on('ready', () =>
        logger.info({ name: 'Redis', msg: 'Redis is ready' })
    )
    redisClient.on('end', () =>
        logger.warn({ name: 'Redis', msg: 'Redis is disconnected' })
    )
    redisClient.on('connect', () =>
        logger.warn({ name: 'Redis', msg: 'Redis is conneting' })
    )
    redisClient.on('reconnecting	', () =>
        logger.warn({ name: 'Redis', msg: 'Redis is reconneting' })
    )
    redisClient.on('error', (error) =>
        logger.error({ name: 'Redis', msg: `Error : ${error}` })
    )
}
