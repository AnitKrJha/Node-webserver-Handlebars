import fp from 'fastify-plugin'
import { PostgresPluginOptions, fastifyPostgres } from '@fastify/postgres'
import { FastifyInstance } from 'fastify'

async function dbConnector(app: FastifyInstance, options: any) {
    app.register(fastifyPostgres, {
        connectionString: process.env.DB_URL
    })
}

export default fp(dbConnector)