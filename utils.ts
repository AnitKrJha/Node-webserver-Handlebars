import { fileURLToPath } from 'node:url'
import { randomUUID } from 'node:crypto'
import { dirname } from 'node:path'
import { ClientBase, PoolClient } from 'pg';

export const __filepath = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filepath);
export type Todo = {
	id: string,
	todo: string,
	status: "Pending" | "Completed"
};

export async function insertTodo_in_db(todo: string, client: PoolClient) {
	const newId = randomUUID();
	const newTodo: Todo = { id: newId, todo: todo, status: 'Pending' };
	await client.query(`INSERT INTO "Todos" (todo, status)
	VALUES ($1, $2)`, [newTodo.todo, newTodo.status])
}

export async function delTodo_from_db(id: string, client: PoolClient) {
	await client.query(`DELETE FROM "Todos"
	WHERE id = $1;
	`, [id])
}

export async function toggleTodo_in_db(id: string, client: PoolClient) {

	const { rows } = await client.query<{ status: 'Pending' | 'Completed' }>(`Select status from "Todos" WHERE id =$1`, [id]);

	if (rows.length === 0) {
		throw new Error("No todo with this id exists")
	}
	const newStatus = rows[0].status === 'Completed' ? 'Pending' : 'Completed';
	await client.query(`UPDATE "Todos"
	SET status = $1
	WHERE id = $2;
	`, [newStatus, id]);

}


export async function seedDb(client: PoolClient) {
	const { rows } = await client.query(`INSERT INTO "Todos" (todo, status)
	VALUES 
	( 'Work on coding project', 'Pending'),
	( 'Review web server architecture', 'Completed'),
	( 'Learn Rust programming language', 'Pending'),
	( 'Explore Go (Golang) development', 'Completed'),
	( 'Complete technical blog post', 'Pending');
	`)
	console.log(rows);

	return rows
}

export let Todos: Array<Todo> = [
	{
		id: "a6b548e0-7b7a-4f6f-8423-89e834b5c85e",
		todo: "Work on coding project",
		status: "Pending"
	},
	{
		id: "c2f2d8b5-3bfa-4f23-a859-abc465e76f37",
		todo: "Review web server architecture",
		status: "Completed"
	},
	{
		id: "e9a1c786-f6ef-4d4e-9d90-98454aa15c29",
		todo: "Learn Rust programming language",
		status: "Pending"
	},
	{
		id: "2b3f87d3-2e3a-47f9-9c91-4fca04f907f0",
		todo: "Explore Go (Golang) development",
		status: "Completed"
	},
	{
		id: "75d1f452-8f14-4b02-832b-5b4cfe5c20b3",
		todo: "Completed technical blog post",
		status: "Pending"
	}
];