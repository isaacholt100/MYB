/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Loader from "../../components/Loader";
import {
    Button,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Box,
} from "@material-ui/core";
import { startCase, capitalize } from "lodash";
import useTitle from "../../hooks/useTitle";
import useSnackbar from "../../hooks/useSnackbar";

const
    useStyles = makeStyles(theme => ({
        container: {
            overflow: "auto",
            whiteSpace: "nowrap",
            margin: "0 auto",
            maxHeight: "100%",
            flex: 1,
            width: "100%",
        },
        row: {
            whiteSpace: "nowrap",
            display: "table-row",
            marginBottom: -5,
        },
        cell: {
            width: "calc(100% / 18)",
            paddingBottom: "calc(100% / 18)",
            [theme.breakpoints.down(880)]: {
                paddingBottom: 0,
                height: 48,
            },
            minWidth: 48,
            display: "inline-block",
            position: "relative",
            "& span": {
                textAlign: "center",
                fontSize: 20,
                display: "block"
            },
            "& button": {
                height: "100%",
                borderRadius: 0,
                padding: 0,
                width: "100%",
                minWidth: "100%",
                "&[disabled]": {
                    opacity: 0,
                },
            },
        },
        hover: {
            "&:hover": {
                opacity: 0.9,
            },
        },
        hide: {
            height: 30,
            visibility: "hidden",
        },
        row8: {
            "& .button": {
                backgroundColor: "#ff9800 !important",
                color: "#000 !important",
            }
        },
        row9: {
            "& .button": {
                backgroundColor: "#ff5722 !important",
                color: "#fff !important",
            },
        },
        symbolLa: {
            backgroundColor: "#ff9800 !important",
            color: "#000 !important",
        },
        symbolAc: {
            backgroundColor: "#ff5722 !important",
            color: "#fff !important",
        },
        symbolH: {
            backgroundColor: "#9e9e9e !important",
            color: "#000 !important",
        },
        col0: {
            "& .button": {
                backgroundColor: "#2196f3",
                color: "#fff",
            },
        },
        col1: {
            "& .button": {
                backgroundColor: "#00bcd4",
                color: "#000",
            },
        },
        transitions: {
            "& .button": {
                backgroundColor: "#4caf50",
                color: "#000",
            },
        },
        col12: {
            "& .button": {
                backgroundColor: "#607d8b",
                color: "#fff",
            },
        },
        col13: {
            "& .button": {
                backgroundColor: "#9c27b0",
                color: "#fff",
            },
        },
        col14: {
            "& .button": {
                backgroundColor: "#009688",
                color: "#fff",
            },
        },
        col15: {
            "& .button": {
                backgroundColor: "#8bc34a",
                color: "#fff",
            },
        },
        col16: {
            "& .button": {
                backgroundColor: "#e91e63",
                color: "#fff",
            },
        },
        col17: {
            "& .button": {
                backgroundColor: "#f44336",
                color: "#fff",
            },
        },
    })),
    structure = [
        [0, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", 1],
        [2, 3, "", "", "", "", "", "", "", "", "", "", 4, 5, 6, 7, 8, 9],
        [10, 11, "", "", "", "", "", "", "", "", "", "", 12, 13, 14, 15, 16, 17],
        [...Array(18).keys()].map(x => x + 18),
        [...Array(18).keys()].map(x => x + 36),
        [-17, -16, -15, ...Array(15).keys()].map(x => x + 71),
        [-17, -16, -15, ...Array(15).keys()].map(x => x + 103),
        Array(18).fill(""),
        ["", "", ...Array(15).keys(), ""].map(x => x === "" ? x : +x + 56),
        ["", "", ...Array(15).keys(), ""].map(x => x === "" ? x : +x + 88)
    ];
export default function PeriodicTable() {
    const
        classes = useStyles(),
        snackbar = useSnackbar(),
        title = useTitle(),
        [table, setTable] = useState(false),
        [open, setOpen] = useState(false),
        [activeIndex, setActiveIndex] = useState(0),
        close = () => setOpen(false),
        openDialog = (i: number) => () => {
            setActiveIndex(i);
            setOpen(true);
        };
    useEffect(() => {
        (async () => {
            const res = await fetch("/json/periodicTable.json");
            try {
                setTable(await res.json());
            } catch (err) {
                snackbar.error("There was an error loading the periodic table");
            }
        })();
        title("Periodic Table");
    }, []);
    return table ? (
        <div className={classes.container}>
            <div style={{ display: "flex", flexDirection: "column" }}>
                {structure.map((row, i) => (
                    <div key={i} className={`${classes["row" + i]} ${classes.row}`}>
                        {row.map((index, j) => (
                            <div className={`${classes.cell} ${j < 2 || j > 11 ? classes["col" + j] : classes.transitions}`} key={j}>
                                <Box position="absolute" top={0} left={0} right={0} bottom={0} className={classes.hover}>
                                    <Button
                                        className={index !== "" ? `button ${classes["symbol" + table[index].symbol]}` : null}
                                        onClick={openDialog(index)}
                                        disabled={index === ""}
                                        //disableTouchRipple
                                        focusRipple={true}
                                    >
                                        <Typography component="span" className={index === "" ? classes.hide : null}>
                                            {index !== "" ? table[index].symbol : "p"}
                                        </Typography>
                                    </Button>
                                </Box>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <Dialog
                open={open}
                onClose={close}
                aria-labelledby="element-info"
            >
                <DialogTitle id="element-info">Element info</DialogTitle>
                <DialogContent>
                    <Table aria-label="element properties table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Element</TableCell>
                                <TableCell align="right">{table[activeIndex].name}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Object.keys(table[activeIndex]).filter(x => x !== "cpkHexColor" && table[activeIndex][x] !== "").map(key => (
                                <TableRow key={key}>
                                    <TableCell component="th" scope="row">
                                        {key.includes("negativity") ? "Electron Negativity" : startCase(key)}
                                    </TableCell>
                                    <TableCell align="right">{capitalize(table[activeIndex][key])}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </DialogContent>
                <DialogActions>
                    <Button onClick={close} color="primary" autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    ) : <Loader />;
};
