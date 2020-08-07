import React from 'react'
import ReactDOM from 'react-dom'
// import { createStore, applyMiddleware } from 'redux'
// import { Provider } from 'react-redux'
import { customStore, history } from 'app/utils'
// import Reducers from 'app/redux'
import Reducers from 'app/redux/asyncReducers'
// import CreateRouter from 'app/containers/router.js'
// import zhCN from 'antd/lib/locale-provider/zh_CN'
// import browserNavigator from 'app/utils/browserNavigator'
// import { ConfigProvider } from 'antd'
// import { xfnFetchErrorToDeveloper } from 'app/constants/fetchFunc.jsx'
// import { ROOT } from 'app/constants/fetch.constant.js'
import App from './app.js'

export let store = customStore(Reducers)

let div = document.createElement('div')
div.id = 'root'
document.body.appendChild(div)

// window.addEventListener("unhandledrejection", event => {
//     console.warn(`UNHANDLED PROMISE REJECTION: ${event.reason}`);
//     if (event.reason) { // 排除 undefined 和 null
//         let reason = event.reason
//         if (typeof(reason) === 'object') {
//             const jsonData = JSON.stringify(reason)
//             if (Array.isArray(reason)) {
//                 xfnFetchErrorToDeveloper({
//                     title: 'unhandledrejection',
//                     message: `warn1: ${jsonData}`,
//                     remark: 'promise处理'
//                 }, {msgTextSend: `${ROOT}/msg/text/send`})
//             } else {
//                 xfnFetchErrorToDeveloper({
//                     title: 'unhandledrejection',
//                     message: `warn2: ${jsonData}`,
//                     remark: 'promise处理'
//                 }, {msgTextSend: `${ROOT}/msg/text/send`})
//             }
//         } else {
//             xfnFetchErrorToDeveloper({
//                 title: 'unhandledrejection',
//                 message: `warn3: ${event.reason}`,
//                 remark: 'promise处理'
//             }, {msgTextSend: `${ROOT}/msg/text/send`})
//         }
//     } else {
//         xfnFetchErrorToDeveloper({
//             title: 'unhandledrejection',
//             message: `warn4: ${event.reason}`,
//             remark: 'promise处理'
//         }, {msgTextSend: `${ROOT}/msg/text/send`})
//     }

//     // event.preventDefault();
// })

// window.onerror = (errMsg, url, lineNumber) => {
// 	const text = `Error: ${errMsg}`
//     //
// 	// console.log('text', text);
// 	if (browserNavigator.versions.DingTalk && text.indexOf('Loading') > -1) {
//         window.location.reload() && sessionStorage.clear()
//     }
// }

ReactDOM.render(<App store={store} history={history} />, document.getElementById('root'));