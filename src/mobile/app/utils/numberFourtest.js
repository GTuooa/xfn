import thirdParty from 'app/thirdParty'

const regFour = /^\d{0,14}(\.\d{0,4})?$/
const regNegativeFour = /^-{0,1}\d{0,14}(\.\d{0,4})?$/
export default function numberFourTest(value,dispatchFunc,NegativeAllowed){
    if (value === undefined)
        return

    value = value.indexOf('。') > -1 ? value.replace('。', '.') : value
    value = value.replace(/,/g,'')
    if(value.indexOf('0') === 0 && value != '0' && value >= 1 ){
        value = value.substr(1)
    }
    if (value.indexOf('-') === 0 && !NegativeAllowed ) {
        thirdParty.toast.info('金额仅支持输入正数')
    } else if (NegativeAllowed?!regNegativeFour.test(value):!regFour.test(value)) {
        thirdParty.toast.info('只能输入小于14位数四位小数的数字')
    } else {
        dispatchFunc(value)
    }
}
