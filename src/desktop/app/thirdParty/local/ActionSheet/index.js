// import { ActionSheet } from 'antd-mobile'
//
// const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
// let wrapProps;
// if (isIPhone) {
//     wrapProps = {
//         onTouchStart: e => e.preventDefault(),
//     }
// }
//
// export default function actionSheet (opts) {
//
//     const BUTTONS = opts.otherButtons
//
//     BUTTONS.push('取消')
//
//     ActionSheet.showActionSheetWithOptions({
//         options: BUTTONS,
//         cancelButtonIndex: BUTTONS.length - 1,
//         destructiveButtonIndex: BUTTONS.length - 2,
//         title: opts.title,
//         message: '',
//         maskClosable: true,
//         'data-seed': 'logId',
//         wrapProps,
//     },
//     (buttonIndex) => {
//         const result = {buttonIndex: buttonIndex}
//         console.log('actionSheet', result)
//         opts.onSuccess(result)
//     })
// }
