import knex, { Knex } from 'knex'
import { serverConfig } from '.'

const opts: Knex.Config = {
    client: 'pg',
    connection: serverConfig.postgres,
    acquireConnectionTimeout: 60 * 1000,
    pool: {
        min: 2,
        max: 10,
    },

    // debug: !IN_PROD,
}

const knexQuery = knex(opts)

export default knexQuery
