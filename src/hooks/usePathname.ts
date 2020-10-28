import { useRouter } from "next/router";

export default function usePathname() {
    return useRouter().pathname;
}