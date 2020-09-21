import { MongoClient } from "mongodb";
import { NextApiRequest } from "next";
const client = new MongoClient(process.env.MONGODB_URI, {
    useUnifiedTopology: true,
});
export default async (db: string) => {
    try {
        await client.connect();
        return client.db(db);
    } catch (err) {
        await client.close();
        throw new Error("Mongodb failed to connect");
    }
}