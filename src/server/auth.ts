import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
export interface IUSer {
    _id: ObjectId;
    group_id: ObjectId;
    admin: boolean;
}
export default async function (req: NextApiRequest, res: NextApiResponse) {
    const accessHeader = req.headers["authorization"];
    let token: IUSer;
    if (!accessHeader) {
        console.log("no accessHeader");
        
        throw new Error("401");
    }
    try {
        let accessToken = accessHeader.split(" ")[1];
        if (accessToken === "undefined") {
            accessToken = req.cookies.accessToken;
        }
        if (!accessToken) {
            throw new Error("401");
        }
        jwt.verify(accessToken, `${process.env.ACCESS_TOKEN}`, (err, user: IUSer) => {
            if (!user || err) {
                if (err.name === "TokenExpiredError") {
                    const refreshHeader = req.headers["authorization-refresh"] as string;
                    if (!refreshHeader) {
                        throw new Error("401");
                    }
                    const refreshToken = refreshHeader.split(" ")[1];
                    if (req.cookies.httpRefreshToken !== refreshToken) {
                        throw new Error("401");
                    }
                    const payload = jwt.verify(refreshToken, `${process.env.REFRESH_TOKEN}`) as IUSer;
                    if (user && user._id !== payload._id) {
                        throw err;
                    }
                    res.setHeader("authorization", jwt.sign(payload, process.env.ACCESS_TOKEN, {
                        expiresIn: "20m",
                    }));
                    token = {
                        admin: payload.admin,
                        _id: new ObjectId(payload._id),
                        group_id: payload.group_id ? new ObjectId(payload.group_id) : undefined,
                    };
                } else {
                    throw err;
                }
            } else {
                token = {
                    admin: user.admin,
                    group_id: user.group_id ? new ObjectId(user.group_id) : undefined,
                    _id: new ObjectId(user._id),
                };
            }
        });
    } catch (err) {
        throw new Error("401");
    }
    return token;
}