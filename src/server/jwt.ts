import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
interface IUSer {
    user_id: ObjectId;
    [key: string]: any;
}
export default async (req: NextApiRequest, res: NextApiResponse) => {
    const accessHeader = req.headers["authorization"];
    if (accessHeader) {
        try {
            const accessToken = accessHeader.split(" ")[1];
            if (!accessToken) {
                throw new Error();
            }
            jwt.verify(accessToken, process.env.ACCESS_TOKEN, (err, user: IUSer) => {
                if (err) {
                    if (err.name === "TokenExpiredError") {
                        const refreshHeader = req.headers["authorization-refresh"] as string;
                        const refreshToken = refreshHeader.split(" ")[1];
                        if (req.cookies.httpRefreshToken !== refreshToken) {
                            throw new Error();
                        }
                        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN) as IUSer;
                        if (user.user_id !== payload.user_id) {
                            throw err;
                        }
                        res.setHeader("authorization", jwt.sign(payload, process.env.ACCESS_TOKEN, {
                            expiresIn: "20m",
                        }));
                        return {
                            ...payload,
                            user_id: new ObjectId(payload.user_id),
                        };
                    } else {
                        throw err;
                    }
                } else {
                    return {
                        ...user,
                        user_id: new ObjectId(user.user_id),
                    };
                }
            });
        } catch (err) {
            throw new Error("403");
        }
    } else {
        throw new Error("401");
    }
}