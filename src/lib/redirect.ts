export default () => {
    return window.location.search.slice(1).split("&").find(s => s.startsWith("to=/")).replace("to=", "");
};
