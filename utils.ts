import { fileURLToPath } from 'node:url'
import { randomUUID } from 'node:crypto'
import { dirname } from 'node:path'

export const __filepath = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filepath);
export type Todo = {
	id: string,
	todo: string,
	status: "Pending" | "Complete"
};

export function addTodo(todo: string) {
	const newId = randomUUID();
	const newTodo: Todo = { id: newId, todo: todo, status: 'Pending' };
	Todos = [...Todos, newTodo];
}

export function delTodo(id: string) {
	Todos = Todos.filter((todo) => todo.id != id);
}

export function toggleStatus(id: string) {
	const todo = Todos.find(todo => todo.id === id);
	if (todo) {
		const newStatus = todo.status === 'Complete' ? 'Pending' : 'Complete';
		Object.assign(todo, { status: newStatus });
	} else {
		throw new Error("The todo with the given id does not exist")
	}
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
		status: "Complete"
	},
	{
		id: "e9a1c786-f6ef-4d4e-9d90-98454aa15c29",
		todo: "Learn Rust programming language",
		status: "Pending"
	},
	{
		id: "2b3f87d3-2e3a-47f9-9c91-4fca04f907f0",
		todo: "Explore Go (Golang) development",
		status: "Complete"
	},
	{
		id: "75d1f452-8f14-4b02-832b-5b4cfe5c20b3",
		todo: "Complete technical blog post",
		status: "Pending"
	}
];