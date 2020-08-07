import * as dd from 'dingtalk-jsapi'

export const version = '1.1.0'

export function config(conf) {
    dd.config({
		...conf,
		jsApiList: [
			// 'runtime.permission.requestAuthCode',//此api 必须加入jsApiList 否则报错404: “API NOT EXIST”
			'runtime.permission.requestOperateAuthCode',  // 先不用
			'biz.util.openSlidePanel',
			// 'biz.navigation.quit',
			'biz.contact.choose',
			// 'biz.navigation.close',
			// 'device.notification.alert',
			// 'device.notification.confirm',
			// 'device.notification.actionSheet',
			// 'device.notification.prompt',
			// 'service.request.httpOverLwp',
			// 'biz.util.openLink',
			// 'biz.util.uploadImage',
			// 'device.connection.getNetworkType',
            'biz.util.downloadFile',
            'biz.contact.complexPicker',
		]
	})
}

export function requestAuthCode(opts) {
    dd.runtime.permission.requestAuthCode(opts)
}

export function requestOperateAuthCode(opts) {
    dd.runtime.permission.requestOperateAuthCode(opts)
}

export function error(opts) {
    dd.error(opts)
}

export function ready(opts) {
    dd.ready(opts)
}
