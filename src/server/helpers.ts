import { NextApiResponse } from "next";

export const notFound = (res: NextApiResponse) => res.status(404).json("Not found");
export const done = (res: NextApiResponse) => res.status(200).json("done");
export const failed = (res: NextApiResponse) => res.status(500).json("Failed");
export const errors = (res: NextApiResponse, errors: object) => res.status(400).json({ errors });
export const forbidden = (res: NextApiResponse) => res.status(403).send("Forbidden");
export const noAuth = (res: NextApiResponse) => res.status(401).send("No Auth");
export const notAllowed = (res: NextApiResponse) => res.status(405).json("Method Not Allowed");