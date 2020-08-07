import fetch from 'isomorphic-fetch'
let network = 'network=wifi'
let source = 'source=desktop'
// let psiCorpId = sessionStorage.getItem('corpId');
let psiCorpId = 'ding9849431a8160211e';
import { XFNVERSION, ROOTURL, getUrlParam } from 'app/constants/fetch.constant.js'
import { notification } from 'antd';
import { DateLib } from 'app/utils'
import { NotificationModal } from 'app/containers/components/NotificationModal'
import * as thirdParty from 'app/thirdParty'
import { fromJS } from 'immutable';

const href = location.href
const urlParam = getUrlParam(href)

// 在网页端或体验模式的判断
global.isInWeb = urlParam.isInWeb && urlParam.isInWeb === 'true'
const isWebPlay = urlParam.isplayground && urlParam.isplayground === 'true'
global.isPlay = false
global.isplayground = isWebPlay
// const start = href.lastIndexOf('&')
// let serverMessage = location.href.substr(start+1)
// const isplaygroundName = serverMessage.substr(0, 12)
// const isplaygroundBool = serverMessage.substr(13, 4)
// global.isInWeb = (serverMessage.substr(0, 7) === 'isInWeb' && serverMessage.substr(8, 4) === 'true') ? true : false
// const isWebPlay = isplaygroundName === 'isplayground' && isplaygroundBool === 'true'
// global.isPlay = false
// global.isplayground = isWebPlay ? true : false

let fetchErrCount = 0

export default
function fetchFunc(type, method, data, callback, URL) {

	const psiSobId = `psiSobId=${sessionStorage.getItem('psiSobId')}`
	const psiCorpId = `psiCorpId=${sessionStorage.getItem('corpId')}`

	const isPlayStr = `isPlay=${global.isPlay}`
	const version = `version=${XFNVERSION}`
	const timestamp = `timestamp=${new Date().getTime()}`
	let ssid = `ssid=''`

	if (global.isInWeb) {
		source = 'source=webDesktop'
	}

	if (global.ssid) {
		ssid = `ssid=${global.ssid}`
	}

	let url, option

	switch (method.toUpperCase()) {
		case 'GET':
			// url = URL[type] + '?' + (data ? [data, network, source].join('&') : [network, source].join('&'))
			url = URL[type] + '?' + (data ? [data, network, source, psiSobId, version, timestamp, isPlayStr, ssid].join('&') : [network, source, psiSobId, version, timestamp, isPlayStr, ssid].join('&'))
			option = {
				credentials: 'include'
			}
			break
		case 'POST':
			// url = URL[type] + '?' + [network, source].join('&')
			if(type === 'insertStorageCardList' || type === 'modifyStorageCardList') {
				url = URL[type] + '?' + [network, source, psiSobId, psiCorpId, version, timestamp, isPlayStr, ssid].join('&')
			}else{
				url = URL[type] + '?' + [network, source, psiSobId, version, timestamp, isPlayStr, ssid].join('&')
			}
			option = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				credentials: 'include',
				body: data
			}
			break
		case 'UPLOAD':
			url = URL[type] + '?' + [network, source, version, timestamp, isPlayStr, ssid].join('&')
			option = {
				method: 'POST',
				credentials: 'include',
				body: data
			}
			break
		default:
			return console.error('method is not GET or POST')
	}

	try {
		fetch(url, option)
		.then(res => {
			if (res.status === 200) {
				fetchErrCount = 0
				return res.json()

			} else {
				// notification.open({
				// 	key: 'errNotification',
				// 	message: '系统发生了未知错误',
				// 	placement: 'bottomRight',
				// 	duration: null,
				// 	description: NotificationModal(url, res.status),
				// });
				
				if (res.status.toString().indexOf('4') === 0 || res.status.toString().indexOf('5') === 0) {
					fetchErrCount = fetchErrCount+1
					if (fetchErrCount >= 5) {
						url.indexOf('xfannixapp1948.eapps.dingtalkcloud.com') > -1
						&& thirdParty.Confirm({
							title: '提示',
							message: '服务区连续多次未正常响应，网络状态可能不佳，点击“确认”可切换至备用通道。请注意：线路切换将重新登录。',
							buttonLabels: ['取消', '确认'],
							onSuccess : (result) => {
								if (result.buttonIndex === 1) {

									const post = href.indexOf('?')
									const endPost = href.indexOf('#/') == -1 ? href.length : href.indexOf('#/')
									let serverMessage = href.slice(post+1, endPost)

									window.location.href = `${ROOTURL}/index.html?${serverMessage}&urlbackup=true`
								}
							}
						})
					}
				}

				// fetchErrorToDeveloper({
				// 	title: '浏览器报'+res.status,
				// 	message: `路由：${url};参数：${JSON.stringify(option.body)};corpId：${sessionStorage.getItem('corpId')}`,
				// 	remark: '网络异常或服务器拦截'
				// }, URL, 'reFetch')
				return {
					code: '-2',
					message: `通信异常，服务器返回码${res.status}`
				}
			}
		})
		.catch(err => {
			console.log('服务器异常：'+err);
			// notification.open({
			// 	key: 'errNotification',
			// 	message: '系统发生了未知错误',
			// 	placement: 'bottomRight',
			// 	duration: null,
			// 	description: NotificationModal(url, '无'),
			// 	// style: {width: '520px', padding: 0},
			// });
			// fetchErrorToDeveloper({
			// 	title: '服务器未捕获异常',
			// 	message: `路由：${url};参数：${JSON.stringify(option.body)};corpId：${sessionStorage.getItem('corpId')}`,
			// 	remark: '服务器异常'
			// }, URL, 'reFetch')
			return {
				code: '-2',
				message: `系统无响应`
			}
		})
		.then(json => {
			if (json.code === 1) {
				notification.open({
					key: 'errNotification',
					message: '系统发生了未知错误',
					placement: 'bottomRight',
					duration: null,
					description: NotificationModal(url, '200', json.code, json.message),
				});
				// fetchErrorToDeveloper({
				// 	title: '服务器报1异常',
				// 	message: `路由：${url};参数：${JSON.stringify(option.body)};corpId：${sessionStorage.getItem('corpId')}`,
				// 	remark: '服务器异常'
				// }, URL, 'reFetch')
			}
			callback(json)
		})
	} catch (e) {
		// 捕获处理
		console.log(e);
		// fetchErrorToDeveloper({
		// 	title: 'TypeError: Failed to fetch',
		// 	message: `路由：${url};参数：${JSON.stringify(option.body)};corpId：${sessionStorage.getItem('corpId')}`,
		// 	remark: 'fetch请求捕获异常'
		// }, URL, 'reFetch')
	}
}

// function fetchErrorToDeveloper(opt, URL, reFetch) {

// 	const psiSobId = `psiSobId=${sessionStorage.getItem('psiSobId')}`
// 	const psiCorpId = `psiCorpId=${sessionStorage.getItem('corpId')}`

// 	const isPlayStr = `isPlay=${global.isPlay}`
// 	const version = `version=${XFNVERSION}`
// 	const timestamp = `timestamp=${new Date().getTime()}`

// 	let url, option
// 	url = URL.msgTextSend + '?' + [network, source, psiSobId, version, timestamp, isPlayStr].join('&')

// 	option = {
// 		method: 'POST',
// 		headers: {
// 			'Content-Type': 'application/json'
// 		},
// 		credentials: 'include',
// 		body: JSON.stringify({message: `标题：${opt.title}；` + '\n' + ` 信息：${opt.message}；` + '\n' + ` 备注：${opt.remark}；` + '\n' + ` 时间：${new DateLib()}`})
// 	}

// 	try {
// 		fetch(url, option)
// 		.then(res => {
// 			if (res.status === 200) {
// 				return res.json()
// 			} else {
// 				if (reFetch === 'reFetch') {
// 					setTimeout(fetchErrorToDeveloper({
// 						title: '网络异常3秒后的重试',
// 						message: JSON.stringify(option.body),
// 						remark: '发生异常时发送钉钉消息异常'
// 					}, URL), 3000)
// 				}
// 			}
// 		})
// 		.catch(err => {
// 			return {
// 				code: '-2',
// 				message: `系统无响应`
// 			}
// 		})
// 		.then(json => {})
// 	} catch (e) {
// 		// 捕获处理
// 		if (reFetch === 'reFetch') { // 本次请求异常，再试一次，报告本次异常，'reFetch'控制不会死循环
// 			fetchErrorToDeveloper({
// 				title: 'TypeError: Failed to fetch',
// 				message: JSON.stringify(option.body),
// 				remark: '发生异常时发送钉钉消息异常'
// 			}, URL)
// 		}
// 	}
// }

export function xfnFetchErrorToDeveloper(opt, URL, reFetch) {

	const psiSobId = `psiSobId=${sessionStorage.getItem('psiSobId')}`
	const psiCorpId = `psiCorpId=${sessionStorage.getItem('corpId')}`

	const isPlayStr = `isPlay=${global.isPlay}`
	const version = `version=${XFNVERSION}`
	const timestamp = `timestamp=${new Date().getTime()}`

	let url, option
	url = URL.msgTextSend + '?' + [network, source, psiSobId, version, timestamp, isPlayStr].join('&')

	option = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include',
		body: JSON.stringify({message: `标题：${opt.title}；` + ' ' + ` 信息：${opt.message}；` + ' ' + ` 备注：${opt.remark}；` + ' ' + ` 时间：${new DateLib()}`})
	}

	try {
		fetch(url, option)
		.then(res => {
			if (res.status === 200) {
				return res.json()
			} 
		})
		.catch(err => {
			return {
				code: '-2',
				message: `系统无响应`
			}
		})
		.then(json => {})
	} catch (e) {
	}
}