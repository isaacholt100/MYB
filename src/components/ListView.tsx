/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, memo } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import SwipeableViews from "react-swipeable-views";
import {
    Typography,
    AppBar,
    Tabs,
    useMediaQuery,
    Grid,
    Card,
    CardActionArea,
    Tooltip,
    IconButton,
    Tab,
    MobileStepper,
    Dialog,
    DialogTitle,
    CircularProgress,
    IconButtonProps,
} from "@material-ui/core";
import { Box } from "@material-ui/core";
import isEqual from "react-fast-compare";
import { useSelector } from "react-redux";
import useContextMenu from "../hooks/useContextMenu";
import isHotkey from "is-hotkey";
import { mdiChevronLeft, mdiChevronRight, mdiPlus } from "@mdi/js";
import Icon from "./Icon";
import styles from "../css/listView.module.css";
import clsx from "clsx";

const useStyles = makeStyles(theme => ({
    animated: {
        opacity: 1,
        animation: "none",
    },
    animate: {
        opacity: 0,
        animation: "fadein 0.5s forwards",
    },
    createBtn: {
        "& *": {
            textAlign: "center",
        },
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.main,
        flexDirection: "column"
    },
    bounceUp: {
        animation: "fadein 0.5s forwards 0.5s",
        opacity: 0,
        height: "initial !important",
    },
    swiper: {
        marginRight: -8,
    },
    cardSwipe: {
        marginRight: 8,
    },
    actionArea: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
    }
}));

interface ITabProps {
    tabs: string[];
    filter?: number;
    setFilter?: (x: number) => void;
}

const TabList = memo((props: ITabProps) => props.tabs.length > 0 && (
    <Box clone mb={{ xs: "8px !important", lg: "16px !important" }}>
        <AppBar position="static" color="default">
            <Tabs
                value={props.filter}
                onChange={(e, newFilter) => props.setFilter(newFilter)}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable tabs"
            >
                {props.tabs.map((tab, i) => (
                    <Tab
                        key={i}
                        id={`scrollable-auto-tab-${i}`}
                        aria-controls={`scrollable-auto-tabpanel-${i}`}
                        label={tab}
                    />
                ))}
            </Tabs>
        </AppBar>
    </Box>
), (prev, next) => !(prev.filter !== next.filter || prev.tabs.length !== next.tabs.length));

const CreateBtn = memo((props: { createFn?: () => void, name: string }) => {
    const classes = useStyles();
    return (
        <CardActionArea
            className={"flex p_0 flex_col justify_content_center align_items_center " + classes.actionArea}
            onClick={props.createFn}
        >
            <Typography variant="h6" color="inherit" align="center">
                New {props.name}
            </Typography>
            <Box
                bgcolor="primary.contrastText"
                borderRadius="50%"
                //size="small"
                height={36}
                width={36}
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                <Icon path={mdiPlus} />
            </Box>
        </CardActionArea>
    );
}, (prev, next) => true);

const Stepper = memo((props: { length: number, activeStep: number, setActiveStep: (x: number) => void, }) => (
    <MobileStepper
        variant="dots"
        steps={props.length}
        position="static"
        activeStep={props.activeStep}
        nextButton={
            <Tooltip title="Next">
                <IconButton
                    size="small"
                    onClick={() => props.setActiveStep(props.activeStep + 1)}
                    disabled={props.activeStep === props.length - 1}
                >
                    <Icon path={mdiChevronRight} />
                </IconButton>
            </Tooltip>
        }
        backButton={
            <Tooltip title="Previous">
                <IconButton
                    size="small"
                    onClick={() => props.setActiveStep(props.activeStep - 1)}
                    disabled={props.activeStep === 0}
                >
                    <Icon path={mdiChevronLeft} />
                </IconButton>
            </Tooltip>
        }
    />
), (prev, next) => !(prev.activeStep !== next.activeStep || prev.length !== next.length));

interface IAction {
    label: string;
    fn: () => void;
    icon: JSX.Element;
}

interface IListProps<T> {
    noCreate: boolean;
    height: number;
    animate: boolean;
    createFn?: () => void;
    name: string;
    filtered: any[];
    Item: (item: T) => JSX.Element;
    color?: IconButtonProps["color"];
    Actions?: (item: T) => IAction[];
}

const List = memo(function<T>(props: IListProps<T>) {
    const
        [activeStep, setActiveStep] = useState(0),
        contextMenu = useContextMenu(),
        classes = useStyles(),
        carouselView = useSelector(s => (s as any).carouselView),
        isLarge = useMediaQuery("(min-width: 600px)"),
        isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down("md")),
        swipeable = !isLarge && carouselView,
        Container: any = (isLarge || !carouselView) ? Grid : SwipeableViews,
        containerProps = () => (isLarge || !carouselView) ? {
            container: true,
            spacing: isSmall ? 1 : 2,
        } : {
            index: activeStep,
            onChangeIndex: (step: number) => setActiveStep(step),
            enableMouseEvents: true,
            className: classes.swiper
        };
    return (
        <>
            {swipeable && !props.noCreate && (
                <Box height={props.height} mb={1}>
                    <Card
                        className={(props.animate ? classes.animate : classes.animated) + "p_0 full_height"}
                    >
                        <CreateBtn createFn={props.createFn} name={props.name} />
                    </Card>
                </Box>
            )}
            <div className={(swipeable && props.animate) ? classes.bounceUp : null}>
                <Container {...containerProps()}>
                    {(swipeable || props.noCreate ? props.filtered : ["create", ...props.filtered]).map((item, i) => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            lg={3}
                            xl={2}
                            key={i}
                            style={{
                                height: props.height,
                            }}
                        >
                            <Card
                                classes={{
                                    root: clsx(swipeable ? classes.cardSwipe : null, styles.card)
                                }}
                                style={{
                                    animation: (!swipeable && props.animate) ? `fadein 0.5s forwards ${i / (props.filtered.length + 1)}s` : "none",
                                    opacity: (!swipeable && props.animate) ? 0 : 1,
                                }}
                                onContextMenu={item !== "create" && props.Actions ? contextMenu(props.Actions(item)) : undefined}
                            >
                                {item === "create" ? <CreateBtn createFn={props.createFn} name={props.name} /> : (
                                    <>
                                        {props.Item(item)}
                                        <Box display="flex" position="absolute" bottom={4} right={4}>
                                            {props.Actions && props.Actions(item).map(({ label, fn, icon, ...a }) => (
                                                <Tooltip title={label} key={label}>
                                                    <IconButton
                                                        component={IconButton}
                                                        aria-label={label}
                                                        onClick={fn}
                                                        color={props.color || (label === "Delete" ? undefined : "secondary")}
                                                        {...a}
                                                        className={label === "Delete" ? "color-error ml_8" : "ml_8"}
                                                    >
                                                        {icon}
                                                    </IconButton>
                                                </Tooltip>
                                            ))}
                                        </Box>
                                    </>
                                )}
                            </Card>
                        </Grid>
                    ))}
                </Container>
            </div>
        </>
    );
}, (prev, next) => !(!isEqual(prev.filtered, next.filtered) || prev.animate !== next.animate));

interface IFormProps {
    createOpen: boolean;
    setCreateOpen: (o: boolean) => void;
    name: string;
    createForm: JSX.Element;
}

const Form = (props: IFormProps) => (
    <Dialog
        open={props.createOpen}
        onClose={() => props.setCreateOpen(false)}
        aria-labelledby={`new-${props.name}-title`}
    >
        <DialogTitle id={`new-${props.name}-title`}>New {props.name}</DialogTitle>
        {props.createForm}
    </Dialog>
);
export default function ListView<T>(props: ITabProps & Omit<IListProps<T>, "animate" | "setAnimate"> & Partial<IFormProps>) {
    const
        [activeStep, setActiveStep] = useState(0),
        carouselView = useSelector(s => (s as any).carouselView),
        [animate, setAnimate] = useState(true),
        isLarge = useMediaQuery("(min-width: 600px)"),
        swipeable = !isLarge && carouselView;
    useEffect(() => {
        props.filtered && setTimeout(() => setAnimate(false), 1500);
    }, [props.filtered]);
    useEffect(() => {
        const keyDown = e => {
            if (isHotkey("shift+n", e)) {
                props.createFn();
            }
        }
        document.addEventListener("keydown", keyDown);
        return () => {
            document.removeEventListener("keydown", keyDown);
        }
    }, []);
    return (
        props.filtered ? (
            <Box display="flex" flexDirection="column" mx="auto">
                <Form name={props.name} createOpen={props.createOpen} setCreateOpen={props.setCreateOpen} createForm={props.createForm} />
                <TabList filter={props.filter} setFilter={props.setFilter} tabs={props.tabs} />
                <List
                    noCreate={props.noCreate}
                    animate={animate}
                    createFn={props.createFn}
                    filtered={props.filtered}
                    Item={props.Item}
                    Actions={props.Actions}
                    name={props.name}
                    height={props.height}
                />
                {swipeable && props.filtered.length > 0 && <Stepper activeStep={activeStep} setActiveStep={setActiveStep} length={props.filtered.length} />}
            </Box>
        ) : <CircularProgress />
    );
}