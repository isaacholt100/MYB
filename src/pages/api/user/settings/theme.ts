import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import auth from "../../../../server/auth";
import getDB from "../../../../server/getDB";
import { didUpdate, done, notAllowed } from "../../../../server/helpers";
import tryCatch from "../../../../server/tryCatch";

export default (req: NextApiRequest, res: NextApiResponse) => tryCatch(res, async () => {
    switch (req.method) {
        case "PUT": {
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
            break;
        }
        case "GET": {
            const users = (await getDB("data")).collection("users");
            res.json((await users.findOne({ _id: new ObjectId(req.cookies.user_id) }, { projection: { theme: 1, _id: 0 } })).theme);
            break;
        }
        default: {
            notAllowed(res);
        }
    }
});