import { NextApiRequest, NextApiResponse } from "next";
import { notAllowed } from "../../../../server/helpers";
import tryCatch from "../../../../server/tryCatch";
import { File, Files, IncomingForm } from "formidable";
import { promises as fs } from "fs";
import getDB from "../../../../server/getDB";
import auth from "../../../../server/auth";
export const config = {
    api: {
        bodyParser: false,
        sizeLimit: "10mb",
    }
}
export default (req: NextApiRequest, res: NextApiResponse) => tryCatch(res, async () => {
    switch (req.method) {
        case "PUT": {
            const f = await new Promise<File>((resolve, reject) => {
                const form = new IncomingForm({
                    uploadDir: "./public/uploads",
                } as any);
            
                form.parse(req, (err, fields, file) => {
                    if (err) {
                        reject(err);
                        throw err;
                    }
                    resolve(file.file);
                });
            });
            const name = (Math.random() + "").slice(2) + "-" + new Date().getTime() + "-" + f.name.replace(/ /g, "-");
            await fs.rename(f.path, "./public/uploads/" + name);
            const { _id } = await auth(req, res);
            const db = await getDB();
            const users = db.collection("users");
            users.updateOne({ _id }, {
                $set: {
                    pic: name,
                },
            });
            res.json({
                name,
            });
            break;
        }
        default: {
            notAllowed(res);
        }
    }
});