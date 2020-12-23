import { NextApiRequest, NextApiResponse } from "next";
import auth from "../../../server/auth";
import getDB from "../../../server/getDB";
import { done, notAllowed } from "../../../server/helpers";
import tryCatch from "../../../server/tryCatch";

export default (req: NextApiRequest, res: NextApiResponse) => tryCatch(res, async () => {
    switch (req.method) {
        case "PUT": {
            if (!req.body.name || req.body.name.length > 50) {
                throw new Error("Name too long");
            }
            const { _id, group_id } = await auth(req, res);
            const db = await getDB();
            const groups = db.collection("groups");
            await groups.updateOne({ _id: group_id, admin_id: _id }, {
                $set: {
                    name: req.body.name,
                },
            });
            done(res);
            break;
        }
        default: {
            notAllowed(res);
        }
    }
});