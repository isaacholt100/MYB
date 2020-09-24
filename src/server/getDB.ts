import { MongoClient } from "mongodb";
const client = new MongoClient("mongodb+srv://Isaac:paphIs-juqsib-kogvo8@testcluster.i2ddc.mongodb.net/data?retryWrites=true&w=majority", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});
export default async (db: string) => {
    try {
        await client.connect();
        return client.db(db);
    } catch (err) {
        await client.close();
        throw err;
    }
}