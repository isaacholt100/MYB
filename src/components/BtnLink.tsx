import Button, { ButtonProps } from "@material-ui/core/Button"
import Link, { LinkProps } from "next/link";
import { forwardRef, ReactChildren } from "react";
interface IProps {
    className: string;
    href: string;
    hrefAs: string;
    children: ReactChildren;
    prefetch: boolean;
}

export default forwardRef<IProps, any>(({ className, href, hrefAs, children, prefetch }, ref) => (
    <Link href={href} as={hrefAs} prefetch={prefetch} {...{ref} as any}>
        <a className={className}>
            {children}
        </a>
    </Link>
));