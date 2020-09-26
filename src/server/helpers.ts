import { NextApiResponse } from "next";

export const notFound = (res: NextApiResponse) => res.status(404).end();
export const done = (res: NextApiResponse) => res.status(200).json({
    data: "done"
});
export const didUpdate = (res: NextApiResponse, num: number) => num === 1 ? done(res) : failed(res);
export const failed = (res: NextApiResponse) => res.status(500).end();
export const errors = (res: NextApiResponse, errors: object | string) => res.status(200).json({ errors });
export const forbidden = (res: NextApiResponse) => res.status(403).end();
export const noAuth = (res: NextApiResponse) => res.status(401).end();
export const notAllowed = (res: NextApiResponse) => res.status(405).end();