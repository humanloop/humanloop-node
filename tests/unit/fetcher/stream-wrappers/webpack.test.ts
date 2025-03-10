import webpack from "webpack";

describe("test env compatibility", () => {
    test("webpack", () => {
        return new Promise<void>((resolve, reject) => {
            webpack(
                {
                    mode: "production",
                    target: "node",
                    entry: "./src/index.ts",
                    module: {
                        rules: [
                            {
                                test: /\.tsx?$/,
                                use: "ts-loader",
                                exclude: /node_modules/,
                            },
                        ],
                    },
                    resolve: {
                        extensions: [".tsx", ".ts", ".js"],
                        fallback: {
                            async_hooks: false,
                        },
                    },
                },
                (err, stats) => {
                    try {
                        expect(err).toBe(null);
                        if (stats?.hasErrors()) {
                            console.log(stats?.toString());
                        }
                        expect(stats?.hasErrors()).toBe(false);
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                },
            );
        });
    }, 60_000);
});
