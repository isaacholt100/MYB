import { NextApiRequest, NextApiResponse } from "next";
import auth from "../../../../server/auth";
import getDB from "../../../../server/getDB";
import { done, notAllowed } from "../../../../server/helpers";
import tryCatch from "../../../../server/tryCatch";

export default (req: NextApiRequest, res: NextApiResponse) => tryCatch(res, async () => {
    switch (req.method) {
        case "PUT": {
            if (!req.body.name || req.body.name.length > 50 || req.body.name?.split(" ").some(w => w.length >= 40)) {
                throw new Error("Name too long");
            }
            const { _id } = await auth(req, res);
            const db = await getDB();
            const users = db.collection("users");
            await users.updateOne({ _id }, {
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