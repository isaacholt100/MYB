import { Typography } from "@material-ui/core";
import styles from "../css/quote.module.css";

export default function Quote({ quote }: { quote: string }) {
    return quote === "" ? <Typography component="i">(No quote from this person yet)</Typography> : (
        <div className={styles.root}>
            <Typography className={styles.quote}>"</Typography>
            {quote.split("\n").map(line => (
                <Typography>{line}</Typography>
            ))}
        </div>
    );
}