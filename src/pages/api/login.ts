import { NextApiRequest, NextApiResponse } from "next";
import getDB from "../../server/getDB";
import getUser from "../../server/getUser";
import { errors, notAllowed } from "../../server/helpers";
import tryCatch from "../../server/tryCatch";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default (req: NextApiRequest, res: NextApiResponse) => tryCatch(res, async () => {
    if (req.method === "POST") {
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
                res.setHeader("Set-Cookie", `refreshToken=${refreshToken}; Max-Age=${4e12}; HttpOnly`);
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
    } else if (req.method === "GET") {
        res.json({loggedIn: Boolean(req.cookies.refresh && req.cookies.refreshToken && req.cookies.accessToken)});
    } else {
        notAllowed(res);
    }
});