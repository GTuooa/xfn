import { message } from 'antd'
import * as Limit from 'app/constants/Limit.js'

const cEng = function(value) {
    for (var i=0; i<value.length; i++) {
        if (value.charCodeAt(i) >= 19968 && value.charCodeAt(i) <= 40869) {
            return false
         }
     }
    return true
}

export function nameCheck (str) {//校验名称 中文32个 纯英文64个
    let hasCh = false
    if(/.*[\u4e00-\u9fa5]+.*$/.test(str)) {
        hasCh = true
    }
    if (hasCh && str.length > Limit.AC_CHINESE_NAME_LENGTH) {
        return true
    }
    if (!hasCh && str.length > Limit.AC_NAME_LENGTH) {
        return true
    }
    return false
}

export function beforeSaveCheck (list, onSuccess, returnError) {

    const errorList = []

    list.map(v => {
        const type = v.type
        const value = v.value

        ;({
            'name': () => {

                if (value === '' || value === null) {
                    errorList.push('名称不能为空')
                }else {
                    let nameFormate = value.replace(/\s+/g,'');
                    if(nameFormate === ''){
                        errorList.push('名称不能为空')
                    }else if (value.length > 30) {
                        errorList.push('名称长度最长为30位')
                    }
                }
            },
            'stockName': () => {

                if (value === '' || value === null) {
                    errorList.push('名称不能为空')
                } else if (cEng(value) && value.length > 64 || !cEng(value) && value.length > 32) {
                    errorList.push(`名称包含中文及中文标点字符，长度不能超过${Limit.AC_CHINESE_NAME_LENGTH}位；不包含中文及中文标点字符，长度不能超过${Limit.AC_NAME_LENGTH}位`)
                }
            },
            'code': () => {

                if (value === '' || value === null) {
                    errorList.push('编码不能为空')
                } else if (value.length > Limit.CODE_LENGTH) {
                    errorList.push(`编码位数不能超过${Limit.CODE_LENGTH}位`)
                }

            },
            'barCode': () => {

                if (value && value.length > 40) {
                    errorList.push('条形码长度最长为40位')
                }

            },
            'unit': () => {

                if (value === '' || value === null) {
                    errorList.push('计量单位不能为空')
                }

            },
            'remark': () => {

                if (value && value.length > 40) {
                    errorList.push('备注长度最长为40位')
                }

            },
            'unitName': () => {
                if (value === '' || value === null) {
                    errorList.push('基本单位不能为空')
                }else{
                    let unitFormate = value.replace(/\s+/g,'');
                    if(unitFormate === ''){
                        errorList.push('基本单位不能为空')
                    }
                }
            },

            'unitChangeRate': () => {
                if (value === '' || value === null) {
                    errorList.push('新基本单位与原基本单位的数量关系不能为空')
                }else{
                    let unitFormate = value.replace(/\s+/g,'');
                    if(unitFormate === ''){
                        errorList.push('新基本单位与原基本单位的数量关系不能为空')
                    }
                }
            },
            'categoty': () => {

                if (value === '' || value === null) {
                    errorList.push('名称不能为空')
                } else{
                    let nameFormate = value.replace(/\s+/g,'');
                    if(nameFormate === ''){
                        errorList.push('名称不能为空')
                    }else if(value.length > 10) {
                        errorList.push('名称长度最长为10位')
                    }
                }
            },
            'property':() =>{
                if (value === '' || value === null) {
                    errorList.push('名称不能为空')
                } else{
                    let nameFormate = value.replace(/\s+/g,'');
                    if(nameFormate === ''){
                        errorList.push('名称不能为空')
                    }else if(value.length > 10) {
                        errorList.push('名称长度最长为10位')
                    }
                }
            },
            'companyAddress':() =>{
                if(value && value.length>40){
                    errorList.push('单位地址最长40个字符')
                }
            },
            'financeName':() =>{
                if( value && value.length>20){
                    errorList.push('财务联系人最长20个字符')
                }
            },
            'invoiceTitle':() =>{
                if(value && value.length>40){
                    errorList.push('发票抬头最长40个字符')
                }
            },
            'basicAccount':() =>{
                if(value && value.length>40){
                    errorList.push('基本户账号最长40个字符')
                }
            },
            'openingBank':() =>{
                if(value && value.length>40){
                    errorList.push('开户行账号最长40个字符')
                }
            },
            'customerName':() =>{
                if(value && value.length>20){
                    errorList.push('客户联系人最长20个字符')
                }
            },
            'topestName': () => {
                if (value === '' || value === null) {
                    errorList.push('名称不能为空')
                }else {
                    let nameFormate = value.replace(/\s+/g,'');
                    if(nameFormate === ''){
                        errorList.push('名称不能为空')
                    }else if (value.length > 10) {
                        errorList.push('名称长度最长为10位')
                    }
                }
            },
        }[type])()
    })

    if (returnError) {

        return errorList

    } else {

        if (errorList.length === 0) {
            onSuccess()
        } else {
            return message.info(errorList.join(','), 3)
        }

    }
}


function inputCheck (type, value,onSuccess) {
    ({
        'code': () => {

            // 最长20个数字或字母  编码用
            const reg = /^[0-9a-zA-Z]{0,20}$/g

            if (reg.test(value)) {
                onSuccess()
            } else {
                message.info('编码只能输入20个数字或字母')
            }

        },
        'cardCode': () => {
            // 最长20个数字或字母  编码用
            const reg = /^[0-9a-zA-Z]*$/g

            if (reg.test(value)) {
                onSuccess()
            } else {
                message.info('编码只能输入数字或字母')
            }
        },
        'stockCode': () => {
            // 最长20个数字或字母  编码用
            const reg = /^[0-9a-zA-Z]{0,16}$/g

            if (reg.test(value)) {
                onSuccess()
            } else {
                message.info('编码只能输入16个数字或字母')
            }
        },
        'taxpayerNumber':() =>{
            const reg = /^[0-9a-zA-Z]{0,40}$/g

            if (reg.test(value)) {
                onSuccess()
            } else {
                message.info('纳税人识别号只能输入40个数字或字母')
            }
        },
        'specificationsAndModels': () => {

            // 最长20个数字或字母  编码用
            const reg = /^[0-9a-zA-Z]{0,20}$/g

            if (reg.test(value)) {
                onSuccess()
            } else {
                message.info('规格型号只能输入20个数字或字母')
            }

        },
        'amount': () => {

            // 金额输入
            const reg = /^[-\d]\d*\.?\d{0,2}$/g

            if (value === '.' || value === '-.') {
                message.info('请输入正确的数值')
            } else if (reg.test(value) || value === '') {
                if (value < 1000000000000) {
                    onSuccess()
                } else {
                    message.info('金额最大支持千亿级')
                }
            } else {
                message.info('金额只能输入带两位小数的数字')
            }

        },
        'count': () => {

            // 金额输入
            const reg = /^[-\d]\d*\.?\d{0,2}$/g

            if (value === '.' || value === '-.') {
                message.info('请输入正确的数值')
            } else if (reg.test(value) || value === '') {
                if (value < 1000000000000) {
                    onSuccess()
                } else {
                    message.info('数量最大支持千亿级')
                }
            } else {
                message.info('数量只能输入带两位小数的数字')
            }

        },
        'count4': () => {

            // 金额输入
            const reg = /^[-\d]\d*\.?\d{0,4}$/g

            if (value === '.' || value === '-.') {
                message.info('请输入正确的数值')
            } else if (reg.test(value) || value === '') {
                if (value < 1000000000000) {
                    onSuccess()
                } else {
                    message.info('数量最大支持千亿级')
                }
            } else {
                message.info('数量只能输入带四位小数的数字')
            }

        },
        'barCode': () => {
            //条形码用
            const reg = /^[0-9a-zA-Z]{0,40}$/g
            if (reg.test(value)) {
                onSuccess()
            } else {
                message.info('条形码只能输入40个数字或字母')
            }
        },
        'unitName': () => {
            if (value.length > 20) {
                message.info('单位名称最长20个字符')
            } else {
                onSuccess()
            }
        },
        'specifications': () => {
            const reg = /^[0-9a-zA-Z]{0,20}$/g
            if (reg.test(value)) {
                onSuccess()
            } else {
                message.info('规格型号只能输入20个数字或字母')
            }
        },
        'tel': () => {

            const reg = /^([0-9]|[-])+$/g

            if (reg.test(value) || value === '') {
                if (value.length < 13) {
                    onSuccess()
                } else {
                    message.info('电话号码最大支持12位')
                }
            } else {
                message.info('电话号码支持的是数字及”-')
            }
        },
        'codeNum' : () =>{
            const reg = /^\d+$/g
            if (reg.test(value) || value === '') {
                onSuccess()
            } else {
                message.info('编码位数只支持数字')
            }
        },
        'regAmount':() => {
            const regNegative = /^-{0,1}\d{0,14}(\.\d{0,2})?$/
            if (value === '.' || value === '-.') {
                message.info('请输入正确的数值')
            } else if (regNegative.test(value) || value === '') {
                onSuccess()
            } else {
                message.info('只能输入14位数2位小数的数字')
            }
        },
        'roundNumber' : () => {
            const reg = /^\d+$/g
            if (reg.test(value) || value === '') {
                onSuccess()
            } else {
                message.info('请输入整数')
            }
        }
    }[type])()
}


let jxcConfigCheck = {};
jxcConfigCheck.nameCheck = nameCheck;
jxcConfigCheck.beforeSaveCheck = beforeSaveCheck;
jxcConfigCheck.inputCheck = inputCheck;

export default jxcConfigCheck;