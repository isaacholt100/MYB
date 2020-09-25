import { NextApiResponse } from "next";
import { failed } from "./helpers";

export default async (res: NextApiResponse, fn: (() => Promise<void>) | (() => void)) => {
    try {
        await fn();
    } catch (err) {
        console.log({err});
        res.status(Number.isNaN(+err.message) ? 500 : +err.message).json({err: err.message});
    }
}