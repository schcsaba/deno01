import { MongoClient, Database, ObjectId, Collection } from "https://deno.land/x/mongo@v0.31.2/mod.ts";

const MONGODB_URI = `mongodb+srv://${Deno.env.get('MONGODB_USERNAME')}:${Deno.env.get('MONGODB_PASSWORD')}@nodejs01-mongo.eg2g7ue.mongodb.net/?authMechanism=SCRAM-SHA-1`;
let db: Database;

export interface TodoDbSchema {
    _id?: ObjectId | string;
    text: string;
}

// CORE FEATURES

export async function connect() {
    const client = new MongoClient();
    await client.connect(MONGODB_URI);
    console.log('We are connected to the database', '\n');
    db = client.database("udemy_nodejs_todos_api");
}

export const getDb = () => db;

function getTodosCollection(): Collection<TodoDbSchema> {
    const db = getDb();
    return db.collection<TodoDbSchema>("todos");
}

// FUNCTIONAL FEATURES

export async function getAllTodos(): Promise<TodoDbSchema[]> {
    return await getTodosCollection().find().toArray();
}

export async function insertOneTodo(todo: TodoDbSchema): Promise<ObjectId> {
    return await getTodosCollection().insertOne(todo) as ObjectId;
}

export async function updateOneTodo(todoId: string, todo: TodoDbSchema): Promise<boolean> {
    const result = await getTodosCollection().updateOne({ _id: new ObjectId(todoId) }, { $set: todo });
    return result.modifiedCount > 0;
}

export async function deleteOneTodo(todoId: string): Promise<number> {
    return await getTodosCollection().deleteOne({ _id: new ObjectId(todoId) });
}