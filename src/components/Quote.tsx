import { Typography } from "@material-ui/core";
import styles from "../css/quote.module.css";

export default function Quote({ quote }: { quote: string }) {
    return (
        <div className={styles.root}>
            <Typography className={styles.quote}>"</Typography>
            <Typography>{quote}</Typography>
        </div>
    );
}