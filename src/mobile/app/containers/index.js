import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { customStore } from 'app/utils'
import Reducers from 'app/redux/asyncReducers'
import CreateRouter from 'app/containers/router.js'
import browserNavigator from 'app/utils/browserNavigator'
import { ROOT } from 'app/constants/fetch.constant.js'
import FastClick from 'fastclick'
import { xfnFetchErrorToDeveloper } from 'app/constants/fetchFunc.jsx'

FastClick.prototype.focus = function(targetElement) {
    targetElement.focus();
}

if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', () => {
        FastClick.attach(document.body)
    }, false)
}

let store = customStore(Reducers)

var div = document.createElement('div')
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
//
//     alert('提示信息：'+text)
// 	// if (browserNavigator.versions.DingTalk && text.indexOf('Loading') > -1) {
// 	// 	alert('提示信息：'+text)
// 	// 	location.replace(`${ROOTURL}/index.html?dd_nav_bgcolor=FFFFFFFF&isOV=false&corpid=${sessionStorage.getItem('corpId')}`) && sessionStorage.clear()
// 	// } else {
// 	// 	location.replace(`http://localhost:4800/build/mobile/app/index.html`) && sessionStorage.clear()
// 	// }
// }

ReactDOM.render(
    <Provider store={store}>
        <CreateRouter />
    </Provider>,
    document.getElementById('root')
)
