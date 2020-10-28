/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, createRef, useRef, useEffect, useMemo, ElementRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import ToggleButton from "@material-ui/lab/ToggleButton";
import { create, all, import as importMath } from "mathjs";
import dynamic from "next/dynamic";
//import { addStyles } from "react-mathquill";
import "mathquill/build/mathquill.css";
import AnimateHeight from "react-animate-height";
import katex from "katex";
import {
    Button,
    Paper,
    Typography,
    Grid,
    List,
    ListItem,
    ListItemText,
    FormControl,
    FormHelperText,
    useMediaQuery,
    FormControlLabel,
    Switch,
    Card,
} from "@material-ui/core";
import clsx from "clsx";
import Icon from "../../components/Icon";
import { mdiBackspace, mdiHistory } from "@mdi/js";

const EditableMathField: any = dynamic(
    () => import("react-mathquill").then(mod => mod.EditableMathField) as any,
    {
        ssr: false
    }
);
const StaticMathField = dynamic(
    () => import("react-mathquill").then(mod => mod.StaticMathField) as any,
    {
        ssr: false
    }
);
let replacements = {}, scope={};
const
    { PI } = Math,
    { keys, values } = Object,
    math = create(all, {}),
    config = {
        angles: "rad",
    },
    fns1 = ["sin", "cos", "tan", "sinh", "cosh", "tanh"],
    fns2 = ["asin", "acos", "atan", "asinh", "acosh", "atanh"];
fns1.forEach(name => {
    const
        fn = math[name],
        fnNumber = x => {
            switch (config.angles) {
                case "deg":
                    return Math.round(1e14 * fn(x / 360 * 2 * PI)) / 1e14;
                default:
                    return Math.round(1e14 * fn(x)) / 1e14;
            }
        };
    replacements[name] = math.typed(name, {
        "number": fnNumber,
        "Array | Matrix": x => math.map(x, fnNumber)
    });
});
fns2.forEach(name => {
    const
        fn = math[name],
        fnNumber = x => {
            const result = fn(x);
            if (typeof result === "number") {
                switch (config.angles) {
                    case "deg": return result / 2 / PI * 360;
                    default: return result;
                }
            }
            return result;
        };
    replacements[name] = math.typed(name, {
        "number": fnNumber,
        "Array | Matrix": x => math.map(x, fnNumber)
    });
});
math.import(replacements, { override: true });
const useStyles = makeStyles(theme => ({
    button: {
        borderRadius: "0 !important",
        fontSize: 16,
        flex: 1,
        textTransform: "none",
        height: 43,
        flexBasis: "calc(100% / 3)",
        minWidth: "auto",
        padding: "6px 8px",
    },
    fns: {
        [theme.breakpoints.up("sm")]: {
            display: "none",
        },
        flexBasis: "25%"
    },
    flex: {
        [theme.breakpoints.down("sm")]: {
            flexBasis: "25%"
        }
    },
    flex25: {
        flexBasis: "calc(100% / 3.5 * 5 / 6)",
        width: "calc(100% / 3.5 * 5 / 6)",
        "&:last-child": {
            flexBasis: "calc(100% / 3.5)",
            width: "calc(100% / 3.5)"
        },
        [theme.breakpoints.down("xs")]: {
            flexBasis: "25% !important",
            width: "25% !important"
        },
    },
    buttons: {
        display: "flex",
        flexWrap: "wrap",
    },
    container: {
        "& *:not(h5)": {
            //fontFamily: 'Cambria, Georgia, sans-serif',
        },
        flex: 1,
        width: "100%",
    },
    focused: {
        "& fieldset, & input": {
            borderColor: `${theme.palette.primary.main} !important`
        }
    },
    historyBox: {
        border: `2px solid ${theme.palette.primary.main}`,
        overflowY: "scroll",
        padding: 0,
        height: "100%",
        "& div": {
            overflow: "hidden",
            textOverflow: "ellipsis"
        },
        borderRadius: 8,
        [theme.breakpoints.down(960)]: {
            maxHeight: 256,
        }
    },
    mathField: {
        width: "100%",
        padding: 16,
        borderRadius: 8,
        outline: "none",
        marginBottom: 8,
        "&:focus": {
            border: `2px solid ${theme.palette.primary.main} !important`,
            outline: "none",
            borderRadius: 8,
        }
    },
    historyContainer: {
        "&, & *": {
           display: "none",
        }
    },
    containerLarge: {
        "& *": {
            height: 0,
            display: "none",
        },
        width: "0 !important",
        height: "0 !important",
        opacity: "0 !important",
    },
}));
export default () => {
    let ma = null;
    let historyArrow = 0, oldLatex = "", currentShown = true;
    const
        [state, setState] = useState({
            expression: "",
            message: "",
            invFuncs: false,
            radians: false,
            error: false,
            scope: {},
            latex: "",
            fns: false,
            historyRefs: [],
        }),
        [showHistory, setShowHistory] = useState({
            showHistory: false,
            height: 0,
            historyHeight: 299,
        }),
        [field, setField] = useState(null),
        [historyList, setHistoryList] = useState([]),
        historyRef = useRef(historyList),
        classes = useStyles(),
        calcContainer = useRef(null),
        history = createRef(),
        isSmall = useMediaQuery("(max-width: 599px)"),
        isMedium = useMediaQuery("(max-width: 960px)"),
        changeFuncs = () => {
            focus();
            setState(oldState => ({
                ...state,
                invFuncs: !oldState.invFuncs
            }));
        },
        changeAngle = () => {
            setState({
                ...state,
                radians: !state.radians
            });
            config.angles = state.radians ? "rad" : "deg";
            focus();
        },
        preventBlur = e => {
            e.preventDefault();
        },
        focus = () => {
            ma && ma.focus();
        },
        update = value => {
            focus();
            if (value === "×") {
                value = "*";
            }
            if (value === "÷") {
                value = "/";
            }
            if (value === "sqrt(") {
                value = "sqrt";
            }
            field.typedText(value.toString());
        },
        backspace = () => {
            field.keystroke("Backspace");
        },
        handleSubmit = e => {
            e.preventDefault();
            focus();
            let expression = ma.text()
                .replace(/\bsin\(/g, "(sin(")
                .replace(/\bcos\(/g, "(cos(")
                .replace(/\btan\(/g, "(tan(")
                .replace(/\bsinh\(/g, "(sinh(")
                .replace(/\bcosh\(/g, "(cosh(")
                .replace(/\btanh\(/g, "(tanh(")
                .replace(/\bln\(/g, "(ln(")
                .replace(/\blog\(/g, "(log10(")
                .replace(/\bln\(/g, "(log(")
                .replace(/p\*i/g, "pi")
                .replace(/operatorname{round}\(/g, "(round(")
                .replace(/operatorname{floor}\(/g, "(floor(")
                .replace(/operatorname{ceil}\(/g, "(ceil(")
                .replace(/\bdim/g, "(size")
                .replace(/\barcsin\(/g, "(asin(")
                .replace(/\barccos\(/g, "(acos(")
                .replace(/\barctan\(/g, "(atan(")
                .replace(/operatorname{arcsinh}\(/g, "(asinh(")
                .replace(/operatorname{arccosh}\(/g, "(acosh(")
                .replace(/operatorname{arctanh}\(/g, "(atanh(")
                .replace(/\*\(/g, "(")
                .replace(/operatorname{Re}\(/g, "(re(")
                .replace(/operatorname{Im}\(/g, "(im(");
            
            if (expression !== "") {
                let absolute;
                do {
                    // eslint-disable-next-line no-useless-escape
                    if (expression.match(/\|([^\|]+)\|/) !== null) {
                        // eslint-disable-next-line no-useless-escape
                        absolute = expression.match(/\|([^\|]+)\|/)[1];
                    }
                    expression = expression.replace(
                        `|${absolute}|`,
                        `abs(${absolute})`
                    );
                    // eslint-disable-next-line no-useless-escape
                } while (expression.match(/\|([^\|]+)\|/) !== null);
                let braces = 0;
                for (var i = 0, len = expression.length; i < len; i++) {
                    if (expression[i] === "(") {
                        braces = braces + 1;
                    } else if (expression[i] === ")") {
                        braces = braces - 1;
                    }
                }
                if (braces > 0) {
                    for (let j = 0; j < braces; j++) {
                        expression = expression + ")";
                    }
                } else if (braces < 0) {
                    for (let k = 0; k > braces; k--) {
                        expression = "(" + expression;
                    }
                }
                if (expression.includes("sqrt[")) {
                    do {
                        let
                            root = expression.split("sqrt[")[1].split("]")[0],
                            after = expression.split("sqrt[" + root + "]")[1],
                            afterBraces = 0;
                        for (let l = 0; l < expression.length; l++) {
                            if (after[l] === "(") {
                                afterBraces = afterBraces + 1;
                            } 
                        }
                        const inside = after.split(")")[0] + Array(afterBraces + 1).join(")");
                        expression = expression.replace(`sqrt[${root}]${inside}`, `(1 / 1e14 * round(1e14 * (${inside}^(1/${root}))))`);
                    } while (expression.includes("sqrt["));
                }
                if (expression.includes("log_")) {
                    do {
                        let
                            log = expression.split("log_")[1].split("(")[0],
                            after = expression.split("log_" + log)[1],
                            afterBraces = 0;
                        for (let l = 0; l < expression.length; l++) {
                            if (after[l] === "(") {
                                afterBraces = afterBraces + 1;
                            } 
                        }
                        const inside = after.split(")")[0] + Array(afterBraces + 1).join(")");
                        expression = expression.replace(`log_${log}${inside}`, `(1 / 1e14 * (round(1e14 / log10(${log}) * log10(${inside}))))`);
                    } while (expression.includes("log_"));
                }
                if (expression.includes("1_")) {

                }
               if (expression.includes("/")) {
                    do {
                        let
                            before = expression.split(")/(")[0],
                            after = expression.split(")/(")[1],
                            insideBefore = before,
                            insideAfter = after,
                            beforeBraces = 1,
                            afterBraces = 1;
                        for (let l = before.length - 1; l >= 0; l = l - 1) {
                            if (before[l] === "(") {
                                beforeBraces = beforeBraces - 1;
                            }
                            if (before[l] === ")") {
                                beforeBraces = beforeBraces + 1;
                            }
                            if (beforeBraces === 0) {
                                insideBefore = before.substring(l + 1);
                                break;
                            }
                        }
                        for (let m = 0; m < after.length; m++) {
                            if (after[m] === ")") {
                                afterBraces = afterBraces - 1;
                            }
                            if (after[m] === "(") {
                                afterBraces = afterBraces + 1;
                            }
                            if (afterBraces === 0) {
                                insideAfter = after.substring(0, m);
                                break;
                            }
                        }
                        expression = expression.replace(`(${insideBefore})/(${insideAfter})`, `((${insideBefore})÷(${insideAfter}))`);
                    } while (expression.includes("/"));
                }
                expression = expression.replace(/÷/g, "/");
                try {
                    let evaluated = math.evaluate(expression, scope).toString();
                    let answer = /*!expression.includes("=") && state.simplify ? math.simplify(expression, scope).toString() : */evaluated;
                    if (evaluated.includes("e+") || evaluated.includes("e-")) {
                        answer = math.evaluate(expression, scope).toString();
                    }
                    if (!answer.includes("=") && !answer.includes("/") && !answer.includes("pi") && !answer.includes("e")) {
                        answer = (Math.round(1e14 * answer) / 1e14).toString();
                    }
                    if (answer.includes("e+")) {
                        answer = answer.replace("e+", "\\cdot10^{") + "}";
                    }
                    if (answer.includes("e-")) {
                        answer = answer.replace("e-", "\\cdot10^{-") + "}";
                    }
                    if (answer.includes("/")) {
                        answer = `\\frac{${answer.split(" / ")[0]}}{${answer.split(" / ")[1]}}`;
                    }
                    answer = answer.replace(/pi/g, "\\pi")
                    const historyEntry =
                        expression.indexOf("=") > -1
                            ? ""
                            : " = " + answer;
                            console.log("latex: ", ma.latex());
                            
                    const newHistory = [
                        ...historyRef.current,
                        {[ma.latex()]: historyEntry}
                    ];
                    ma.latex(answer);
                    //const promise = new Promise(res => {
                        //res(true);
                        setHistoryList(newHistory);
                        historyArrow = newHistory.length, oldLatex = answer;
                        setState({
                            ...state,
                            error: false,
                            latex: answer,
                        });
                    //})
                    let { current } = history;
                    //promise.then(() => (current as any).scrollTop = 100000);
                    focus();
                } catch (error) {
                    console.error(error);
                    
                    setState({
                        ...state,
                        error: true,
                    });
                }
            }
        },
        clear = () => {
            focus();
            ma.latex("");
        },
        toggleHistory = () => {
            if (historyList.length > 0) {
                setShowHistory({
                    ...showHistory,
                    showHistory: !showHistory.showHistory,
                    height: showHistory.height === 0 ? "auto" as any : 0,
                });
            }
        },
        replaceExpression = (expression, index) => {
            ma.latex(expression);
            focus();
            historyArrow = index, currentShown = false;
            setState({
                ...state,
                latex: expression,
            });
        },
        change = e => {
            focus();
            const h = historyRef.current;
            switch (e.key) {
                case "ArrowUp": {
                    e.preventDefault();
                    if (historyArrow > 0) {
                        if (currentShown !== false) {
                            ma.latex(Object.keys(h[h.length - 1])[0]);
                            ma.focus();
                            historyArrow = h.length - 1;
                            setState({
                                ...state,
                                latex: keys(h[h.length - 1])[0],
                            });
                            currentShown = false;
                        } else {
                            replaceExpression(Object.keys(h[historyArrow - 1])[0], historyArrow - 1);
                        }
                    }
                    break;
                }
                case "ArrowDown": {
                    e.preventDefault();
                    if (historyArrow < h.length - 1) {
                        replaceExpression(keys(h[historyArrow + 1])[0], historyArrow + 1);
                    } else {
                        ma.latex(oldLatex);
                        focus();
                        historyArrow = historyArrow + 1;
                        setState({
                            ...state,
                            latex: oldLatex,
                        });
                        currentShown = true;
                    }
                    break;
                }
                case "Enter": {
                    handleSubmit(e);
                    break;
                }
            }
        },
        prevent = {
            onMouseDown: preventBlur
        },
        functions = [
            ["|x|", "round(x)", "|", "round("],
            ["π", "e", "π", "e"],
            [
                <span>
                    x<sup>2</sup>
                </span>,
                <span>√x</span>,
                "^2",
                "sqrt("
            ],
            [
                "sin(x)",
                <span>
                    sin<sup>-</sup><sup>1</sup>(x)
                </span>,
                "sin(",
                "arcsin("
            ],
            [
                "cos(x)",
                <span>
                    cos<sup>-</sup><sup>1</sup>(x)
                </span>,
                "cos(",
                "arccos("
            ],
            [
                "tan(x)",
                <span>
                    tan<sup>-</sup><sup>1</sup>(x)
                </span>,
                "tan(",
                "arctan("
            ],
            [
                "sinh(x)",
                <span>
                    sinh<sup>-</sup><sup>1</sup>(x)
                </span>,
                "sinh(",
                "arcsinh("
            ],
            [
                "cosh(x)",
                <span>
                    cosh<sup>-</sup><sup>1</sup>(x)
                </span>,
                "cosh(",
                "arccosh("
            ],
            [
                "tanh(x)",
                <span>
                    tanh<sup>-</sup><sup>1</sup>(x)
                </span>,
                "tanh(",
                "arctanh("
            ],
            [
                "log(x)",
                <span>
                    log<sub>y</sub>(x)
                </span>,
                "log(",
                "log_{}({}"
            ],
            [
                "ln(x)",
                <span>
                    e<sup>x</sup>
                </span>,
                "ln(",
                "e^{}"
            ],
            [
                <span>
                    x<sup>y</sup>
                </span>,
                <span>
                    <sup>x</sup>√y
                </span>,
                "^",
                "\\sqrt[{}]{}"
            ]
        ],
        historyBox = (
            <List
                component="nav"
                aria-label="History"
                className={clsx(
                    (showHistory.showHistory || isMedium) ? classes.historyBox : null,
                    "historyBox"
                )}
                ref={history as any}
            >
                {historyList.map((key, index) => (
                    <ListItem
                        button
                        onClick={() => replaceExpression(keys(key)[0], index)}
                        key={index}
                    >
                        <ListItemText
                            primary={
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: katex.renderToString(keys(key)[0], {
                                            output: "mathml",
                                        })
                                    }}
                                />
                            }
                            secondary={
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: katex.renderToString(values(key)[0] as any, {
                                        output: "mathml",
                                    })
                                }}
                            />
                        }
                        />
                    </ListItem>
                ))}
            </List>
        );
    useEffect(() => {
        setShowHistory({
            ...showHistory,
            historyHeight: calcContainer.current.offsetHeight,
        });
    }, [state.latex, state.error]);
    console.log(historyList);
    
    /*useEffect(() => {
        if (historyList.length > 0) {
            const expression = state.text;
            let evaluated = math.evaluate(expression, scope).toString();
            let answer = /*!expression.includes("=") && state.simplify ? math.simplify(expression, scope).toString() : evaluated;
            if (evaluated.includes("e+") || evaluated.includes("e-")) {
                answer = math.evaluate(expression, scope).toString();
            }
            if (!answer.includes("=") && !answer.includes("/") && !answer.includes("pi") && !answer.includes("e")) {
                answer = (Math.round(1e14 * answer) / 1e14).toString();
            }
            if (answer.includes("e+")) {
                answer = answer.replace("e+", "\\cdot10^{") + "}";
            }
            if (answer.includes("e-")) {
                answer = answer.replace("e-", "\\cdot10^{-") + "}";
            }
            if (answer.includes("/")) {
                answer = `\\frac{${answer.split(" / ")[0]}}{${answer.split(" / ")[1]}}`;
            }
            answer = answer.replace(/pi/g, "\\pi")
            setState({
                ...state,
                history: historyList.filter((x, i) => i === historyArrow ? {[state.latex]: answer} : x),
            });
        }
    }, [state.simplify]);*/
    useEffect(() => {
        document.addEventListener("keydown", change);
        return () => document.removeEventListener("keydown", change);
    }, []);
    useEffect(() => {
        historyRef.current = historyList;
    }, [historyList]);
    console.log(showHistory.showHistory);
    
    return (
        <div className={`${classes.container} fadeup`}>
            <Card>
                <form
                    onSubmit={handleSubmit}
                    autoComplete="off"
                >
                    <Typography variant="h5" gutterBottom>
                        Calculator
                    </Typography>
                    <div style={{display: isMedium ? "block" : "flex"}}>
                        <div style={{
                            width: isMedium ? "100%" : showHistory.showHistory ? "calc(75% - 8px)" : "100%",
                            height: "100%",
                            marginRight: showHistory.showHistory ? 8 : 0,
                            transition: "width 500ms",
                        }} ref={calcContainer}>
                            <FormControl fullWidth error={state.error}>
                                {useMemo(() => (
                                    <EditableMathField
                                        className={classes.mathField}
                                        latex={state.latex}
                                        onChange={mathField => {
                                            const
                                                latex = mathField.latex();
                                              //  oldLatex = latex;
                                            setState({
                                                ...state,
                                                latex,
                                            });
                                        }}
                                        mathquillDidMount={m => {
                                            ma = m;
                                            setField(m);
                                        }}
                                        config={{
                                            autoCommands: "pi sqrt",
                                            autoOperatorNames: "sin cos tan arcsin arccos arctan sinh cosh tanh arcsinh arccosh arctanh log ln dim Re Im floor ceil round csc sec cot acsc",
                                        }}
                                    />
                                ), [])}
                                <FormHelperText style={{margin: 0, marginBottom: 8,}}>{state.error && "Error"}</FormHelperText>
                            </FormControl>
                            <Grid container spacing={0}>
                                <Grid
                                    item
                                    xs={12}
                                    sm={5}
                                    className={classes.buttons}
                                >
                                    <ToggleButton
                                        onClick={changeFuncs}
                                        className={`${classes.button} ${classes.flex}`}
                                        {...prevent}
                                        value={"null"}
                                        disabled={isSmall && !state.fns}
                                    >
                                        {state.invFuncs ? "1st" : "2nd"}
                                    </ToggleButton>
                                    <ToggleButton
                                        onClick={() => setState({
                                            ...state,
                                            fns: !state.fns
                                        })}
                                        className={`${classes.button} ${classes.fns}`}
                                        {...prevent}
                                        value={"null"}
                                    >
                                        {!state.fns ? "Fns" : "1, 2"}
                                    </ToggleButton>
                                    <Button
                                        variant="contained"
                                        className={`${classes.button} ${classes.flex}`}
                                        {...prevent}
                                        onClick={() => update("(")}
                                    >
                                        (
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={() => update(")")}
                                        className={`${classes.button} ${classes.flex}`}
                                        {...prevent}
                                    >
                                        )
                                    </Button>
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={7}
                                    className={classes.buttons}
                                >
                                    <Button
                                        variant="contained"
                                        className={`${classes.button} ${classes.flex25}`}
                                        {...prevent}
                                        onClick={changeAngle}
                                    >
                                        {state.radians ? "DEG" : "RAD"}
                                    </Button>
                                    <Button
                                        variant="contained"
                                        className={`${classes.button} ${classes.flex25}`}
                                        {...prevent}
                                        onClick={backspace}
                                    >
                                        <Icon path={mdiBackspace} />
                                    </Button>
                                    <Button
                                        variant="contained"
                                        className={`${classes.button} ${classes.flex25}`}
                                        {...prevent}
                                        onClick={clear}
                                    >
                                        AC
                                    </Button>
                                    <Button
                                        variant="contained"
                                        className={`${classes.button} ${classes.flex25}`}
                                        color="secondary"
                                        {...prevent}
                                        onClick={toggleHistory}
                                    >
                                        <Icon path={mdiHistory} />
                                    </Button>
                                </Grid>
                            </Grid>
                            <Grid container spacing={0}>

                            {(!isSmall || state.fns) &&
                                <Grid
                                    item
                                    xs={12}
                                    sm={5}
                                    className={classes.buttons}
                                >
                                    {functions.map((number, i) => (
                                        <Button
                                            variant="contained"
                                            className={classes.button}
                                            onClick={() =>
                                                update(
                                                    number[state.invFuncs ? 3 : 2]
                                                )
                                            }
                                            {...prevent}
                                            key={i}
                                        >
                                            {number[state.invFuncs ? 1 : 0]}
                                        </Button>
                                    ))}
                                </Grid>}
                                {(!isSmall || !state.fns) &&
                                <><Grid
                                    item
                                    xs={9}
                                    sm={5}
                                    className={classes.buttons}
                                >
                                    {[...Array(9).keys(), -1].map(number => (
                                        <Button
                                            variant="contained"
                                            className={classes.button}
                                            {...prevent}
                                            onClick={() => update(number + 1)}
                                            key={number}
                                        >
                                            {number + 1}
                                        </Button>
                                    ))}
                                    <Button
                                        variant="contained"
                                        className={classes.button}
                                        onClick={() => update(".")}
                                        {...prevent}
                                    >
                                        .
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className={classes.button}
                                        onClick={handleSubmit}
                                        {...prevent}
                                    >
                                        =
                                    </Button>
                                </Grid>
                                <Grid
                                    item
                                    xs={3}
                                    sm={2}
                                    className={classes.buttons}
                                >
                                    {["×", "÷", "+", "-"].map(number => (
                                        <Button
                                            variant="contained"
                                            className={classes.button}
                                            color="secondary"
                                            {...prevent}
                                            style={{flexBasis: "100%"}}
                                            onClick={() => update(number)}
                                            key={number}
                                        >
                                            {number}
                                        </Button>
                                    ))}
                                </Grid></>}
                            </Grid>
                        </div>
                        {isMedium && (
                            <>
                                <AnimateHeight duration={500} height={showHistory.height} style={{marginTop: 8,}}>
                                    {historyBox}
                                </AnimateHeight>
                            </>
                        )}
                       {!isMedium && (
                            <div style={{
                                width: "25%",
                                height: showHistory.historyHeight,
                                transition: "width 500ms",
                                opacity: 1,
                            }} className={!showHistory.showHistory ? classes.containerLarge : null}>
                                {historyBox}
                            </div>
                        )}
                    </div>
                </form>
            </Card>
        </div>
    );
};