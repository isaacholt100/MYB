import { NextApiRequest, NextApiResponse } from "next";
import auth from "../../../server/auth";
import getDB from "../../../server/getDB";
import { done, errors, notAllowed } from "../../../server/helpers";
import tryCatch from "../../../server/tryCatch";
import Sentiment from "sentiment";
import { ObjectId } from "mongodb";

const SENTIMENT_THRESHOLD = 0;

export default (req: NextApiRequest, res: NextApiResponse) => tryCatch(res, async () => {
    switch (req.method) {
        case "POST": {
            const { _id, admin, group_id } = await auth(req, res);
            const db = await getDB();
            const prizes = db.collection("prizes");
            //if (admin) {
            const sentiment = new Sentiment();
            const result = sentiment.analyze(req.body.name);
            if (result.comparative < SENTIMENT_THRESHOLD || req.body.name === "") {
                errors(res, "Sentiment analysis suggests this is too negative to be a prize name");
            } else {
                const count = await prizes.countDocuments({ group_id, name: req.body.name });
                if (count > 0) {
                    errors(res, "A prize with this name already exists");
                } else {
                    const obj = {
                        group_id,
                        name: req.body.name,
                        owner_id: _id,
                        accepted: admin ? true : null,
                        poll: [],
                        icon: req.body.icon || "",
                    };
                    await prizes.insertOne(obj);
                    res.json(obj);
                }
            }
            break;
        }
        case "GET": {
            const { group_id, admin, _id } = await auth(req, res);
            const db = await getDB();
            const prizes = db.collection("prizes");
            const list = await prizes.find({ group_id, ...(admin ? {} : {
                $or: [{
                    accepted: true,
                }, {
                    owner_id: _id,
                }]
            }) }).toArray();
            res.json(list);
            break;
        }
        case "DELETE": {
            const { group_id, admin } = await auth(req, res);
            if (!admin) {
                throw new Error("403");
            }
            const db = await getDB();
            const prizes = db.collection("prizes");
            await prizes.deleteOne({ group_id, _id: new ObjectId(req.body._id) });
            done(res);
            break;
        }
        case "PUT": {
            const { group_id, admin } = await auth(req, res);
            if (!admin) {
                throw new Error("403");
            }
            const db = await getDB();
            const prizes = db.collection("prizes");
            await prizes.updateOne({ group_id, _id: new ObjectId(req.body._id) }, {
                $set: {
                    accepted: true,
                }
            });
            done(res);
            break;
        }
        default: {
            notAllowed(res);
        }
    }
});