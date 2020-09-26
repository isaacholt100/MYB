import { Db, MongoClient } from "mongodb";
let cachedDb: Db = null;
export default async (name: string) => {
    if (cachedDb) {
        return cachedDb;
    }
    const client = new MongoClient("mongodb+srv://Isaac:paphIs-juqsib-kogvo8@testcluster.i2ddc.mongodb.net/data?authSource=admin&replicaSet=atlas-nutwo7-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true", {
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