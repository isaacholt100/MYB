import { File, IncomingForm } from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import { notAllowed } from "../../../server/helpers";
import tryCatch from "../../../server/tryCatch";
import auth from "../../../server/auth";
import getDB from "../../../server/getDB";
import { v2 as cloudinary } from "cloudinary";
import hash from "../../../server/hash";
import { promises as fs } from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
export const config = {
    api: {
        bodyParser: false,
        sizeLimit: "10mb",
    }
}

export default (req: NextApiRequest, res: NextApiResponse) => tryCatch(res, async () => {
    switch (req.method) {
        case "PUT": {
            const { _id, group_id } = await auth(req, res);
            const db = await getDB();
            const f = await new Promise<File>((resolve, reject) => {
                const form = new IncomingForm();
            
                form.parse(req, (err, fields, file) => {
                    if (err) {
                        reject(err);
                        throw err;
                    }
                    resolve(file.file as File);
                });
            });
            const name = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload(f.path, {
                    public_id: "uploads/" + hash(group_id.toHexString()),
                    overwrite: true,
                }, async (err, data) => {
                    if (err) {
                        reject(err);
                        throw err;
                    }
                    resolve(data.secure_url);
                });
            });
            if (fs.rm) {
                await fs.rm(f.path);
            }
            const groups = db.collection("groups");
            groups.updateOne({ _id: group_id, admin_id: _id }, {
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