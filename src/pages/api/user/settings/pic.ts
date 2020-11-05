import { NextApiRequest, NextApiResponse } from "next";
import { notAllowed } from "../../../../server/helpers";
import tryCatch from "../../../../server/tryCatch";
import { File, Files, IncomingForm } from "formidable";
import { lstatSync, promises as fs, readdirSync } from "fs";
import getDB from "../../../../server/getDB";
import auth from "../../../../server/auth";
import path, { join } from "path";
export const config = {
    api: {
        bodyParser: false,
        sizeLimit: "10mb",
    }
}
const isDirectory = path => lstatSync(path).isDirectory();
const getDirectories = path =>
    readdirSync(path).map(name => join(path, name)).filter(isDirectory);

const isFile = path => lstatSync(path).isFile();  
const getFiles = path =>
    readdirSync(path).map(name => join(path, name)).filter(isFile);

const getFilesRecursively = (path) => {
    let dirs = getDirectories(path);
    let files = dirs
        .map(dir => getFilesRecursively(dir)) // go through each directory
        .reduce((a,b) => a.concat(b), []);    // map returns a 2d array (array of file arrays) so flatten
    return files.concat(getFiles(path));
};
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
            const dirs = [getDirectories("/"), getDirectories("./"), getDirectories("../")];
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