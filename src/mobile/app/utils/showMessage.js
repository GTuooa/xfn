import thirdParty from 'app/thirdParty'
import { browserNavigator } from 'app/utils'
import { ROOTURL } from 'app/constants/fetch.constant.js'

export default function showMessage (receivedData, showSuccess, time, alertStr,hideToast = false) {

	if (alertStr) {
		setTimeout(() => {
			thirdParty.Alert(alertStr, '确认')
		}, time ? time : 0)
		return
	} else if (receivedData) {
		if (receivedData.code === 0) {
			if (showSuccess === 'show') {
				setTimeout(() => {
					// thirdParty.toast({
					// 	icon: 'success',
					// 	text: '操作成功'
					// })
					thirdParty.toast.success('操作成功', 2)
				}, time ? time : 0)
			} else {
				if(!hideToast){
					thirdParty.toast.hide()
				}
			}
			return true
		} else if (receivedData.code === 10002) {
			thirdParty.Alert('登录信息失效，重新登录', '确认')
			// window.location.reload(true) && sessionStorage.clear()
			if (browserNavigator.versions.DingTalk) {
				window.location.replace(`${ROOTURL}/index.html?dd_nav_bgcolor=FFFFFFFF&isOV=false&corpid=${sessionStorage.getItem('corpId')}`) && sessionStorage.clear()
			} else if (global.isplayground) {
				window.location.replace(`${ROOTURL}/index.html?dd_nav_bgcolor=FFFFFFFF&isOV=false&isplayground=true`)
			} else {
				window.location.replace(`http://localhost:4800/build/mobile/index.html`) && sessionStorage.clear()
			}
		} else if (receivedData.code <= 11000 || [12000, 13000, 14000, 15000, 16000].includes(receivedData.code) || receivedData.code >= 17000) {
			// thirdParty.toast.info([receivedData.code,receivedData.message].join('-'), 3)
			if(!hideToast){
				thirdParty.toast.hide()
			}
			thirdParty.ddToast({
				icon: 'error',
				text: [receivedData.code,receivedData.message].join('-'),
				duration: 3,
				onSuccess : function(result) {}
			})
			return false
		} else {
			if(!hideToast){
				thirdParty.toast.hide()
			}
			thirdParty.Alert(receivedData.message, '确认')
			return false
		}
	}
}
