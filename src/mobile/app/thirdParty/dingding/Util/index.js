import * as dd from 'dingtalk-jsapi'
import handleError from 'app/thirdParty/common/handleError'

export function uploadImage(opts) {
    dd.biz.util.uploadImage(opts)
}

export function previewImage(opts) {
    dd.biz.util.previewImage(opts)
}

export function openLink(opts) {
    dd.biz.util.openLink(opts)
}

export function datepicker(opts) {
    dd.biz.util.datepicker(opts)
}

export function chosen(opts) {
    dd.biz.util.chosen(opts)
}

export function choose(opts) {
    dd.biz.contact.choose(opts)
}

export function pay(opts) {
    dd.biz.alipay.pay(opts)
}

export function getNetworkType(opts) {
    dd.device.connection.getNetworkType(opts)
}

export function complexPicker(opts) {
    dd.biz.contact.complexPicker(opts)
}

export function saveFile(opts) {
    dd.biz.cspace.saveFile(opts)
}

export function uploadAttachment(opts) {
    dd.biz.util.uploadAttachment(opts)
}

export function preview(opts) {
    dd.biz.cspace.preview(opts)
}

export function datetimepicker(opts) {
    dd.biz.util.datetimepicker(opts)
}
