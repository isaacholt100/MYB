import { NextApiRequest, NextApiResponse } from "next";
import { didUpdate, errors, notAllowed } from "../../../server/helpers";
import tryCatch from "../../../server/tryCatch";
import bcrypt from "bcrypt";
import getDB from "../../../server/getDB";
import auth, { IUSer } from "../../../server/auth";
import { Collection, InsertOneWriteOpResult, ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import cookie from "cookie";
import getUser from "../../../server/getUser";
import { setRefreshToken } from "../../../server/cookies";
import getSession from "../../../server/getSession";

const SALT_ROUNDS = 12;

export default (req: NextApiRequest, res: NextApiResponse) => tryCatch(res, async () => {
    switch (req.method) {
        case "POST": {
            type Errors = Partial<Record<"groupID" | "repeatPassword" | "password" | "name" | "email", string>>;
            const
                db = await getDB(),
                users = db.collection("users"),
                groups = db.collection("groups"),
                {
                    password,
                    name,
                    create,
                    repeatPassword,
                    groupID,
                    email
                } = req.body,
                emailCount = await users.countDocuments({ email }),
                errors: Errors = {};
            const group_idCount = create
                ? 1
                : await groups.countDocuments({
                    _id: ObjectId.isValid(groupID)
                        ? new ObjectId(groupID)
                        : ""
                });
            if (groupID && group_idCount === 0) {
                errors.groupID = "Group not found";
            }
            if (password !== repeatPassword) {
                errors.repeatPassword = "Passwords must match";
            }
            if (password.length < 6) {
                errors.password = "Password must at least 6 characters";
            }
            if (name === "") {
                errors.name = "Field required";
            }
            if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
                errors.email = "Email address invalid";
            } else if (emailCount > 0) {
                errors.email = "Email address is already taken";
            }
            if (Object.keys(errors).length === 0) {
                const session = await getSession();
                let success = false;
                try {
                    await session.withTransaction(async () => {
                        const hash = await bcrypt.hash(password, SALT_ROUNDS);
                        const r1 = create
                        ? await groups.insertOne({ admin: email, name: groupID }, { session })
                        : {
                            insertedCount: 1,
                            insertedId: new ObjectId(groupID),
                        },
                        r = await users.insertOne({
                            group_id: r1.insertedId,
                            email,
                            pic: "",
                            admin: create,
                            name,
                            password: hash,
                            quote: "",
                        });
                        if (r.insertedCount === 1 && r1.insertedCount === 1) {
                            const jwtInfo: IUSer = {
                                admin: create,
                                _id: r.insertedId,
                                group_id: create ? (r1 as InsertOneWriteOpResult<any>).insertedId : new ObjectId(groupID),
                            };
                            const refreshToken = jwt.sign(jwtInfo, process.env.REFRESH_TOKEN);
                            setRefreshToken(res, refreshToken);
                            res.json({
                                accessToken: jwt.sign(jwtInfo, process.env.ACCESS_TOKEN, {
                                    expiresIn: "20m",
                                }),
                                refreshToken,
                                user_id: r.insertedId
                            });
                        } else {
                            throw new Error("");
                        }
                    });
                } catch (err) {
                    throw err;
                } finally {
                    session.endSession();
                }
            } else {
                res.json({
                    errors
                });
            }
            break;
        }
        case "GET": {
            const { _id } = await auth(req, res);
            const db = await getDB();
            const users = db.collection("users");
            const user = await users.findOne({ _id });
            if (!user) {
                throw new Error("User not found");
            }
            res.json(user);
            break;
        }
        case "DELETE": {
            const user = await auth(req, res);
            const db = await getDB();
            const users = db.collection("users");
            const valid = await bcrypt.compare(req.body.password, (await users.findOne({
                _id: user._id
            }, {
                projection: {
                    password: 1,
                    _id: 0
                }
            }))?.password);
            if (valid) {
                const r = await users.deleteOne({_id: user._id});
                didUpdate(res, r.deletedCount);
            } else {
                errors(res, "Incorrect Password");
            }
            break;
        }
        default: {
            notAllowed(res);
        }
    }
});