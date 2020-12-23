import { NextApiRequest, NextApiResponse } from "next";
import auth from "../../../../server/auth";
import getDB from "../../../../server/getDB";
import { done, notAllowed } from "../../../../server/helpers";
import tryCatch from "../../../../server/tryCatch";

export default (req: NextApiRequest, res: NextApiResponse) => tryCatch(res, async () => {
    switch (req.method) {
        case "PUT": {
            console.log(req.body.quote);
            
            if (!req.body.quote || req.body.quote.length > 150) {
                throw new Error("Name too long");
            }
            console.log("ok");
            
            const { _id } = await auth(req, res);
            const db = await getDB();
            const users = db.collection("users");
            await users.updateOne({ _id }, {
                $set: {
                    quote: req.body.quote.replace(/\n{2,}/g, "\n"),
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