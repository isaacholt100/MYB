import { NextApiRequest, NextApiResponse } from "next";
import getDB from "../../server/getDB";
import getUser from "../../server/getUser";
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
            const
                db = await getDB("data"),
                users = db.collection("users"),
                { password, staySignedIn, email } = req.body,
                isUser = await users.findOne({ email }, { projection: { password: 1 } });
            if (!isUser) {
                errors(res, {
                    emailError: "Email not found",
                });
            } else {
                const user = await getUser(isUser._id, users);
                const valid = await bcrypt.compare(password, isUser.password);
                if (valid) {
                    const jwtInfo: IUSer = {
                        role: user.role,
                        _id: user._id,
                        school_id: user.school_id,
                    };
                    const refreshToken = jwt.sign(jwtInfo, process.env.REFRESH_TOKEN);
                    setRefreshToken(res, refreshToken);
                    res.json({
                        userInfo: {
                            role: user.role,
                            _id: user._id,
                            //name: user.firstName + (user.role === "student" ? "" : " " + user.lastName),
                            icon: user.icon,
                            name: user.firstName + " " + user.lastName,
                            email,
                        },
                        timetable: user.timetable,
                        theme: user.theme,
                        carouselView: user.carouselView,
                        reminders: user.reminders,
                        classes: user.classes,
                        chats: user.chats,
                        books: user.books,
                        users: user.users,
                        accessToken: jwt.sign(jwtInfo, process.env.ACCESS_TOKEN, {
                            expiresIn: "20m",
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
            res.setHeader("Set-Cookie", [serialize("httpRefreshToken", "", {
                maxAge: -1,
                httpOnly: true,
                sameSite: "strict",
            })]);
            done(res);
            break;
        }
        default: {
            notAllowed(res);
            break;
        }
    }
});