import { join } from 'node:path'
import fastifyStatic from '@fastify/static'
import Fastify from 'fastify'
import handlebars from 'handlebars'
import fastifyView from '@fastify/view'
import { __dirname, addTodo, delTodo, Todos, toggleStatus } from './utils.ts'
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

interface IQueryString {
    error?: string;
}
interface IBodyCreateTodo {
    todo: string;
}



app.get<{ Querystring: IQueryString }>('/', (request, response) => {
    const error = request.query.error || '';
    response.headers({ "content-type": "text/html" })
    response.view('todoApp.handlebars', { Todos, error }, { layout: 'layout.html' })
})

app.post<{ Body: IBodyCreateTodo }>('/create', (req, res) => {
    try {
        // Extract the 'todo' property from the request body and trim any leading/trailing whitespace
        const todoFromBody = req.body.todo.trim();
        // Check if the 'todo' is blank
        if (todoFromBody === '') {
            // If it's blank, redirect to the home page with an error message
            res.redirect(`/?error=Todo should not be blank`);
            return;
        }

        // Set the content type header to text/html
        res.headers({ "Content-Type": "text/html" });

        // Add the 'todo' to your data store or perform relevant operations
        addTodo(todoFromBody);

        // Redirect to the home page
        res.redirect('/');
    } catch (error: any) {
        // If an error occurs during the try block, handle it here
        res.headers({ "Content-Type": "text/html" });

        // Redirect to the home page with an error message based on the error's message
        res.redirect(`/?error=${error.message}`);
    }
});

// This route handles POST requests to the `/delete/:id` endpoint.
app.post<{ Params: { id: string } }>('/delete/:id', (req, res) => {
    try {
        // Get the `id` parameter from the request.
        const { id } = req.params;

        // Delete the todo item with the given `id`.
        delTodo(id);

        // Set the response content type to `text/html`.
        res.headers({ 'Content-Type': 'text/html' });

        // Redirect the user to the home page.
        res.redirect('/');
    } catch (e: any) {
        // If an error occurs, set the response content type to `text/html` and redirect the user to the home page with an error message.
        res.headers({ 'Content-Type': 'text/html' });
        res.redirect(`/?error=${e.message}`);
    }
});

app.post<{ Params: { id: string } }>('/toggle/:id', (req, res) => {
    try {
        const { id } = req.params;
        toggleStatus(id);
        res.headers({ "Content-type": "text/html" })
        res.redirect("/")
    } catch (err: any) {
        res.headers({ "Content-Type": "text/html" })
        res.redirect(`/?error=${err.message}`)
    }
})

app.listen({ port: 8080 });


