import { NextApiResponse } from "next";
import authRoute from "../../server/authRoute";
export default authRoute((req, res) => {
    res.json("hi");
});