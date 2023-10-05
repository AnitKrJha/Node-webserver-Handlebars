import { join } from 'node:path'
import fastifyStatic from '@fastify/static'
import Fastify from 'fastify'
import handlebars from 'handlebars'
import fastifyView from '@fastify/view'
import { routes } from './routes.js'
import { __dirname, addTodo, delTodo, Todos, toggleStatus } from './utils.js'
import fastifyFormbody from '@fastify/formbody'
const app = Fastify({ logger: true })
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


//routes are registered here.
app.register(routes);



app.listen({ port: 8080 });


