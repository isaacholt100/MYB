import auth from "../../server/auth"
import tryCatch from "../../server/tryCatch";

export default (req, res) => tryCatch(res, async () => {
    const user = await auth(req, res);
    res.json({
        hi: "hello",
    })
});