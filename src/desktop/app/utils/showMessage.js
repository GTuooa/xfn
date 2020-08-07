import { message } from 'antd'
// import * as components from 'app/components'
import * as thirdParty from 'app/thirdParty'
import { ROOTURL } from 'app/constants/fetch.constant.js'
// import { notification } from 'antd';
// import { NotificationModal } from 'app/containers/components/NotificationModal'

// 全局消息提示
export default function showMessage (receivedData, successTip)  {
	if (receivedData) {
		if (receivedData.code === 0) {
			if (successTip === 'show') {
				message.success('操作成功！', 1)
			}
			return true
		}
		// else if (receivedData.code === 1) {
		// 	notification.open({
		// 		message: '系统发生了未知错误',
		// 		placement: 'bottomRight',
		// 		duration: null,
		// 		description: NotificationModal,
		// 		// style: {width: '520px', padding: 0},
		// 	});
		// }
		else if (receivedData.code === 10002) {
			thirdParty.Alert('登录信息失效，重新登录')
			location.reload() && sessionStorage.clear()
		} else if (receivedData.code === 10011) {

			thirdParty.Confirm({
				message: receivedData.message,
				title: "提示",
				buttonLabels: ['取消', '确定'],
				onSuccess : (result) => {
					if (result.buttonIndex === 1) {

						if (global.isPlay) {
							location.reload() && sessionStorage.clear()
						} else {
							const href = location.href
							const start = href.indexOf('?')
							let serverMessage = location.href.slice(start+1).split('&')
							const corpId = serverMessage[1].slice(7)

							if (receivedData.data === corpId) {
								location.reload() && sessionStorage.clear()
							} else {
								location.replace(`${ROOTURL}/index.html?isOV=false&corpid=${receivedData.data}&isInWeb=true`) && sessionStorage.clear()
							}
						}
					}
				}
			})
		} else if (receivedData.code <= 11000 ||
				receivedData.code === 12000 ||
				receivedData.code === 13000 ||
				receivedData.code === 14000 ||
				receivedData.code === 15000 ||
				receivedData.code === 16000 ||
				receivedData.code >= 17000) {
			message.info([(receivedData.code), '-', (receivedData.errmsg || receivedData.message)].join(''), 2)
			return false
		} else {
			thirdParty.Alert(receivedData.message)
			return false
		}
	} else {
		return
	}
}
