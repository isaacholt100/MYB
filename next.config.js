const withPWA = require("next-pwa");
const WorkerPlugin = require("worker-plugin");
module.exports = withPWA({
    serverRuntimeConfig: {
        PROJECT_ROOT: __dirname,
    },
    pwa: {
        disable: process.env.NODE_ENV !== "production",
        dest: "public",
    },
    //reactStrictMode: true,
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        if (!isServer) {
            config.plugins.push(
                new WorkerPlugin({
                    globalObject: "self",
                })
            );
        }
        return config;
    },
});