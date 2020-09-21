const withPWA = require("next-pwa");
const withWorkers = require("@zeit/next-workers");
const WorkerPlugin = require("worker-plugin");
module.exports = withPWA(/*withWorkers(*/{
    pwa: {
        disable: process.env.NODE_ENV !== "production",
        dest: "public",
    },
    //reactStrictMode: true,
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        if (!isServer) {
            config.plugins.push(
                new WorkerPlugin({
                    // use "self" as the global object when receiving hot updates.
                    globalObject: "self",
                })
            );
        }
        return config;
    },
})//);