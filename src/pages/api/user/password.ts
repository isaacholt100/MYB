import { NextApiRequest, NextApiResponse } from "next";
import { done, errors, notAllowed } from "../../../server/helpers";
import tryCatch from "../../../server/tryCatch";
import bcrypt from "bcrypt";
import getDB from "../../../server/getDB";
import auth from "../../../server/auth";

const SALT_ROUNDS = 12;

export default (req: NextApiRequest, res: NextApiResponse) => tryCatch(res, async () => {
    switch (req.method) {
        case "PUT": {
            const { newPassword, oldPassword } = req.body;
            if (!newPassword || newPassword.length < 6) {
                errors(res, {
                    newPasswordError: "Password must at least 6 characters",
                });
            } else {
                const { _id } = await auth(req, res);
                const db = await getDB();
                const users = db.collection("users");
                const valid = await bcrypt.compare(oldPassword, (await users.findOne({ _id }, {projection: { password: 1, _id: 0 }}))?.password);
                if (valid) {
                    await users.updateOne({ _id }, {
                        $set: {
                            password: await bcrypt.hash(newPassword, SALT_ROUNDS),
                        },
                    });
                    done(res);
                } else {
                    errors(res, {
                        oldPasswordError: "Password is incorrect",
                    });
                }
            }
            break;
        }
        default: {
            notAllowed(res);
        }
    }
});