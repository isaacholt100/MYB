import React from "react";
import { Button, CircularProgress } from "@material-ui/core";
import styles from "../css/loadBtn.module.css";
interface IProps {
    label: string;
    disabled: boolean;
    loading: boolean;
    [key: string]: any;
}
export default function LoadBtn({ label, disabled, loading, ...other }: IProps) {
    return (
        <div className={styles.root}>
            <Button
                color="primary"
                disabled={disabled || loading}
                type="submit"
                {...other}
            >
                {label}
            </Button>
            {loading && (
                <CircularProgress size={24} className={styles.progress} />
            )}
        </div>
    );
}