import { Db, MongoClient } from "mongodb";
let cachedDb: Db = null;
export default async (name: string) => {
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
    //throw new Error("402");
    //console.log(client.db("test", {
        
    //}));
    
    const db = client.db(name);
    cachedDb = db;
    return db;
}