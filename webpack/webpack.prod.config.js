const webpack = require("webpack")
const path = require("path")
const webpackConfigBase = require("./webpack.base.config")
const CleanWebpackPlugin = require("clean-webpack-plugin")
const merge = require("webpack-merge")
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
// const DateLib = require('../src/desktop/app/utils/DateLib')

const NODE_ENV = process.env.NODE_ENV
const DEVICE_TYPE = process.env.NODE_DEVICE

const BUILD_DEVICE_PATH = path.resolve(__dirname, `../build/${DEVICE_TYPE}`)
const SRC_DEVICE_PATH = path.resolve(__dirname, `../src/${DEVICE_TYPE}`)
const APP_PATH = path.resolve(SRC_DEVICE_PATH, 'app')

let webpackConfigProd = {
    mode: "production",
    entry:{
        xfnidx: [path.resolve(APP_PATH, 'containers/index')], //入口文件
        // xfnpkg: [
        //     // 'antd-mobile',
        //     // 'es6-shim',
        //     // 'history',
        //     // 'immutable',
        //     // 'isomorphic-fetch',
        //     'react',
        //     'react-dom',
        //     // 'react-immutable-render-mixin',
        //     // 'react-redux',
        //     // 'react-router',
        //     // 'react-router-redux',
        //     // 'redux',
        //     // 'redux-thunk'
        // ]
    },
    // output: {
    //     // The build folder.
    //     path: BUILD_DEVICE_PATH,
    //     // Generated JS file names (with nested folders).
    //     // There will be one main bundle, and one file per asynchronous chunk.
    //     // We don't currently advertise code splitting but Webpack supports it.
    //     filename: 'static/js/[name].[chunkhash:8].js',
    //     chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
    //     // We inferred the "public path" (such as / or /my-project) from homepage.
    //     publicPath: publicPath,
    //     // Point sourcemap entries to original disk location (format as URL on Windows)
    //     devtoolModuleFilenameTemplate: info =>
    //       path
    //         .relative(paths.appSrc, info.absoluteResourcePath)
    //         .replace(/\\/g, '/'),
    // },
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
            chunks: 'all',   // initial、async和all
            minSize: 30000,   // 形成一个新代码块最小的体积
            maxAsyncRequests: 5,   // 按需加载时候最大的并行请求数
            maxInitialRequests: 3,   // 最大初始化请求数
            automaticNameDelimiter: '~',   // 打包分割符
            name: true,
            cacheGroups: {
                vendors: {
                    test: /(react|react-dom|react-redux|react-router-dom|immutable|dingtalk-jsapi|react-immutable-render-mixin|redux-thunk|antd|es6-shim|isomorphic-fetch|history)/,
                    // test: /node_modules\//,
                    chunks: 'all',
                    name: 'xfnpkg',
                    priority: 100,
                    // enforce: true
                },
                'async-commons': { // 其余异步加载包
                  chunks: 'async',
                  minChunks: 2,
                  name: 'async-commons',
                  priority: 90,
                },
                commons: { // 其余同步加载包
                  chunks: 'all',
                  minChunks: 2,
                  name: 'commons',
                  priority: 80,
                },
                // vendor: {
                //     test: /(react|react-dom|react-redux|react-router-dom|immutable|dingtalk-jsapi|react-immutable-render-mixin|redux-thunk|antd)/,
                //     chunks: 'all',
                //     name: 'xfnpkg',
                //     priority: 100,
                //     enforce: true
                // },
                // constants: {
                //     test: /constants\//,
                //     chunks: 'all',
                //     priority: -20,
                //     name: 'constants',
                // },
                // components: { // split `common`和`components`目录下被打包的代码到`page/commons.js && .css`
                //     chunks: 'all',
                //     test: /components\//,
                //     name: 'commons',
                //     priority: -20,
                // },
                // utils: { // split `common`和`components`目录下被打包的代码到`page/commons.js && .css`
                //     chunks: 'all',
                //     test: /utils\//,
                //     name: 'utils',
                //     priority: -20,
                // },
                // echartsVenodr: { // 异步加载echarts包
                //   test: /(echarts|zrender)/,
                //   priority: 100, // 高于async-commons优先级
                //   name: 'echartsVenodr',
                //   chunks: 'async'
                //  },
                // commons: {
                //     chunks: 'all',
                //     minChunks: 2,
                //     name: 'commons',
                //     // maxInitialRequests: 5,
                //     minSize: 0,
                //     priority: 80
                // } 
            }
        },
        // minimizer: true
        // minimizer: [
        //     new UglifyJsPlugin({
        //         cache: true,
        //         parallel: true,
        //         uglifyOptions: {
        //             compress: {
        //                 warnings: false,
        //                 drop_debugger: true,
        //                 drop_console: false
        //             }
        //         }
        //     }),
        //     new OptimizeCSSAssetsPlugin({
        //         cssProcessorOptions: {
        //            safe: true
        //         }
        //     })
        // ]

        minimizer: [
            new TerserPlugin({
              terserOptions: {
                parse: {
                  // we want terser to parse ecma 8 code. However, we don't want it
                  // to apply any minfication steps that turns valid ecma 5 code
                  // into invalid ecma 5 code. This is why the 'compress' and 'output'
                  // sections only apply transformations that are ecma 5 safe
                  // https://github.com/facebook/create-react-app/pull/4234
                  ecma: 8,
                },
                compress: {
                  ecma: 5,
                  warnings: false,
                  // Disabled because of an issue with Uglify breaking seemingly valid code:
                  // https://github.com/facebook/create-react-app/issues/2376
                  // Pending further investigation:
                  // https://github.com/mishoo/UglifyJS2/issues/2011
                  comparisons: false,
                  // Disabled because of an issue with Terser breaking valid code:
                  // https://github.com/facebook/create-react-app/issues/5250
                  // Pending futher investigation:
                  // https://github.com/terser-js/terser/issues/120
                  inline: 2,
                },
                mangle: {
                  safari10: true,
                },
                output: {
                  ecma: 5,
                  comments: false,
                  // Turned on because emoji and regex is not minified properly using default
                  // https://github.com/facebook/create-react-app/issues/2488
                  ascii_only: true,
                },
              },
              // Use multi-process parallel running to improve the build speed
              // Default number of concurrent runs: os.cpus().length - 1
              parallel: true,
              // Enable file caching
              cache: true,
              sourceMap: true,
            }),
            // new UglifyJsPlugin({
            //     cache: true,
            //     parallel: true,
            //     uglifyOptions: {
            //         compress: {
            //             warnings: false,
            //             drop_debugger: true,
            //             drop_console: false
            //         }
            //     }
            // }),
            new OptimizeCSSAssetsPlugin({
              cssProcessorOptions: {
                safe: true
              },
            }),
          ],
          // Automatically split vendor and commons
          // https://twitter.com/wSokra/status/969633336732905474
          // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
        //   splitChunks: {
        //     chunks: 'all',
        //     name: false,
        //   },
        //   // Keep the runtime chunk seperated to enable long term caching
        //   // https://twitter.com/wSokra/status/969679223278505985
          // runtimeChunk: true,
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
                {search: '3.1.2', replace: `4.0.22`},
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

// minimizer: [
        //   new UglifyJsPlugin({
        //     cache: true,
        //     parallel: true,
        //     sourceMap: true // set to true if you want JS source maps
        //   }),
        //   new OptimizeCSSAssetsPlugin({})
        // ]
        //  splitChunks: {
        //     cacheGroups: {
        //         // commons: {
        //         //     chunks: 'initial',
        //         //     minChunks: 2,
        //         //     maxInitialRequests: 5,
        //         //     minSize: 0
        //         // },
        //         vendor: {
        //             test: /node_modules/,
        //             chunks: 'initial',
        //             name: 'xfnpkg',
        //             priority: 10,
        //             enforce: true
        //         }
        //     }
        // },
        // minimizer: [
        //     new UglifyJsPlugin({
        //         cache: true,
        //         parallel: true,
        //         uglifyOptions: {
        //             compress: {
        //                 warnings: false,
        //                 drop_debugger: true,
        //                 drop_console: false
        //             }
        //         }
        //     }),
        //     new OptimizeCSSAssetsPlugin({
        //         cssProcessorOptions: {
        //            safe: true
        //         }
        //     })
        // ]

        // 默认值
        // splitChunks: {
        //     chunks: 'all',
        //     minSize: 30000,
        //     minChunks: 1,
        //     maxAsyncRequests: 5,
        //     maxInitialRequests: 3,
        //     automaticNameDelimiter: '~',
        //     name: true,
        //     cacheGroups: {
        //         vendors: {
        //         test: /[\\/]node_modules[\\/]/,
        //         priority: -10
        //     },
        //     default: {
        //         minChunks: 2,
        //         priority: -20,
        //         reuseExistingChunk: true
        //     }
        // }

        // splitChunks: {

        //     // chunks: 'all',
        //     // minSize: 30000,
        //     // minChunks: 1,
        //     // maxAsyncRequests: 5,
        //     // maxInitialRequests: 3,
        //     // automaticNameDelimiter: '~',
        //     // name: true,

        //     cacheGroups: {
        //         // commons: {
        //         //     chunks: 'all',
        //         //     minChunks: 2,
        //         //     maxInitialRequests: 5,
        //         //     minSize: 0,
        //         //     priority: 0,
        //         // },
        //         commons: { // split `common`和`components`目录下被打包的代码到`page/commons.js && .css`
        //             chunks: 'all',
        //             test: /components\//,
        //             name: 'commons',
        //             priority: -10,
        //             enforce: true
        //         },
        //         utils: { // split `common`和`components`目录下被打包的代码到`page/commons.js && .css`
        //             chunks: 'all',
        //             test: /utils\//,
        //             name: 'utils',
        //             priority: -10,
        //             enforce: true
        //         },
        //         vendor: {
        //             test: /node_modules\//,
        //             chunks: 'all',
        //             name: 'xfnpkg',
        //             priority: 0,
        //             enforce: true
        //         },
        //         default: {
        //             chunks: 'all',
        //             minChunks: 2,
        //             priority: -20,
        //             reuseExistingChunk: true,
        //         }
        //     }
        // },
