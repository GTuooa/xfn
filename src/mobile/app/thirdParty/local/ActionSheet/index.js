import { ActionSheet } from 'antd-mobile'

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let wrapProps;
if (isIPhone) {
    wrapProps = {
        onTouchStart: e => e.preventDefault(),
    }
}

export default function actionSheet (opts) {

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
