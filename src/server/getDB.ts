import { Db } from "mongodb";
import connectDB from "./connectDB"

/*import { ClientSession, Db, MongoClient } from "mongodb";

let cachedDb: Db = null;

export default async (name: string): Promise<Db> => {
    if (cachedDb) {
        return cachedDb;
    }
    const client = new MongoClient(process.env.MONGODB_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    });
    try {
        await client.connect();
    } catch (err) {
        await client.close();
        throw err;
    }
    const db = client.db(name);
    cachedDb = db;
    return db;
}*/
export default async (): Promise<Db> => {
    return (await connectDB()).db;
}