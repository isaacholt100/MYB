import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
interface IUSer {
    user_id: ObjectId;
    [key: string]: any;
}
export default async (req: NextApiRequest & {user: any}, res: NextApiResponse) => {
    const accessHeader = req.headers["authorization"];
    const refreshHeader = req.headers["authorization-refresh"] as string;
    if (accessHeader && refreshHeader) {
        try {
            const accessToken = accessHeader.split(" ")[1];
            const refreshToken = refreshHeader.split(" ")[1];
            if (!accessToken || !refreshToken) {
                throw new Error();
            }
            if (req.cookies.httpRefreshToken !== refreshToken) {
                throw new Error();
            }
            const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN) as IUSer;
            jwt.verify(accessToken, process.env.ACCESS_TOKEN, (err, user: IUSer) => {
                if (user && user.user_id !== payload._id) {
                    throw err;
                }
                if (err) {
                    if (err.name === "TokenExpiredError") {
                        req.user = {
                            ...payload,
                            _id: new ObjectId(payload._id),
                        };
                        res.setHeader("authorization", jwt.sign(payload, process.env.ACCESS_TOKEN, {
                            expiresIn: "1m",
                        }));
                    } else {
                        throw err;
                    }
                } else {
                    req.user = {
                        ...payload,
                        user_id: new ObjectId(payload.user_id),
                    };
                }
            });
        } catch (err) {
            throw new Error("401");
        }
    } else {
        throw new Error("401");
    }
}