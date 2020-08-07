import * as dd from 'dingtalk-jsapi'
import handleError from 'app/thirdParty/common/handleError'
import { ActionSheet } from 'antd-mobile'
import browserNavigator from 'app/utils/browserNavigator'

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let wrapProps;
if (isIPhone) {
    wrapProps = {
        onTouchStart: e => e.preventDefault(),
    }
}

export function Alert (message, buttonName, title) {
    dd.device.notification.alert({
        message: message,
        title: title ? title : "提示", //可传空
        buttonName: buttonName ? buttonName : '确定',
        onSuccess : function() {
            //onSuccess将在点击button之后回调
            /*回调*/
        },
        onFail : (err) => handleError(err, 'alert')
    })
}

export function Confirm(opts) {
    dd.device.notification.confirm({
        ...opts,
        onFail : (err) => handleError(err, 'alert')
    })
}

export function Prompt(opts) {
    dd.device.notification.prompt({
        ...opts,
        onFail : function(err) {}
    })
}

// export function modal(opts) {
//     dd.device.notification.modal(opts)
// }

// export function showPreloader(opts) {
// 	dd.device.notification.showPreloader(opts)
// }
//
// export function hidePreloader(opts) {
// 	dd.device.notification.hidePreloader(opts)
// }

export function actionSheet (opts) {

    if (browserNavigator.versions.ios) {
        return dd.device.notification.actionSheet(opts)
    } else {
        let BUTTONS = opts.otherButtons
        const cancelButton = opts.cancelButton

        if (BUTTONS.indexOf(cancelButton) === -1) {
            BUTTONS.push(cancelButton)
        }

        ActionSheet.showActionSheetWithOptions({
            options: BUTTONS,
            cancelButtonIndex: BUTTONS.length - 1,
            destructiveButtonIndex: BUTTONS.length - 1,
            title: opts.title,
            message: '',
            maskClosable: true,
            // 'data-seed': 'logId',
            wrapProps,
        }, (buttonIndex) => {
            const result = {buttonIndex: buttonIndex}
            if (buttonIndex == BUTTONS.length - 1) {
                return
            }
            opts.onSuccess(result)
        })
    }
}

export function ddToast(opts) {
	dd.device.notification.toast(opts)
}
