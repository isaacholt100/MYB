/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import {
    Typography,
    CardActionArea,
    Box
} from "@material-ui/core";
import ListView from "../../components/ListView";
import Icon from "../../components/Icon";
import { mdiApps, mdiBook, mdiHelp } from "@mdi/js";
import Link from "next/link";

export default function Tools() {
    const tools = [
        [<Box fontSize={24} textAlign="center">=</Box>, "Calculator", "/calculator"],
        [<Icon path={mdiHelp} color="inherit" />, "Prime Tester", "/primetest"],
        [<Icon path={mdiApps} />, "Periodic table", "/periodictable"],
        [<Icon path={mdiBook} />, "Dictionary", "/dictionary"],
    ];
    return (
        <ListView
            name="Tool"
            tabs={[]}
            filtered={tools}
            height={104}
            Item={t => (
                <Link href={"/tools" + t[2]}>
                    <CardActionArea className={"flex full_height justify_content_start p_8 align_items_center"}>
                        <Box display="flex">
                            <Box
                                borderRadius="50%"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                height={36}
                                width={36}
                                bgcolor="secondary.main"
                                color="background.paper"
                                mr={1}
                            >
                                {t[0]}
                            </Box>
                            <Typography variant="h6">{t[1]}</Typography>
                        </Box>
                    </CardActionArea>
                </Link>
            )}
            noCreate={true}
        />
    );
};
