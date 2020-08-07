import fetch from 'isomorphic-fetch'
import thirdParty from 'app/thirdParty'
import { browserNavigator } from 'app/utils'

// let network = 'network=wifi'
// let source = 'source=desktop'
// // let psiCorpId = sessionStorage.getItem('corpId');
// let psiCorpId = 'ding9849431a8160211e';
import { ROOTURL, XFNVERSION, getUrlParam } from 'app/constants/fetch.constant.js'


// console.log('dede', getUrlParam);
const href = window.location.href
const urlParam = getUrlParam(href)

const isWebPlay = urlParam.isplayground && urlParam.isplayground === 'true'
global.isPlay = false
global.isplayground = isWebPlay ? true : false

const isOrgTrialEntry = urlParam.isOrgTrialEntry && urlParam.isOrgTrialEntry === 'true'
global.isOrgTrialEntry = isOrgTrialEntry
global.showOrgTrialEntry = global.isplayground && isOrgTrialEntry

let fetchErrCount = 0

// const start = href.lastIndexOf('&')
// let serverMessage = window.location.href.substr(start+1)
// const isplaygroundName = serverMessage.substr(0, 12)
// const isplaygroundBool = serverMessage.substr(13, 4)

// const isWebPlay = isplaygroundName === 'isplayground' && isplaygroundBool === 'true'
// global.isPlay = false
// global.isplayground = isWebPlay ? true : false

export default
function fetchFunc(type, method, data, callback, loadingtext, URL) {

	const source = `source=${browserNavigator.versions.android ? 'android' : 'ios'}`
	let network = 'network=notfetch'
	const psiSobId = `psiSobId=${sessionStorage.getItem('psiSobId')}`

	if (global.isplayground) {
		fetchLocalApi(type, method, data, callback, loadingtext, network, source, URL, psiSobId)
	} else {
		if (type === 'getddconfig' || !browserNavigator.versions.DingTalk) {
			fetchLocalApi(type, method, data, callback, loadingtext, network, source, URL, psiSobId)
		} else {
			thirdParty.getNetworkType({
				onSuccess : (value) => {
					network = `network=${value.result}`
					fetchLocalApi(type, method, data, callback, loadingtext, network, source, URL, psiSobId)
				},
				onFail : (err) => {
					network = 'network=""'
					fetchLocalApi(type, method, data, callback, loadingtext, network, source, URL, psiSobId)
				}
			})
		}
	}
}

function fetchLocalApi(type, method, data = '', callback, loadingtext, network, source, URL, psiSobId) {

	const isPlayStr = `isPlay=${global.isPlay}`
	const version = `version=${XFNVERSION}`
	const timestamp = `timestamp=${new Date().getTime()}`
	let ssid = `ssid=''`

	if (global.ssid) {
		ssid = `ssid=${global.ssid}`
	}

	let url, option
	// console.log(psiSobId,'psiSobId');
	switch (method.toUpperCase()) {
		case 'GET':
			url = URL[type] + '?' + (data ? [data, network, source, psiSobId, version, timestamp, isPlayStr, ssid].join('&') : [network, source, psiSobId, version, timestamp, isPlayStr, ssid].join('&'))
			option = {
				credentials: 'include',
				headers: {
					// 'Accept-Encoding': 'gzip, deflate'
				}
			}
			break
		case 'POST':
			url = URL[type] + '?' + [network, source, psiSobId, version, timestamp, isPlayStr, ssid].join('&')
			option = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					// 'Accept-Encoding': 'gzip, deflate'
				},
				credentials: 'include',
				body: data
			}
			break
		default:
			return console.error('method is not GET or POST')
	}

	// alert('url:'+type)
	// alert('url'+url)

	return fetch(url, option)
	.then(res => {
		if (res.status === 200) {
			fetchErrCount = 0
			return res.json()
		} else {
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
			return {
				code: '-2',
				// message: err
				message: `通信异常，服务器返回码${res.status}`
			}
		}
	})
	.catch(err => {
		return {
			code: '-2',
			message: `系统无响应`
		}
	})
	.then(json => {
		// if (global.TRACING) {
		// 	alert(method+','+url+','+JSON.stringify(json))
		// }
		callback(json)
	})
}


export function xfnFetchErrorToDeveloper(opt, URL) {

	const source = `source=${browserNavigator.versions.android ? 'android' : 'ios'}`
	const isPlayStr = `isPlay=${global.isPlay}`
	const version = `version=${XFNVERSION}`
	const timestamp = `timestamp=${new Date().getTime()}`
	let network = 'network=notfetch'
	let ssid = `ssid=''`

	if (global.ssid) {
		ssid = `ssid=${global.ssid}`
	}

	let url, option
	url = URL.msgTextSend + '?' + [network, source, version, timestamp, isPlayStr, ssid].join('&')

	option = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include',
		body: JSON.stringify({message: `手机端标题：${opt.title}；` + ' ' + ` 信息：${opt.message}；` + ' ' + ` 备注：${opt.remark}；` + ' ' + ` source：${source}`})
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