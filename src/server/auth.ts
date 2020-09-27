import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
export interface IUSer {
    _id: ObjectId;
    school_id: ObjectId;
    role: "student" | "teacher" | "admin";
}
export default async function (req: NextApiRequest, res: NextApiResponse) {
    const accessHeader = req.headers["authorization"];
    let token: IUSer;
    if (!accessHeader) {
        throw new Error("401");
    }
    try {
        const accessToken = accessHeader.split(" ")[1];
        if (!accessToken) {
            throw new Error("401");
        }
        jwt.verify(accessToken, `${process.env.ACCESS_TOKEN}`, (err, user: IUSer) => {
            if (!user || err) {
                if (err.name === "TokenExpiredError") {
                    const refreshHeader = req.headers["authorization-refresh"] as string;
                    if (!refreshHeader) {
                        throw new Error("403");
                    }
                    const refreshToken = refreshHeader.split(" ")[1];
                    if (req.cookies.httpRefreshToken !== refreshToken) {
                        throw new Error("403");
                    }
                    const payload = jwt.verify(refreshToken, `${process.env.REFRESH_TOKEN}`) as IUSer;
                    if (user && user._id !== payload._id) {
                        throw err;
                    }
                    const jwtInfo: IUSer = {
                        _id: payload._id,
                        school_id: payload.school_id,
                        role: payload.role,
                    }
                    res.setHeader("authorization", jwt.sign(jwtInfo, process.env.ACCESS_TOKEN, {
                        expiresIn: "20m",
                    }));
                    token = {
                        role: payload.role,
                        _id: new ObjectId(payload._id),
                        school_id: payload.school_id ? new ObjectId(payload.school_id) : undefined,
                    };
                } else {
                    throw err;
                }
            } else {
                token = {
                    role: user.role,
                    school_id: user.school_id ? new ObjectId(user.school_id) : undefined,
                    _id: new ObjectId(user._id),
                };
            }
        });
    } catch (err) {
        throw new Error("403");
    }
    return token;
}