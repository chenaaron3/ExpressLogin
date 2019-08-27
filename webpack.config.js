const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: "./public/javascripts/animations.js",
    output: {
        path: path.resolve(__dirname, 'public/dist'),
        filename: 'bundle.js'
    },
    mode: "development",
    plugins: [
        new CleanWebpackPlugin(),
    ],
};