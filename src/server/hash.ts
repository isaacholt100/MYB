import crypto from "crypto";

export default function hash(value: string, alg = "md5", encoding: crypto.BinaryToTextEncoding = "hex"): string {
    return crypto.createHash(alg).update(value).digest(encoding);
}