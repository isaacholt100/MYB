import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import auth from "../../server/auth";
import getDB from "../../server/getDB";
import { didUpdate, notAllowed } from "../../server/helpers";
import tryCatch from "../../server/tryCatch";

export default (req: NextApiRequest, res: NextApiResponse) => tryCatch(res, async () => {
    switch (req.method) {
        case "GET": {
            const { group_id } = await auth(req, res);
            const db = await getDB();
            const users = db.collection("users");
            const members = await users.find({ group_id }, { projection: { group_id: 0, email: 0, password: 0, }}).toArray();
            res.json(members);
            break;
        }
        case "DELETE": {
            const { group_id, admin } = await auth(req, res);
            if (!admin) {
                throw new Error("403");
            }
            const db = await getDB();
            const users = db.collection("users");
            const _id = new ObjectId(req.body._id as string);
            const r = await users.updateOne({ _id, group_id }, {
                $set: {
                    group_id: null,
                }
            });
            didUpdate(res, r.modifiedCount);
            break;
        }
        default: {
            notAllowed(res);
        }
    }
});