import * as esbuild from "esbuild-wasm";


export const unpkgPathPlugin = () => {
    return {
        name: "unpkg-path-plugin",
        setup(build: esbuild.PluginBuild) {
            //handle index.js
            build.onResolve({ filter: /(^index\.js$)/ }, () => {
                return { path: "index.js", namespace: "a" };
            });

            //handle relative path
            build.onResolve({ filter: /^\.+\// }, (args: any) => {
                return {
                    namespace: "a",
                    path: new URL(
                        args.path,
                        `https://unpkg.com${args.resolveDir}/`,
                    ).href,
                };
            });
            //handle nested path
            build.onResolve({ filter: /.*/ }, async (args: any) => {
                if (args.path === "index.js") {
                    return { path: args.path, namespace: "a" };
                }

                return {
                    namespace: "a",
                    path: `https://unpkg.com/${args.path}`,
                };
            });

        },
    };
};
