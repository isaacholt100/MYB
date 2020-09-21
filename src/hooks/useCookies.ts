const cookies = {
    get(name: string) {
        const cookiestring ={}// RegExp(`${name}[^;]+`).exec(document.cookie);
        return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./, "") : "");
    },
    set(name: string, value: string, exp: boolean) {
        //document.cookie = `${name}=${value};${exp ? `expires=${new Date().getTime() + 1e20};` : ""}path=/;`;
    },
    delete(name: string) {
        //document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    },
    exists(name: string) {
        return cookies.get(name) !== "";
    },
    isEmpty(name: string) {
        return cookies.get(name) === "";
    }
}
export default () => cookies;