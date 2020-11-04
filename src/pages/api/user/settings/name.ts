import { NextApiRequest, NextApiResponse } from "next";
import auth from "../../../../server/auth";
import getDB from "../../../../server/getDB";
import { didUpdate, notAllowed } from "../../../../server/helpers";
import tryCatch from "../../../../server/tryCatch";

export default (req: NextApiRequest, res: NextApiResponse) => tryCatch(res, async () => {
    switch (req.method) {
        case "PUT": {
            if (!req.body.name || req.body.name.length > 50) {
                throw new Error("Name too long");
            }
            const { _id } = await auth(req, res);
            const db = await getDB();
            const users = db.collection("users");
            const r = await users.updateOne({ _id }, {
                $set: {
                    name: req.body.name,
                },
            });
            didUpdate(res, r.modifiedCount);
            break;
        }
        default: {
            notAllowed(res);
        }
    }
});