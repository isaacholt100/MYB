export default () => ({
    get(name) {
        const cookiestring = RegExp(`${name}[^;]+`).exec(document.cookie);
        return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./, "") : "");
    },
    set(name, value, exp) {
        document.cookie = `${name}=${value};${exp ? `expires=${new Date().getTime() + 1e20};` : ""}path=/;`;
    },
    delete(name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    },
    exists(name) {
        return this.get(name) !== "";
    },
    empty(name) {
        return this.get(name) === "";
    }
});