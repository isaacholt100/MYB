import { NextApiRequest, NextApiResponse } from "next";
import { done, notAllowed } from "../../../../server/helpers";
import tryCatch from "../../../../server/tryCatch";
import { File, IncomingForm } from "formidable";
import getDB from "../../../../server/getDB";
import auth from "../../../../server/auth";
import { v2 as cloudinary } from "cloudinary";
import hash from "../../../../server/hash";
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
            const { _id } = await auth(req, res);
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
                    public_id: "uploads/" + hash(_id.toHexString()),
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
        case "DELETE": {
            const { _id } = await auth(req, res);
            const db = await getDB();
            const users = db.collection("users");
            users.updateOne({ _id }, {
                $set: {
                    pic: "",
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