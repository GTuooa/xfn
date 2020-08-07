import { config, requestAuthCode, requestOperateAuthCode, error, ready, webViewBounceDisable, showCallMenu } from './Config'
// import { Alert, Confirm, Prompt, actionSheet, ddToast } from './Notification'
import { Alert, Confirm, Prompt, ddToast, actionSheet } from './Notification'
import { setIcon, setRight, setTitle, setMenu } from './Navigation'
import {
    uploadImage,
    previewImage,
    openLink,
    datepicker,
    datetimepicker,
    chosen,
    choose,
    pay,
    getNetworkType,
    complexPicker,
    saveFile,
    uploadAttachment,
    preview,
    share,
     } from './Util'
import toast from 'app/thirdParty/common/Toast'

export {
    config,
    requestAuthCode,
    requestOperateAuthCode,
    error,
    ready,
    webViewBounceDisable,
    showCallMenu,
    Alert,
    Confirm,
    Prompt,
    actionSheet,
    setIcon,
    setRight,
    setTitle,
    setMenu,
    uploadImage,
    previewImage,
    openLink,
    datepicker,
    datetimepicker,
    chosen,
    choose,
    pay,
    getNetworkType,
    toast,
    ddToast,
    complexPicker,
    saveFile,
    uploadAttachment,
    preview,
}
