import { NextApiRequest, NextApiResponse } from "next";
import getDB from "../../server/getDB";
import getUser from "../../server/getUser";
import { done, errors, notAllowed } from "../../server/helpers";
import tryCatch from "../../server/tryCatch";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { clearCookies, setCookies } from "../../server/cookies";
import Cookies from "js-cookie";

export default (req: NextApiRequest, res: NextApiResponse) => tryCatch(res, async () => {
    switch (req.method) {
        case "POST":
            const
                db = await getDB("data"),
                users = db.collection("users"),
                { password, staySignedIn, email } = req.body,
                isUser = await users.findOne({ email }, {projection: {password: 1}});
            if (!isUser) {
                errors(res, {
                    emailError: "Email not found",
                });
            } else {
                const user = await getUser(isUser._id, users);
                const valid = await bcrypt.compare(password, isUser.password);
                if (valid) {
                    const jwtInfo = {
                        email,
                        role: user.role,
                        user_id: user._id,
                        school_id: user.school_id,
                    };
                    const refreshToken = jwt.sign(jwtInfo, process.env.REFRESH_TOKEN);
                    const accessToken = jwt.sign(jwtInfo, process.env.ACCESS_TOKEN, {
                        expiresIn: "20m",
                    });
                    res.setHeader("Set-Cookie", [cookie.serialize("httpRefreshToken", refreshToken, {
                        httpOnly: true,
                        sameSite: "strict",
                        ...(staySignedIn ? { maxAge: 1000000000000000 } : {})
                    })]);
                    /*setCookies(res, ["httpRefreshToken", refreshToken, {
                        sameSite: "strict",
                        httpOnly: true,
                        secure: true,
                        ...extra
                    }], ["accessToken", accessToken, {
                        //sameSite: "strict",
                        //secure: true,
                        path: "/",
                    }], ["refreshToken", refreshToken, {
                        //sameSite: "strict",
                        //secure: true,
                        path: "/",
                    }]);*/
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
                        accessToken,
                        refreshToken,
                    });
                } else {
                    errors(res, {
                        passwordError: "Password is incorrect",
                    });
                }
            }
            break;
        case "GET":
            res.json(Boolean(req.cookies.refreshToken && req.cookies.httpRefreshToken && req.cookies.accessToken));
            break;
        case "DELETE":
            res.setHeader("Set-Cookie", [cookie.serialize("httpRefreshToken", '', {
                maxAge: -1,
                httpOnly: true,
                sameSite: "strict",
              })]);
            done(res);
            break;
        default:
            notAllowed(res);
            break;
    }
});