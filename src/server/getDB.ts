import { Db, MongoClient } from "mongodb";
import url from "url";
let cachedDb = null;
export default async (db: string): Promise<Db> => {
    try {
        if (cachedDb) {
            console.log("cache");
            
            return cachedDb;
        }
        /*const client = new MongoClient("mongodb+srv://Isaac:paphIs-juqsib-kogvo8@testcluster.i2ddc.mongodb.net/data?retryWrites=true&w=majority", {
            useUnifiedTopology: true,
            //useNewUrlParser: true,
        });*/
        const client = await MongoClient.connect("mongodb+srv://Isaac:paphIs-juqsib-kogvo8@testcluster.i2ddc.mongodb.net/data?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });
        const db = client.db(url.parse("mongodb+srv://Isaac:paphIs-juqsib-kogvo8@testcluster.i2ddc.mongodb.net/data?retryWrites=true&w=majority").pathname.substr(1));
        cachedDb = db;
        return db;
    } catch (err) {
        //await client.close();
        throw err;
    }
}