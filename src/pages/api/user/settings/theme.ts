import { NextApiRequest, NextApiResponse } from "next";
import auth from "../../../../server/auth";
import getDB from "../../../../server/getDB";
import { didUpdate, done } from "../../../../server/helpers";
import tryCatch from "../../../../server/tryCatch";

export default (req: NextApiRequest, res: NextApiResponse) => tryCatch(res, async () => {
    const user = await auth(req, res);
    const db = await getDB("data");
    const users = db.collection("users");
    if (["theme.primary", "theme.secondary", "theme.type", "theme.fontFamily", "theme"].includes(req.body.path)) {
        const r = await users.updateOne({ _id: user._id }, {
            $set: {
                [req.body.path]: req.body.val,
            },
        });
        done(res);
    } else {
        throw new Error("Invalid theme path");
    }
});