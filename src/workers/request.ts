import fetchData from "../lib/fetchData";
import { Handler } from "../types/fetch";
addEventListener("message", e => {
    fetchData(e.data, self.postMessage as Handler);
});
/*onmessage = e => {
    fetchData(e.data, postMessage as Handler);
}*/