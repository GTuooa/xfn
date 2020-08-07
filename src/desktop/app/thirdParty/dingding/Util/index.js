import * as dd from 'dingtalk-jsapi'
import handleError from 'app/thirdParty/common/handleError'

export function uploadImage(opts) {
    dd.biz.util.uploadImage(opts)
}

export function openLink(opts) {
    dd.biz.util.openLink(opts)
}

export function choose(opts) {
	dd.biz.contact.choose({...opts, corpId: sessionStorage.getItem('corpId')})
}

export function getNetworkType(opts) {
    dd.device.connection.getNetworkType(opts)
}

export function openSlidePanel(url, title='title', onSuccess, onFail) {
	dd.biz.util.openSlidePanel({
		// url: 'https://desktop.xfannix.com/index.html#' + url,
		url: url,
		title,
		onSuccess,
		onFail
	})
}

export function close(opts) {
	dd.biz.navigation.quit({
		message: opts.message, //退出信息，传递给openModal或者openSlidePanel的onSuccess函数的result参数
		onSuccess: opts.onSuccess(),
		onFail: () => {}
	})
}

export function downloadFile(opts) {
    dd.biz.util.downloadFile(opts)
}

export function complexPicker(opts) {
    dd.biz.contact.complexPicker(opts)
}
