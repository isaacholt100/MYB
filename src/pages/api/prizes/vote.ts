import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import auth from "../../../server/auth";
import getDB from "../../../server/getDB";
import { notAllowed } from "../../../server/helpers";
import tryCatch from "../../../server/tryCatch";

export default (req: NextApiRequest, res: NextApiResponse) => tryCatch(res, async () => {
    switch (req.method) {
        case "POST": {
            const { group_id, _id } = await auth(req, res);
            if (!req.body.votes || req.body.votes.length !== 3 || req.body.votes.includes(_id + "")) {
                throw new Error("400");
            }
            const db = await getDB();
            const prizes = db.collection("prizes");
            const obj = {
                _id: new ObjectId(),
                user_id: _id,
                votes: req.body.votes.map(v => new ObjectId(v))
            };
            if ((await prizes.countDocuments({ group_id, _id: new ObjectId(req.body._id), poll: { $elemMatch: {user_id: _id} } })) > 0) {
                throw new Error("400");
            }
            await prizes.updateOne({ group_id, _id: new ObjectId(req.body._id) }, {
                $push: {
                    poll: obj
                }
            });
            res.json(obj);
            break;
        }
        default: {
            notAllowed(res);
        }
    }
});