import { NextApiRequest, NextApiResponse } from "next";
import auth from "../../../server/auth";
import getDB from "../../../server/getDB";
import { notAllowed } from "../../../server/helpers";
import tryCatch from "../../../server/tryCatch";

export default (req: NextApiRequest, res: NextApiResponse) => tryCatch(res, async () => {
    switch (req.method) {
        case "GET": {
            const { group_id } = await auth(req, res);
            const db = await getDB();
            const groups = db.collection("groups");
            const group = await groups.findOne({ _id: group_id });
            if (!group) {
                throw new Error("Group not found");
            }
            res.json(group);
            break;
        }
        default: {
            notAllowed(res);
        }
    }
});