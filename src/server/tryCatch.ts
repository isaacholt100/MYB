import { NextApiResponse } from "next";
import { failed } from "./helpers";

export default async (res: NextApiResponse, fn: (() => Promise<void>) | (() => void)) => {
    try {
        await fn();
    } catch (err) {
        console.error(err);
        res.status(+(err.name || "500")).send("failed");
    }
}