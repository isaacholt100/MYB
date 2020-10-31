import connectDB from "./connectDB"

export default async () => {
    const { client } = await connectDB();
    return client.startSession();
}