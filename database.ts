import fp from 'fastify-plugin'
import { PostgresPluginOptions, fastifyPostgres } from '@fastify/postgres'
import { FastifyInstance } from 'fastify'

async function dbConnector(app: FastifyInstance, options: any) {
    app.register(fastifyPostgres, {
        connectionString: "postgresql://postgres:1h4gzcLLN2djzmfT@db.rjvcvchpforpyhebcaty.supabase.co:5432/postgres"
    })
}

export default fp(dbConnector)