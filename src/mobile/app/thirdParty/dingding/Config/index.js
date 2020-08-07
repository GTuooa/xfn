import * as dd from 'dingtalk-jsapi'

export function config(conf) {
    dd.config({
		...conf,
		jsApiList: [
			// 'runtime.permission.requestAuthCode',//此api 必须加入jsApiList 否则报错404: “API NOT EXIST”
			// 'ui.webViewBounce.disable',
			// 'device.notification.alert',
			// 'biz.navigation.setTitle',
			// 'ui.nav.preload',
			// 'ui.nav.go',

			// 'runtime.permission.requestOperateAuthCode',
			// 'biz.util.openSlidePanel',
			// 'biz.navigation.quit',
			// 'biz.contact.choose',

			// 'biz.util.chosen',
			// 'biz.util.datepicker',
			// 'biz.navigation.setTitle',
			// 'biz.navigation.close',

			// 'ui.webViewBounce.disable',
			// 'device.notification.modal',

			// 'device.notification.showPreloader',
			// 'device.notification.hidePreloader',
			// 'device.notification.confirm',
			// 'device.notification.toast',
			// 'device.notification.actionSheet',
			// 'biz.navigation.setIcon',
			// 'device.notification.prompt',
			// 'biz.navigation.setRight',
			// 'service.request.httpOverLwp',
			// 'biz.navigation.setMenu',
			'runtime.permission.requestOperateAuthCode',
			// 'biz.util.openLink',
			'biz.alipay.pay',
			// 'biz.util.uploadImage',
			// 'biz.util.previewImage',
			// 'device.connection.getNetworkType',
			'biz.telephone.showCallMenu',
            // 'device.notification.toast',
            'biz.contact.complexPicker',
            'biz.cspace.saveFile',
            'biz.util.uploadAttachment',
            'biz.cspace.preview',
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

export function webViewBounceDisable() {
	dd.ui.webViewBounce.disable()
}

export function showCallMenu(opts) {//调起打电话
	dd.biz.telephone.showCallMenu(opts)
}

// 安全通道
// export function httpOverLwp(opts) {
//     dd.service.request.httpOverLwp(config)
// }
