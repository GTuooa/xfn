import * as dd from 'dingtalk-jsapi'
import handleError from 'app/thirdParty/common/handleError'

export function setIcon(opts) {
    dd.biz.navigation.setIcon(opts)
}
export function setRight(opts) {
    dd.biz.navigation.setRight(opts)
}

export function setTitle(opts) {
    dd.biz.navigation.setTitle(opts)
}

export function setMenu(opts) {
    dd.biz.navigation.setMenu(opts)
}
