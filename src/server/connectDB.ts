import { Db, MongoClient } from "mongodb";

interface ICached {
    conn?: IConn;
    promise?: Promise<void>;
}
interface IConn {
    client?: MongoClient;
    db?: Db;
}

let cached: ICached = (global as any).mongo;
if (!cached) {
    cached = (global as any).mongo = {};
}

export default async () => {
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        cached.promise = (async () => {
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
            const conn: IConn = {};
            conn.client = client;
            conn.db = client.db("data");
            cached.conn = conn;
        })();
    }
    try {
        await cached.promise;
    } catch (err) {
        throw err;
    }
    return cached.conn;
}