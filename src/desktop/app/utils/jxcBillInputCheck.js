import { message } from 'antd'

function billInputCheck (type, value, onSuccess) {
    const reg = /^\d*\.?\d{0,2}$/g;

    ({
        'remark': () => {

            // 最长20个数字或字母  编码用
            // const reg = /^[0-9a-zA-Z]{0,40}$/g
            // if (reg.test(value)) {
            //     onSuccess()
            // } else {
            //     message.info('备注只能输入40个数字、字母、中文')
            // }
            if (value.length <= 40) {
                onSuccess()
            } else {
                message.info('备注长度最长为40位')
            }

        },
        'amount': () => {
            // const reg = /^[-\d]\d*\.?\d{0,2}$/g
            if (reg.test(value) || value === '') {
                if (value < 1000000000000) {
                    onSuccess()
                } else {
                    message.info('金额最大支持千亿级')
                }
            } else {
                message.info('金额只能输入带两位小数的数字且不能为负数')
            }

        },
        'count': () => {
            // const reg = /^[\d]\d*\.?\d{0,2}$/g

            if (reg.test(value) || value === '') {
                if (value < 1000000000000) {
                    onSuccess()
                } else {
                    message.info('数量最大支持千亿级')
                }
            } else {
                message.info('数量只能输入带两位小数的数字且不能为负数')
            }

        },
        'unitPrice': () => {
            // const reg = /^\d*\.?\d{0,2}$/g

            if (reg.test(value) || value === '') {
                if (value < 1000000000000) {
                    onSuccess()
                } else {
                    message.info('单价最大支持千亿级')
                }
            } else {
                message.info('单价只能输入带两位小数的数字且不能为负数')
            }

        }
    }[type])()
}


let jxcBillInputCheck = {};
jxcBillInputCheck.billInputCheck = billInputCheck;

export default jxcBillInputCheck;