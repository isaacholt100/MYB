import { NextApiRequest, NextApiResponse } from "next";
import auth from "../../server/auth";
import getDB from "../../server/getDB";
import { notAllowed } from "../../server/helpers";
import tryCatch from "../../server/tryCatch";

export default (req: NextApiRequest, res: NextApiResponse) => tryCatch(res, async () => {
    switch (req.method) {
        case "GET": {
            const { group_id } = await auth(req, res);
            const db = await getDB();
            const users = db.collection("users");
            const members = await users.find({ group_id }).toArray();
            res.json(members);
            break;
        }
        default: {
            notAllowed(res);
        }
    }
});