const path = require('path');
const webpack = require('webpack');

var ENTRY_FILE = path.resolve(__dirname, '../../../game-server/index.js');
var OUTPUT_PATH = path.resolve(__dirname, '../../../builds/server').replace(/\\/ig, '/');

module.exports = {
    entry: ENTRY_FILE,
    output: {
        path: OUTPUT_PATH,
        filename: 'server.bundle.dev.js',
        devtoolModuleFilenameTemplate: 'file:///[absolute-resource-path]'
    },
    devtool: "source-map",
    mode: 'development',
    optimization: {
        usedExports: true,
    },
};