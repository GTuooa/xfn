import * as dd from 'dingtalk-jsapi'
import handleError from 'app/thirdParty/common/handleError'
import { Modal } from 'antd'

export function Alert (message, buttonName) {
    dd.device.notification.alert({
        message: message,
        title: "提示", //可传空
        buttonName: buttonName ? buttonName : '确定',
        onSuccess : function() {
            //onSuccess将在点击button之后回调
            /*回调*/
        },
        onFail : (err) => handleError(err, 'alert')
    })
}

export function Confirm(opts) {
    // dd.device.notification.confirm({
    //     ...opts,
    //     onFail : (err) => handleError(err, 'alert')
    // })

    Modal.confirm({
        title: opts.title ? opts.title : '提示',
        content: opts.message,
        okText: opts.buttonLabels[1],
        cancelText: opts.buttonLabels[0],
        onOk: () => opts.onSuccess({buttonIndex: 1}),
        onCancel: () => opts.onSuccess({buttonIndex: 0})
    })
}

export function Prompt(opts) {
    dd.device.notification.prompt({
        ...opts,
        onFail : function(err) {}
    })
}

export function actionSheet(opts) {
	dd.device.notification.actionSheet(opts)
}
