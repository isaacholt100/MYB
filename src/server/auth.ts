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
                    //console.log(req.cookies.httpRefreshToken, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiX2lkIjoiNWZhMzFhZjkwYzkxMmYyZDI0NTBkOTNlIiwiZ3JvdXBfaWQiOiI1ZmEzMWFmOTBjOTEyZjJkMjQ1MGQ5M2QiLCJpYXQiOjE2MDQ1NjM3MzZ9.2a1wfnyLhisv4deXoeSSBQH_v3D17kYt5gFiIZHblDc");
                    
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
                    res.setHeader("authorization", jwt.sign(payload, process.env.ACCESS_TOKEN, {
                        expiresIn: "1m",
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
        throw new Error("403");
    }
    return token;
}