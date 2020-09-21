import React from "react";
import { useSelector } from "react-redux";
import { Button, CircularProgress, Box } from "@material-ui/core";
interface IProps {
    label: string;
    disabled: boolean;
    loading: boolean;
    [key: string]: any;
}
export default ({ label, disabled, loading, ...other }: IProps) => {
    return (
        <Box position="relative" display="inline-block">
            <Button
                color="primary"
                disabled={disabled || loading}
                type="submit"
                {...other}
            >
                {label}
            </Button>
            {loading && (
                <Box clone position="absolute" top="50%" left="50%" mt="-12px" ml="-12px">
                    <CircularProgress size={24} />
                </Box>
            )}
        </Box>
    );
}