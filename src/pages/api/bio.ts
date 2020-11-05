import { ObjectId } from "mongodb";
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
            const user = await users.findOne({ group_id, _id: new ObjectId(req.query.id as string) });
            if (!user) {
                throw new Error("User not found");
            }
            res.json(user);
            break;
        }
        default: {
            notAllowed(res);
        }
    }
});