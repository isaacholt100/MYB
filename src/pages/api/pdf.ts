import { NextApiRequest, NextApiResponse } from "next";
import { notAllowed } from "../../server/helpers";
import tryCatch from "../../server/tryCatch";
import { v2 as cloudinary } from "cloudinary";
import auth from "../../server/auth";
import getDB from "../../server/getDB";
import hash from "../../server/hash";
import { File, IncomingForm } from "formidable";
import { promises as fs } from "fs";

cloudinary.config({
    cloud_name: "dv9qm574l", 
    api_key: "947231894266752", 
    api_secret: "m-9PvepteXbQAWzNrEJimnMxzZ0",
});
export const config = {
    api: {
        bodyParser: false,
        sizeLimit: "10mb",
    }
}

export default (req: NextApiRequest, res: NextApiResponse) => tryCatch(res, async () => {
    switch (req.method) {
        case "POST": {
            const { _id, admin, group_id } = await auth(req, res);
            const db = await getDB();
            if (!admin) {
                throw new Error("403");
            }
            const pdf = await new Promise<File>((resolve, reject) => {
                const form = new IncomingForm();
            
                form.parse(req, (err, fields, file) => {
                    if (err) {
                        reject(err);
                        throw err;
                    }
                    resolve(file.pdf);
                });
            });
            const name = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload(pdf.path, {
                    public_id: "pdfs/" + hash(group_id.toHexString(), "sha256"),
                    overwrite: true,
                    resource_type: "raw",
                }, async (err, data) => {
                    if (err) {
                        reject(err);
                        throw err;
                    }
                    resolve(data.secure_url);
                });
            });
            if (fs.rm) {
                await fs.rm(pdf.path);
            }
            console.log(name);
            
            const groups = db.collection("groups");
            groups.updateOne({ _id: group_id, admin_id: _id }, {
                $set: {
                    pdf: name,
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