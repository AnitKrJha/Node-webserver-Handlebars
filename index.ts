import fastifyFormbody from '@fastify/formbody'
import fastifyStatic from '@fastify/static'
import fastifyView from '@fastify/view'
import Fastify from 'fastify'
import handlebars from 'handlebars'
import { join } from 'node:path'
import dbConnector from './database.js'
import { routes } from './routes.js'
import { __dirname } from './utils.js'
const app = Fastify()
app.register(fastifyStatic, {
    root: join(__dirname, 'public')
})
app.register(fastifyFormbody)
app.register(fastifyView, {
    engine: {
        handlebars: handlebars
    },
    root: join(__dirname, 'views'),
    options: {
        partials: {
            todoItem: 'todoItem.handlebars'
        }
    }
})

//database is registered here
app.register(dbConnector);
//routes are registered here.
app.register(routes);





app.listen({ port: 8080 });


