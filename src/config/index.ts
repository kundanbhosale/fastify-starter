import { Knex } from 'knex'
import { RedisClientOptions, RedisModules } from 'redis'

const node_env =
    (process.env.NODE_ENV as 'development' | 'production' | 'staging') ||
    'development'

export const IN_PROD = node_env === 'production'
export const IN_STAGING = node_env === 'staging'

export const serverConfig = {
    node_env: node_env,
    port: Number(process.env.PORT || 80),
    host: process.env.HOST,
    cors: {
        origin: IN_PROD ? 'https://www.example.com' : '*',
    },
    postgres: {
        host: String(process.env.DB_HOST),
        database: String(process.env.DB_NAME),
        user: String(process.env.DB_USER),
        password: String(process.env.DB_PASSWORD),
    } satisfies Knex.ConnectionConfig,
    redis: {
        socket: {
            host: process.env.RESIS_HOST,
            port: Number(process.env.RESIS_PORT!),
        },
        password: process.env.REDIS_PASSWORD,
        username: process.env.REDIS_USER,
    } satisfies RedisClientOptions<
        RedisModules,
        Record<string, never>,
        Record<string, never>
    >,
}

// Firebase Emulators
// if (config.node_env === 'staging') {
//     process.env['FIREBASE_AUTH_EMULATOR_HOST'] = '127.0.0.1:9099'
// }
