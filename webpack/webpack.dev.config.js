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
            `webpack-dev-server/client?http://localhost:${DEVICE_TYPE === 'mobile' ? 4800 : 3500}`,
            path.resolve(APP_PATH, 'containers/index')
        ] //入口文件
    },
    // output:{        
    //     path: BUILD_DEVICE_PATH, //输出目录的配置，模板、样式、脚本、图片等资源的路径配置都相对于它
    //     // publicPath: '../', //模板、样式、脚本、图片等资源对应的的路径
    //     publicPath: './', //模板、样式、脚本、图片等资源对应的的路径
    //     filename: `js${timestamp}/[name].js`, //每个页面对应的主js的生成配置
    //     // chunkFilename: 'js/[id][hash:8].chunk.js' //chunk生成的配置
    // },
    // resolve:{
    //     extensions:['.js','.jsx','json','.css'], //需要编译的文件类型
    // },
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
        port: DEVICE_TYPE === 'mobile' ? 4500 : 3500
    },
    // optimization: {
    //     // Automatically split vendor and commons
    //     // https://twitter.com/wSokra/status/969633336732905474
    //     // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
    //     splitChunks: {
    //       chunks: 'all',
    //       name: false,
    //     },
    //     // Keep the runtime chunk seperated to enable long term caching
    //     // https://twitter.com/wSokra/status/969679223278505985
    //     runtimeChunk: true,
    // },
}
module.exports = merge(webpackConfigBase, webpackConfigDev);

// "d:dev": "export NODE_DEVICE=desktop NODE_ENV=development && webpack-dev-server --hot --inline --color --config ./webpack/webpack.dev.config.js",
