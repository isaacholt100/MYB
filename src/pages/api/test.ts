import jwt from "../../server/jwt"
import tryCatch from "../../server/tryCatch";

export default (req, res) => tryCatch(res, async () => {
    const user = await jwt(req, res);
    res.json({
        hi: "hello",
    })
});