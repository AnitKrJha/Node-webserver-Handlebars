import { FastifyInstance, RouteOptions } from "fastify";
import { insertTodo_in_db, delTodo_from_db, toggleTodo_in_db, Todo, seedDb } from "./utils.js";
export async function routes(app: FastifyInstance, options: RouteOptions) {
    app.get('/seed', async (req, res) => {
        const client = await app.pg.connect()
        try {
            const rows = await seedDb(client);
            console.log(rows);

            res.headers({ "Content-type": "text/html" })
            return res.view('modal.handlebars', { error: '', message: "Congrats the Data has been seeded!", Todos: rows }, { layout: 'layout.html' })

        } catch (e: any) {
            res.headers({ "Content-type": "text/html" })
            return res.view('modal.handlebars', { error: 'yes', message: "Unfortunately the Data cannot be seeded!", Todos: e.message }, { layout: 'layout.html' })

        } finally {
            client.release()
        }

    })
    app.get('/signin', (req, res) => {
        return res.view('signin.handlebars', {}, { layout: 'layout.html' })
    })


    interface IQueryString {
        error?: string;
    }
    interface IBodyCreateTodo {
        todo: string;
    }



    app.get<{ Querystring: IQueryString }>('/', async (request, response) => {
        const error = request.query.error || '';
        response.headers({ "content-type": "text/html" })
        const client = await app.pg.connect();
        let Todos: Todo[] = [];
        try {
            const { rows } = await client.query<Todo>(`select * from "Todos"`)
            Todos = rows
            console.table(Todos);
            return response.view('todoApp.handlebars', { Todos, error }, { layout: 'layout.html' })
        } catch (e: any) {
            return response.view('todoApp.handlebars', { Todos, error: e.message }, { layout: 'layout.html' })
        }
        finally {

            client.release();
        }
    })

    app.post<{ Body: IBodyCreateTodo }>('/create', async (req, res) => {

        const client = await app.pg.connect();
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

            // Add the 'todo' to your data store or perform relevant operations to the database
            insertTodo_in_db(todoFromBody, client);

            // Redirect to the home page
            res.redirect('/');
        } catch (error: any) {
            // If an error occurs during the try block, handle it here
            res.headers({ "Content-Type": "text/html" });

            // Redirect to the home page with an error message based on the error's message
            res.redirect(`/?error=${error.message}`);
        } finally {
            client.release()
        }
    });

    // This route handles POST requests to the `/delete/:id` endpoint.
    app.post<{ Params: { id: string } }>('/delete/:id', async (req, res) => {
        const client = await app.pg.connect();
        try {
            // Get the `id` parameter from the request.
            const { id } = req.params;

            // Delete the todo item with the given `id`.
            await delTodo_from_db(id, client);

            // Set the response content type to `text/html`.
            res.headers({ 'Content-Type': 'text/html' });

            // Redirect the user to the home page.
            res.redirect('/');
        } catch (e: any) {
            // If an error occurs, set the response content type to `text/html` and redirect the user to the home page with an error message.
            res.headers({ 'Content-Type': 'text/html' });
            res.redirect(`/?error=${e.message}`);
        } finally {
            client.release();
        }
    });

    app.post<{ Params: { id: string } }>('/toggle/:id', async (req, res) => {
        const client = await app.pg.connect()
        try {
            const { id } = req.params;
            await toggleTodo_in_db(id, client);
            res.headers({ "Content-type": "text/html" })
            res.redirect("/")
        } catch (err: any) {
            res.headers({ "Content-Type": "text/html" })
            res.redirect(`/?error=${err.message}`)
        } finally {
            client.release()
        }
    })
}