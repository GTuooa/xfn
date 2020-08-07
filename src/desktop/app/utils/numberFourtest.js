import { message } from 'antd'

const regFour = /^\d{0,14}(\.\d{0,4})?$/
const regNegativeFour = /^-{0,1}\d{0,14}(\.\d{0,4})?$/
export default function numberFourTest(e,dispatchFunc,NegativeAllowed){
    if (e.target.value === undefined)
        return

    let value = e.target.value.indexOf('。') > -1 ? e.target.value.replace('。', '.') : e.target.value
    value = value.replace(/,/g,'')
    if(value.indexOf('0') === 0 && value != '0' && value >= 1 ){
        value = value.substr(1)
    }
    if (value === '.' || value === '-.') {
        message.info('请输入正确的数值')
    } else if(value.indexOf('-') === 0 && !NegativeAllowed){
        message.info('仅支持输入正数')
    } else if (NegativeAllowed?!regNegativeFour.test(value):!regFour.test(value)) {
        message.info('只能输入小于14位数四位小数的数字')

    } else {
        dispatchFunc(value)

    }
}
