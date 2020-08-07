const webpack = require("webpack")
const path = require("path")
const webpackConfigBase = require("./webpack.base.config")
const CleanWebpackPlugin = require("clean-webpack-plugin")
const merge = require("webpack-merge")
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const DateLib = require('../src/desktop/app/utils/DateLib')

const NODE_ENV = process.env.NODE_ENV
const DEVICE_TYPE = process.env.NODE_DEVICE

const BUILD_DEVICE_PATH = path.resolve(__dirname, `../build/${DEVICE_TYPE}`)
const SRC_DEVICE_PATH = path.resolve(__dirname, `../src/${DEVICE_TYPE}`)
const APP_PATH = path.resolve(SRC_DEVICE_PATH, 'app')

let webpackConfigProd = {
    mode: "production",
    entry:{
        xfnidx: [path.resolve(APP_PATH, 'containers/index')], //入口文件
        xfnpkg: [
            // 'antd-mobile',
            'es6-shim',
            'history',
            // 'immutable',
            'isomorphic-fetch',
            // 'react',
            // 'react-dom',
            // 'react-immutable-render-mixin',
            // 'react-redux',
            // 'react-router',
            // 'react-router-redux',
            // 'redux',
            // 'redux-thunk'
        ]
    },
    module: {
        rules: []
    },
    plugins:[
        new CleanWebpackPlugin([`build/${DEVICE_TYPE}`],{
            root: path.join(__dirname, "../")
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        // new PreloadWebpackPlugin({
        //     rel: 'preload',
        //     include: ['Lrpz', 'LrAccount']
        // })
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    chunks: 'initial',
                    minChunks: 2,
                    maxInitialRequests: 5,
                    minSize: 0
                },
                vendor: {
                    test: /node_modules/,
                    chunks: 'initial',
                    name: 'xfnpkg',
                    priority: 10,
                    enforce: true
                }
            }
        },
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                uglifyOptions: {
                    compress: {
                        warnings: false,
                        drop_debugger: true,
                        drop_console: false
                    }
                }
            }),
            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: {
                   safe: true
                }
            })
        ]
    }
}

if (process.env.NODE_SERVER.substr(0, 4) === 'test') {
    // return gulp.src(path.resolve(JS_PATH, '*.js'))
    // .pipe( gulp.dest(JS_PATH))
    webpackConfigProd.module.rules.push({
        test: /\.(js|jsx)?$/,
        loader: 'webpack-replace-loader',
        options: {
            arr: [
                {search: '@xfn-version', replace: `@${new DateLib().getFullDate()}`},
            ]
        }
    })
} else if (process.env.NODE_SERVER.substr(0, 4) === 'form') {
    webpackConfigProd.module.rules.push({
        test: /\.(js|jsx)?$/,
        loader: 'webpack-replace-loader',
        options: {
            arr: [
                {search: 'http://papitst.xfannix.com', replace: 'https://papi.xfannix.com', attr: 'g'},
                {search: 'http://dtst.xfannix.com', replace: 'https://desktop.xfannix.com', attr: 'g'},
                {search: 'http://mtst.xfannix.com', replace: 'https://mobile.xfannix.com', attr: 'g'},
                {search: 'test/', replace: 'annex/', attr: 'g'},
                {search: '@xfn-version', replace: `@${new DateLib().getFullDate()}`},
                {search: '3.1.2', replace: `4.0.24`},
            ]
        }
    })
} else if (process.env.NODE_SERVER.substr(0, 4) === 'pref') {
    webpackConfigProd.module.rules.push({
        test: /\.(js|jsx)?$/,
        loader: 'webpack-replace-loader',
        options: {
            arr: [
                {search: 'http://papitst.xfannix.com', replace: 'https://papipre.xfannix.com', attr: 'g'},
                // {search: 'http://papitst.xfannix.com', replace: 'https://xfannixapp1948.eapps.dingtalkcloud.com', attr: 'g'},
                {search: 'http://dtst.xfannix.com', replace: 'https://dpre.xfannix.com', attr: 'g'},
                {search: 'http://mtst.xfannix.com', replace: 'https://mpre.xfannix.com', attr: 'g'},
                {search: 'test/', replace: 'annex/', attr: 'g'},
                {search: '@xfn-version', replace: `@${new DateLib().getFullDate()}`},
            ]
        }
    })
}

module.exports = merge(webpackConfigBase, webpackConfigProd);
