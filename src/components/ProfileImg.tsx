import Image, { ImageProps } from "next/image";

export default function ProfileImg(props: ImageProps) {
    return (
        <Image objectFit="cover" priority key={props.src} {...props} />
    );
}