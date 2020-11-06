import { NextApiRequest, NextApiResponse } from "next";
import { notAllowed } from "../../../../server/helpers";
import tryCatch from "../../../../server/tryCatch";
import { File, Files, IncomingForm } from "formidable";
import { promises as fs } from "fs";
import getDB from "../../../../server/getDB";
import auth from "../../../../server/auth";
import path from "path";
import glob from "glob";
import getConfig from "next/config";
import { v2 as cloudinary } from "cloudinary";

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
const getDirectories = async source => (await fs.readdir(source)).map(name => path.join(source, name));
const getAll = (str) => new Promise(res => glob(str + "/**/*", (err, data) => res(data)));
export default (req: NextApiRequest, res: NextApiResponse) => tryCatch(res, async () => {
    switch (req.method) {
        case "PUT": {
            const f = await new Promise<File>((resolve, reject) => {
                const form = new IncomingForm();
            
                form.parse(req, (err, fields, file) => {
                    if (err) {
                        reject(err);
                        throw err;
                    }
                    resolve(file.file);
                });
            });
            const name = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload(f.path, {
                    folder: "uploads",
                }, async (err, data) => {
                    if (err) {
                        reject(err);
                        throw err;
                    }
                    resolve(data.url);
                });
            });
            await fs.rm(f.path);
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