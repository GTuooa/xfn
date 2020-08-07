import thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'


export function hasChiness (str) {//是否包含中文
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
                } else {
                    let nameFormate = value.replace(/\s+/g,'');
                    const limitLength = v.limitLength ? v.limitLength : 0
                    if (nameFormate === '') {
                        errorList.push('名称不能为空')
                    } else if (limitLength && value.length > limitLength) {
                        errorList.push(`名称长度最长为${limitLength}位`)
                    } else if (hasChiness(value)) {
                        errorList.push(`名称包含中文及中文标点字符，长度不能超过${Limit.AC_CHINESE_NAME_LENGTH}位；不包含中文及中文标点字符，长度不能超过${Limit.AC_NAME_LENGTH}位`)
                    }
                }
            },
            'code': () => {
                const limitLength = v.limitLength ? v.limitLength : Limit.CODE_LENGTH

                if (value === '' || value === null) {
                    errorList.push('编码不能为空')
                }else {
                    let nameFormate = value.replace(/\s+/g,'');
                    if(nameFormate === ''){
                        errorList.push('编码不能为空')
                    }else if (value.length > limitLength) {
                        errorList.push(`编码位数不能超过${limitLength}位`)
                    }
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
                    const limitLength = v.limitLength ? v.limitLength : 10
                    let nameFormate = value.replace(/\s+/g,'');
                    if(nameFormate === ''){
                        errorList.push('名称不能为空')
                    }else if (value.length > limitLength) {
                        errorList.push(`名称长度最长为${limitLength}位`)
                    }
                }
            },
            'opened': () => {
                if (value.length > 12) {
                    errorList.push('期初值长度最长为12位')
                }
            },
            'tel': () => {
                if (value.length > 12) {
                    errorList.push('电话号码最大支持12位')
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
            return thirdParty.Alert(errorList.join(','))
        }

    }
}


function inputCheck (type, value, onSuccess, digits = 2) {
    ({
        'code': () => {

            // 最长20个数字或字母  编码用
            const reg = /^[0-9a-zA-Z]*$/g

            if (reg.test(value)) {
                onSuccess()
            } else {
                thirdParty.Alert('编码只能输入数字或字母')
            }

        },
        'taxpayerNumber':() =>{
            const reg = /^[0-9a-zA-Z]{0,40}$/g

            if (reg.test(value)) {
                onSuccess()
            } else {
                thirdParty.Alert('纳税人识别号只能输入40个数字或字母')
            }
        },
        'specificationsAndModels': () => {

            // 最长20个数字或字母  编码用
            const reg = /^[0-9a-zA-Z]{0,20}$/g

            if (reg.test(value)) {
                onSuccess()
            } else {
                thirdParty.Alert('规格型号只能输入20个数字或字母')
            }

        },
        'amount': () => {

            // 金额输入
            // const reg = /^[-\d]\d*\.?\d{0,${digits}}$/g
            const reg = new RegExp(`^[-\\d]\\d*\\.?\\d{0,${digits}}$`, 'g')

            if (reg.test(value) || value === '') {
                onSuccess()
            } else {
                thirdParty.Alert(`金额只能输入带${digits}位小数的数字`)
            }

        },
        'positiveAmount': () => {//正数

            // 金额输入
            const reg = new RegExp(`^\\d{0,14}\\.?\\d{0,${digits}}$`, 'g')

            if (reg.test(value) || value === '') {
                onSuccess()
            } else {
                thirdParty.Alert(`金额只能输入带${digits}位小数的正数`)
            }

        },
        'count': () => {

            // 金额输入
            // const reg = /^[-\d]\d*\.?\d{0,2}$/g
            const reg = new RegExp(`^[-\\d]\\d*\\.?\\d{0,${digits}}$`, 'g')

            if (reg.test(value) || value === '') {
                if (value < 1000000000000) {
                    onSuccess()
                } else {
                    thirdParty.Alert('数量最大支持千亿级')
                }
            } else {
                thirdParty.Alert(`数量只能输入带${digits}位小数的数字`)
            }

        },
        'barCode': () => {
            //条形码用
            const reg = /^[0-9a-zA-Z]{0,40}$/g
            if (reg.test(value)) {
                onSuccess()
            } else {
                thirdParty.Alert('条形码只能输入40个数字或字母')
            }
        },
        'unitName': () => {
            if (value.length > 20) {
                thirdParty.Alert('单位名称最长20个字符')
            } else {
                onSuccess()
            }
        },
        'batch': () => {
            const reg = /^[0-9a-zA-Z]{0,20}$/g
            if (reg.test(value)) {
                onSuccess()
            } else {
                thirdParty.Alert('批次号做多输入20个数字或字母')
            }
        },
        'tel': () => {
            const reg = /^([0-9]|[-])+$/g
            if (reg.test(value) || value === '') {
                onSuccess()
            }
        },
        'codeNum' : () =>{
            const reg = /^\d+$/g
            if (reg.test(value) || value === '') {
                onSuccess()
            } else {
                thirdParty.Alert('编码位数只支持数字')
            }
        },
        'shelfLife' : () =>{
            const reg = /^\d+$/g
            if (reg.test(value) || value === '') {
                onSuccess()
            } else {
                thirdParty.Alert('保质期只支持数字')
            }
        },
        'serial': () => {
            //序列号
            const reg = /^[^\u4e00-\u9fa5]{0,20}$/g
            if (reg.test(value)) {
                onSuccess()
            } else {
                thirdParty.Alert('序列号只能输入20个字符')
            }
        },
    }[type])()
}


let configCheck = {}
configCheck.hasChiness = hasChiness
configCheck.beforeSaveCheck = beforeSaveCheck
configCheck.inputCheck = inputCheck

export default configCheck