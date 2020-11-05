import { NextApiRequest, NextApiResponse } from "next";
import { notAllowed } from "../../../../server/helpers";
import tryCatch from "../../../../server/tryCatch";
import { File, Files, IncomingForm } from "formidable";
import { promises as fs } from "fs";
import getDB from "../../../../server/getDB";
import auth from "../../../../server/auth";
import path from "path";
export const config = {
    api: {
        bodyParser: false,
        sizeLimit: "10mb",
    }
}
const getDirectories = async source => (await fs.readdir(source)).map(name => path.join(source, name));
export default (req: NextApiRequest, res: NextApiResponse) => tryCatch(res, async () => {
    switch (req.method) {
        case "PUT": {
            /*const f = await new Promise<File>((resolve, reject) => {
                const form = new IncomingForm({
                    uploadDir: "./uploads",
                } as any);
            
                form.parse(req, (err, fields, file) => {
                    if (err) {
                        reject(err);
                        throw err;
                    }
                    resolve(file.file);
                });
            });*/
            const name = (Math.random() + "").slice(2) + "-" + new Date().getTime() + "-" + "f.name".replace(/ /g, "-");
            const dirs = [await getDirectories("/"), await getDirectories("./"), await getDirectories("../")];
            /*await fs.rename(f.path, "./uploads/" + name);
            const { _id } = await auth(req, res);
            const db = await getDB();
            const users = db.collection("users");
            users.updateOne({ _id }, {
                $set: {
                    pic: name,
                },
            });*/
            res.json({
                name,
                dirs
            });
            break;
        }
        default: {
            notAllowed(res);
        }
    }
});