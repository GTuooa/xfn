import { message } from 'antd'
//数字校验
export const reg = /^\d{0,14}(\.\d{0,2})?$/
export const regNegative = /^-{0,1}\d{0,14}(\.\d{0,2})?$/
export default function numberTest(e,dispatchFunc,NegativeAllowed) {
    if (e.target.value === undefined)
        return

    let value = e.target.value.indexOf('。') > -1 ? e.target.value.replace('。', '.') : e.target.value
    value = value.replace(/,/g,'')
    if(value.indexOf('0') === 0 && value != '0' && value >= 1 ){
        value = value.substr(1)
    }
    if (value === '.' || value === '-.') {
        message.info('请输入正确的数值')
    } else if (value.indexOf('-') === 0 && !NegativeAllowed ) {
        message.info('金额仅支持输入正数')
    } else if (NegativeAllowed?!regNegative.test(value):!reg.test(value)) {
        message.info('金额只能输入小于14位数两位小数的数字')

    } else {
        dispatchFunc(value) 

    }
}
