const webpack = require('webpack');
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;



// var ENTRY_FILE = './game-client/index.js';
// var OUTPUT_PATH = '../../../builds/client';

var ENTRY_FILE = path.resolve(__dirname, '../../../game-client/index.js');
var OUTPUT_PATH = path.resolve(__dirname, '../../../builds/client');


module.exports = {
    mode: 'production',
    devtool: false,//'inline-source-map',
    // optimizations: {
    //     usedExports: true,
    // },
    entry: { main: ENTRY_FILE },
    output: {
        path: path.resolve(__dirname, OUTPUT_PATH),
        filename: 'client.bundle.js',
    },
    //node: { console: false, fs: 'empty', net: 'empty', tls: 'empty' },
    module: {
        rules: [
            {
                test: /\.(css|scss)$/i,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.(js|jsx|mjs)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        "presets": [
                            ["@babel/preset-env", {
                                "useBuiltIns": "usage",
                                "corejs": 3, // or 2,
                                "targets": {
                                    "firefox": "64", // or whatever target to choose .    
                                },
                            }],
                            "@babel/preset-react"
                        ],
                        "plugins": [
                            "@babel/plugin-proposal-object-rest-spread",

                        ]
                    }
                }
            },
            {
                test: /\.(png|jpe?g|gif|svg|tiff|webp)$/i,
                type: 'asset/resource',
                generator: {
                    filename: './assets/[name].[hash][ext][query]'
                }
            },
            {
                test: /\.(mp3|wav|ogg|flac|wma|aac)$/i,
                type: 'asset/resource',
                generator: {
                    filename: './assets/[name].[hash][ext][query]'
                }
            },
            {
                test: /\.(mp4|mov|wmv|avi|flv|f4v|mkv|webm|mpg)$/i,
                type: 'asset/resource',
                generator: {
                    filename: './assets/[name].[hash][ext][query]'
                }
            },
            {
                test: /\.(woff|pfa|ttf|fot|otf|woff2|jfproj|fnt)$/i,
                type: 'asset/resource',
                generator: {
                    filename: './assets/[name].[hash][ext][query]'
                }
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            "React": "react",
        }),
        // new CompressPlugin(),
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1,
        }),
        // new BundleAnalyzerPlugin(),
        // new webpack.SourceMapDevToolPlugin({
        //     filename: '[file].map',
        //     append: `\n//# sourceMappingURL=client.bundle`,
        //     fileContext: 'public'
        // })

    ]
};
