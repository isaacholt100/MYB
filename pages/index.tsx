import { Typography } from "@material-ui/core";
import { GetStaticProps } from "next";

export default function Home() {
    return (
        <div>
            <Typography variant="h1">Hello World!</Typography>
        </div>  
    );
}

export const getStaticProps: GetStaticProps = async () => {
    return {
        props: {
            
        }
    }
}