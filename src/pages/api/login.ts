import { NextApiRequest, NextApiResponse } from "next";
import getDB from "../../server/getDB";
import { done, errors, notAllowed } from "../../server/helpers";
import tryCatch from "../../server/tryCatch";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { IUSer } from "../../server/auth";
import { setRefreshToken } from "../../server/cookies";

export default (req: NextApiRequest, res: NextApiResponse) => tryCatch(res, async () => {
    switch (req.method) {
        case "POST": {
            //throw new Error("Test error");
				console.log("user");
            const
                db = await getDB(),
                users = db.collection("users"),
                { password, email } = req.body,
                user = await users.findOne({ email });
            if (!user) {
                errors(res, {
                    emailError: "Email not found",
                });
            } else {
                const valid = await bcrypt.compare(password, user.password);
                if (valid) {
                    const jwtInfo: IUSer = {
                        admin: user.admin,
                        _id: user._id,
                        group_id: user.group_id,
                    };
                    const refreshToken = jwt.sign(jwtInfo, process.env.REFRESH_TOKEN);
                    setRefreshToken(res, refreshToken);
                    res.json({
                        ...user,
                        accessToken: jwt.sign(jwtInfo, process.env.ACCESS_TOKEN, {
                            expiresIn: "1m",
                        }),
                        refreshToken,
                    });
                } else {
                    errors(res, {
                        passwordError: "Password is incorrect",
                    });
                }
            }
            break;
        }
        case "GET": {
            res.json(Boolean(req.cookies.refreshToken && req.cookies.httpRefreshToken && req.cookies.accessToken));
            break;
        }
        case "DELETE": {
            res.setHeader("Set-Cookie", serialize("httpRefreshToken", "", {
                maxAge: -1,
                httpOnly: true,
                sameSite: "strict",
            }));
            done(res);
            break;
        }
        default: {
            notAllowed(res);
            break;
        }
    }
});