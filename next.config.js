const withPWA = require("next-pwa");
module.exports = withPWA({
    serverRuntimeConfig: {
        PROJECT_ROOT: __dirname,
    },
    pwa: {
        disable: process.env.NODE_ENV !== "production",
        dest: "public",
    },
    //reactStrictMode: true,
    images: {
        domains: ["res.cloudinary.com"]
    }
});