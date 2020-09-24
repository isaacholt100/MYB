import { NextApiResponse } from "next";
import { failed } from "./helpers";

export default async (res: NextApiResponse, fn: (() => Promise<void>) | (() => void)) => {
    try {
        await fn();
    } catch (err) {
        console.error(err);
        res.status(Number.isNaN(+err.name) ? 500 : +err.name).end();
    }
}