const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const srcDir = path.join(__dirname, "../src");

module.exports = {
    entry: {
        popup: path.join(srcDir, "popup.tsx"),
        content_script: path.join(srcDir, "contentScript.tsx")
    },
    output: {
        path: path.join(srcDir, "../dist"),
        filename: "[name].js"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    optimization: {
        splitChunks: {
            name: "vendor",
            chunks: (chunk) => chunk.name !== 'background'
        }
    },
    plugins: [
        new CopyPlugin(
            {
                patterns: [
                    {
                        context: "public",
                        from: ".",
                        to: "../dist"
                    }
                ]
            }
        )
    ]
};
