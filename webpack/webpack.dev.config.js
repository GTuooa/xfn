const webpack = require("webpack");
const path = require("path");
const merge = require("webpack-merge");//文件合并
const webpackConfigBase = require("./webpack.base.config");
const openBrowserPlugin = require('open-browser-webpack-plugin');//在浏览器中打开程序

const NODE_ENV = process.env.NODE_ENV
const DEVICE_TYPE = process.env.NODE_DEVICE

const BUILD_DEVICE_PATH = path.resolve(__dirname, `../build/${DEVICE_TYPE}`)
const SRC_DEVICE_PATH = path.resolve(__dirname, `../src/${DEVICE_TYPE}`)
const APP_PATH = path.resolve(SRC_DEVICE_PATH, 'app')

const webpackConfigDev = {
    mode:'development',
    entry:{
        xfnidx: [
            'webpack/hot/only-dev-server',
            `webpack-dev-server/client?http://localhost:${DEVICE_TYPE === 'mobile' ? 4800 : 3800}`,
            path.resolve(APP_PATH, 'containers/index')
        ] //入口文件
    },
    plugins:[
        // new openBrowserPlugin({url:"http://localhost:3800/build/desktop/app/index.html"}),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify("development")
        }),
        new webpack.HotModuleReplacementPlugin()
        // new webpack.HotModuleReplacementPlugin({
        //     如何配置增量编译
        //     multiStep: true
        // })
    ],
	devtool: 'inline-source-map',
    devServer:{
        // historyApiFallback: true,
        // contentBase: path.join(__dirname, "../"),
        disableHostCheck: true,
        publicPath: `/build/${DEVICE_TYPE}`,
        hot: true,
        inline: true,
        host: '0.0.0.0',
        port: DEVICE_TYPE === 'mobile' ? 4800 : 3800
    }
}
module.exports = merge(webpackConfigBase, webpackConfigDev);

// "d:dev": "export NODE_DEVICE=desktop NODE_ENV=development && webpack-dev-server --hot --inline --color --config ./webpack/webpack.dev.config.js",
