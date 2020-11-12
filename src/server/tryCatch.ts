import { NextApiResponse } from "next";

export default async (res: NextApiResponse, fn: (() => Promise<void>) | (() => void)) => {
    try {
        await fn();
    } catch (err) {
        console.error("error:");
        console.error(err);
        res.status(Number.isNaN(+err.message) ? 500 : +err.message).json({
            err: err.toString(),
        });
    }
}