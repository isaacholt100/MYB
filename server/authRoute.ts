import jwt from "next-auth/jwt";
import { NextApiRequest, NextApiResponse } from "next-auth/_utils";
export default (fn: (req: NextApiRequest, res: NextApiResponse) => void) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        const token = await jwt.getToken({ req, secret: process.env.ACCESS_TOKEN });
        if (token) {
            fn(req, res);
        } else {
            res.status(401).json("401 error");
        }
    }
}