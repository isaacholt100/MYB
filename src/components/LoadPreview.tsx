import React from "react";
import { Typography, Button, CircularProgress, makeStyles } from "@material-ui/core";
import styles from "../css/loadPreview.module.css";
export default ({ status, getData, ...props }) => {
    return (
        <div className={styles.root} {...props}>
            {status === "loading" ? (
                <>
                    <Typography variant="h5" gutterBottom color="inherit">Loading your data...</Typography>
                    <CircularProgress color="inherit" disableShrink />
                </>
            ) : (
                <>
                    <Typography variant="h5" gutterBottom className={styles.errorText}>
                        There was an error loading your data
                    </Typography>
                    <Button color="default" onClick={getData}>Retry</Button>
                </>
            )}
        </div>
    );
};