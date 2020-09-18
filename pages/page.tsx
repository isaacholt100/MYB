import { NextPageContext } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Page(props) {
    return <h1>Hello</h1>
}
export async function getServerSideProps(ctx: NextPageContext) {
    console.log(ctx);
    ctx.res.writeHead(301, {Location: "/"});
    ctx.res.end();
    return {props:{}}
}