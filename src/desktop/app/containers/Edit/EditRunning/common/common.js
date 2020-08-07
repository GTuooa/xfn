import { message } from 'antd'
import React from 'react'
import { toJS, is ,fromJS } from 'immutable'
import * as Limit from 'app/constants/Limit.js'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
import * as utils from 'app/utils'
export const numberTest = utils.numberTest
export function getCategorynameByType (categoryType) {
    let  propertyShow, categoryTypeObj
    let direction = 'debit'
    let showInvoice = false
    let isShowAbout = false
    let specialState = false
    ;({
        'LB_YYSR': () => {
            propertyShow = '营业收入'
            categoryTypeObj = 'acBusinessIncome'
        },
        'LB_YYZC': () => {
            propertyShow = '营业支出'
            categoryTypeObj = 'acBusinessExpense'
            direction = 'credit'
        },
        'LB_YYWSR': () => {
            propertyShow = '营业外收入'
            categoryTypeObj = 'acBusinessOutIncome'
            isShowAbout = true
            direction = 'debit'
        },
        'LB_YYWZC': () => {
            propertyShow = '营业外支出'
            categoryTypeObj = 'acBusinessOutExpense'
            direction = 'credit'
            isShowAbout = true
            direction = 'credit'
        },
        'LB_JK': () => {
            propertyShow = '借款'
            categoryTypeObj = 'acLoan'
            specialState = true
        },
        'LB_TZ': () => {
            propertyShow = '投资'
            categoryTypeObj = 'acInvest'
            specialState = true
        },
        'LB_ZB': () => {
            propertyShow = '资本'
            categoryTypeObj = 'acCapital'
            specialState = true
        },
        'LB_CQZC': () => {
            propertyShow = '长期资产'
            categoryTypeObj = 'acAssets',
            direction = 'debit'
        },
        'LB_FYZC': () => {
            propertyShow = '费用支出'
            categoryTypeObj = 'acCost',
            direction = 'credit'
        },
        'LB_ZSKX': () => {
            propertyShow = '暂收款项'
            categoryTypeObj = 'acTemporaryReceipt'
            isShowAbout = true
        },
        'LB_ZFKX': () => {
            propertyShow = '暂付款项'
            categoryTypeObj = 'acTemporaryPay'
            isShowAbout = true
        },
        'LB_XCZC': () => {
            propertyShow = '薪酬支出'
            categoryTypeObj = 'acPayment',
            direction = 'credit'
            specialState = true
        },
        'LB_SFZC': () => {
            propertyShow = '税费支出'
            categoryTypeObj = 'acTax',
            direction = 'credit'
            specialState = true
        }
    }[categoryType] || (() => ''))()
    return {
        propertyShow,
        categoryTypeObj,
        direction,
        showInvoice,
        isShowAbout,
        specialState,
    }
}

//数字校验
// export const numberTest = (e,dispatchFunc,NegativeAllowed) => {
//     if (e.target.value === undefined)
//         return
//
//     let value = e.target.value.indexOf('。') > -1 ? e.target.value.replace('。', '.') : e.target.value
//     value = value.replace(/,/g,'')
//     if(value.indexOf('0') === 0 && value != '0' && value >= 1 ){
//         value = value.substr(1)
//     }
//     if (value === '.' || value === '-.') {
//         message.info('请输入正确的数值')
//     } else if (value.indexOf('-') === 0 && !NegativeAllowed ) {
//         message.info('金额仅支持输入正数')
//     } else if (NegativeAllowed?!regNegative.test(value):!reg.test(value)) {
//         message.info('金额只能输入小于14位数两位小数的数字')
//
//     } else {
//         dispatchFunc(value)
//
//     }
// }
export const reg = /^\d{0,14}(\.\d{0,2})?$/
export const regNegative = /^-{0,1}\d{0,14}(\.\d{0,2})?$/

export const JtHoc = (type) => (wrapCompnent) => {
    return class HocComp extends wrapCompnent {
        componentWillReceiveProps(nextprops) {
            const oriTemp = this.props.oriTemp
            const oriDate = oriTemp.get('oriDate')
            const currentCardUuid = oriTemp.getIn(['currentCardList',0,'cardUuid'])
            const newOriDate = nextprops.oriTemp.get('oriDate')
            const categoryUuid = nextprops.oriTemp.get('categoryUuid')
            const condition = nextprops.oriTemp.get('condition')
            const cardAllList = this.props.oriTemp.get('cardAllList')
            const newCardAllList = nextprops.oriTemp.get('cardAllList')
            const categoryType = nextprops.oriTemp.get('categoryType')
            const { categoryTypeObj } = getCategorynameByType(categoryType)
            const contactsManagement = nextprops.oriTemp.getIn([categoryTypeObj,'contactsManagement'])
            const newCurrentCardUuid = nextprops.oriTemp.getIn(['currentCardList',0,'cardUuid'])
            const insertOrModify = nextprops.insertOrModify
            if (type === 'Temporary') {
                if ( contactsManagement && insertOrModify === 'insert' && (oriDate !== newOriDate || cardAllList !== newCardAllList)) {
                    let cardUuidList = []
                    cardUuidList = newCardAllList.map(v => v.get('label') === '无往来单位'?'0':v.get('value').split(Limit.TREE_JOIN_STR)[0])
                    this.props.dispatch(editRunningActions.getPaymentManageList(newOriDate,cardUuidList,condition,categoryUuid))
                }
            } else if (insertOrModify === 'insert' && (oriDate !== newOriDate || currentCardUuid !== newCurrentCardUuid)) {
                this.props.dispatch(editRunningActions.getJrNotHandleList(categoryUuid,type,newOriDate,newCurrentCardUuid))
            }
        }
        render() {
            const element = super.render()
            return React.cloneElement(element,this.props,this.props.children)
        }
    }
}

export const CommonProjectTest = (oriTemp,projectList) => {
    return [lossProjectTest,constructProjectTest,produceProjectTest].reduce((pre,cur) => cur(oriTemp,pre),projectList)
}
export const lossProjectTest = (oriTemp,projectList) => {
    const categoryType = oriTemp.get('categoryType')
    const handleType = oriTemp.get('handleType')
    const oriState = oriTemp.get('oriState')
    const propertyCarryover = oriTemp.get('propertyCarryover')
    const propertyTax = oriTemp.get('propertyTax')
    let  newProjectList = fromJS(projectList).filter(v => {
        if (categoryType === 'LB_FYZC' && oriState !=='STATE_FY_DJ'
        || categoryType === 'LB_YYSR' && oriState !=='STATE_YYSR_DJ'
        || categoryType === 'LB_YYZC' && propertyCarryover === 'SX_FW' && oriState !== 'STATE_YYZC_DJ'
        || ['SX_QYSDS','SX_QTSF'].includes(propertyTax)
        || ['LB_XCZC','LB_YYWSR','LB_YYWZC'].includes(categoryType)
        || ['JR_HANDLE_CHLX','JR_HANDLE_QDSY'].includes(handleType)
        ) {// && (oriState === 'STATE_JK_JTLX' || !beAccrued && oriState === 'STATE_JK_ZFLX')
            return true
        } else if (v.get('code') === 'COMNCRD') {
            return false
        }
        return true
        })

        return newProjectList
}

export const produceProjectTest = (oriTemp,projectList) => {
    const categoryType = oriTemp.get('categoryType')
    const handleType = oriTemp.get('handleType')
    const oriState = oriTemp.get('oriState')
    const propertyCarryover = oriTemp.get('propertyCarryover')
    let newProjectList = fromJS(projectList).filter(v => {
        if (categoryType === 'LB_YYZC'
        || categoryType === 'LB_FYZC'
        || categoryType === 'LB_XCZC'
        || handleType === 'JR_HANDLE_CHLX'
        || categoryType === 'LB_ZSKX'
        || categoryType === 'LB_ZFKX'
        ) {
            return true
        } else if (v.get('projectProperty') === 'XZ_PRODUCE') {
            return false
        }
        return true
    })
    if (categoryType === 'LB_ZSKX'
    || categoryType === 'LB_ZFKX'
    || propertyCarryover === 'SX_HW' && categoryType === 'LB_YYZC'
    ) {
        newProjectList = newProjectList.filter(v => v.get('code')!=='MAKE' && v.get('code')!=='ASSIST')
    }
    return newProjectList
}
export const constructProjectTest = (oriTemp,projectList) => {
    const categoryType = oriTemp.get('categoryType')
    const handleType = oriTemp.get('handleType')
    const oriState = oriTemp.get('oriState')
    const propertyCarryover = oriTemp.get('propertyCarryover')
    let newConstructProjectList = fromJS(projectList).filter(v => v.get('projectProperty') !== 'XZ_CONSTRUCTION')
    switch(categoryType) {
        case 'LB_YYSR':
        case 'LB_ZSKX':
        case 'LB_ZFKX':
            newConstructProjectList = fromJS(projectList).filter(v => v.get('code') !== 'MECHANICAL' && v.get('code') !== 'INDIRECT')
            break
        case 'LB_YYZC':
            if (propertyCarryover === 'SX_FW') {
                newConstructProjectList = fromJS(projectList)
            } else {
                newConstructProjectList = fromJS(projectList).filter(v => v.get('code') !== 'MECHANICAL' && v.get('code') !== 'INDIRECT')
            }
            break
        case 'LB_JK':
            if (handleType === 'JR_HANDLE_CHLX') {
                newConstructProjectList = fromJS(projectList)
            }
        break
        case 'LB_FYZC':
        case 'LB_XCZC':

            newConstructProjectList = fromJS(projectList)
            break
        default:
    }
    return newConstructProjectList
}
export const ProductProjectTest = (categoryType,newProjectRange) => {
    switch(categoryType) {
        case 'LB_CQZC':
            if (newProjectRange.some(v => v.get('name') === '损益项目')) {
                return true
            } else {
                return false
            }
        default:
            return true
    }
}

const isInList = (code,cardList) => {
     return cardList.some(v => v.code === code)
}
const prejectChecked = (oriTemp,errorList,projectList) => {
    if (!oriTemp.getIn(['projectCardList',0,'cardUuid'])) {
        errorList.push('项目必填')
    } else if (oriTemp.get('isChangeCategory') && !isInList(oriTemp.getIn(['projectCardList',0,'code']),projectList.toJS())) {
        errorList.push('请选择项目范围内的卡片')
    }
}
// 业务流水 保存前要做的校验
export function beforeSaveCheck (oriTemp,scale,insertOrModify,oProjectList) {
    const categoryUuid =  oriTemp.get('categoryUuid')
    const categoryType =  oriTemp.get('categoryType')
    const oriAbstract=  oriTemp.get('oriAbstract')
    const oriState = oriTemp.get('oriState')
    const beProject = oriTemp.get('beProject')
    const usedProject = oriTemp.get('usedProject')
    const amount = oriTemp.get('amount')
    const currentAmount = oriTemp.get('currentAmount')
    const propertyCost = oriTemp.get('propertyCost')
    const billType = oriTemp.getIn(['billList',0,'billType'])
    const tax = oriTemp.getIn(['billList',0,'tax'])
    const beReduceTax = oriTemp.get('beReduceTax')
    const reduceAmount = oriTemp.get('reduceAmount')
    const beCleaning = oriTemp.get('beCleaning')
    const offsetAmount = oriTemp.get('offsetAmount')
    const pendingStrongList = oriTemp.get('pendingStrongList')
    const strongList = oriTemp.get('strongList')
    const propertyCostList = oriTemp.get('propertyCostList') || fromJS([])
    const propertyPay = oriTemp.get('propertyPay')
    const propertyTax = oriTemp.get('propertyTax')
    const handleType = oriTemp.get('handleType')
    const accounts = oriTemp.get('accounts')
    const jrIndex = oriTemp.get('jrIndex')
    const oriDate = oriTemp.get('oriDate')
    const usedAccounts = oriTemp.get('usedAccounts')
    const stockCardList = oriTemp.get('stockCardList').filter(v => !!v.get('cardUuid'))
    const propertyCarryover = oriTemp.get('propertyCarryover')
    const projectList = CommonProjectTest(oriTemp,oProjectList)
    const {
        categoryTypeObj
    } = getCategorynameByType(categoryType)
    const beManagemented = oriTemp.getIn([categoryTypeObj,'beManagemented'])
    const stockRange = oriTemp.getIn([categoryTypeObj,'stockRange'])
    const contactsManagement = oriTemp.getIn([categoryTypeObj,'contactsManagement'])
    const beWithholding = oriTemp.getIn([categoryTypeObj,'beWithholding'])
    const beWithholdTax = oriTemp.getIn([categoryTypeObj,'beWithholdTax'])
    const beWelfare = oriTemp.getIn([categoryTypeObj,'beWelfare'])
    const beDeposited = oriTemp.getIn([categoryTypeObj,'beDeposited'])
    const actualAmount = oriTemp.getIn(['payment','actualAmount'])
    const beWithholdSocial = oriTemp.getIn([categoryTypeObj,'beWithholdSocial'])
    const beSellOff = oriTemp.getIn([categoryTypeObj,'beSellOff'])
    const preAmount = oriTemp.get('preAmount')
    const payableAmount = oriTemp.get('payableAmount')
    const beAccrued = oriTemp.getIn([categoryTypeObj,'beAccrued'])
    const personSocialSecurityAmount = oriTemp.getIn(['payment','personSocialSecurityAmount'])
    const personAccumulationAmount = oriTemp.getIn(['payment','personAccumulationAmount'])
    const companyAccumulationAmount = oriTemp.getIn(['payment','companyAccumulationAmount'])
    const companySocialSecurityAmount = oriTemp.getIn(['payment','companySocialSecurityAmount'])
    const incomeTaxAmount = oriTemp.getIn(['payment','incomeTaxAmount'])
    const originalAssetsAmount = oriTemp.getIn(['assets','originalAssetsAmount'])
    const total = insertOrModify === 'insert' ?
    Number(pendingStrongList.reduce((to,cur)=> cur.get('beSelect')?to+=Number(cur.get('notHandleAmount')):to,0).toFixed(2))
    :Number(pendingStrongList.reduce((to,cur)=> cur.get('beSelect')?to+=Number(cur.get('notHandleAmount')) + Number(cur.get('handleAmount')):to,0).toFixed(2))
    let errorList = []
    if (!categoryUuid) {
        errorList.push('流水类别必填')
        return errorList
    } else if (!oriAbstract) {
        errorList.push('摘要必填')
        return errorList
    } else if (oriAbstract.length > 64) {
        errorList.push('摘要不得大于64字')
        return errorList
    } else if (oriTemp.getIn([categoryTypeObj,'contactsManagement']) && oriTemp.get('usedCurrent') && !oriTemp.getIn(['currentCardList',0,'cardUuid']) && oriState !== 'STATE_ZS_TH' && oriState !== 'STATE_ZF_SH' && oriState !== 'STATE_JK_ZFLX' && oriState !== 'STATE_TZ_SRGL' && oriState !== 'STATE_TZ_SRLX' && oriState !== 'STATE_ZB_ZFLR') {
        errorList.push('往来单位必填')
    } else if (!jrIndex && insertOrModify === 'modify') {
        errorList.push('流水号必填')
    } else if ((billType === 'bill_special' || billType === 'bill_common') && !tax) {
        errorList.push('税额必填')
    } else if (amount === '-'
    || preAmount === '-'
    || actualAmount === '-'
    || currentAmount === '-'
    || incomeTaxAmount === '-'
    || personSocialSecurityAmount === '-'
    || reduceAmount === '-'
    || incomeTaxAmount === '-'
    || offsetAmount === '-'
    || tax === '-'
    || companyAccumulationAmount === '-'
    || companySocialSecurityAmount === '-'
    ) {
        errorList.push('请输入有效的数值')
    } else if (usedAccounts && accounts.filter(v => v.get('accountUuid')).size < 2) {
        errorList.push('多账户至少填写2个账户')
    } else if (beManagemented && usedAccounts && accounts.some(v => !v.get('accountUuid'))) {
        errorList.push('请填写完整的账户和金额')
    } else if (beManagemented && ['STATE_YYSR_DJ','STATE_YYZC_DJ','STATE_FY_DJ'].includes(oriState) &&usedAccounts && Number(accounts.reduce((pre,cur) => pre += Number(cur.get('amount') || 0),0).toFixed(2)) != Number(amount)) {
        errorList.push('多账户金额必须与总金额相等')
    }
    if (insertOrModify === 'modify' && (pendingStrongList.size || strongList.size)) {
        let selectPendingStrongList = pendingStrongList.filter(v => v.get('beSelect'))
        if (oriDate < selectPendingStrongList.getIn([selectPendingStrongList.size -1 ,'oriDate'])) {
            errorList.push('日期不可早于前置流水')
        }
        if (oriDate > strongList.getIn([0,'oriDate'])) {
            errorList.push('日期不可晚于后置流水')

        }
    }
    switch(categoryType) {
        case 'LB_YYSR':
            if (beProject && usedProject) {
                prejectChecked(oriTemp,errorList,projectList)
            }
            if (scale !== 'isEnable' && (oriState === 'STATE_YYSR_XS' || oriState === 'STATE_YYSR_TS') && !billType) {
                errorList.push('票据类型必填')
            }
            if ((beManagemented
                 && (oriState === 'STATE_YYSR_XS' || oriState === 'STATE_YYSR_TS') && currentAmount > 0 || oriState === 'STATE_YYSR_DJ')
                 || !beManagemented && !strongList.size ) {
                !oriTemp.getIn(['accounts',0,'accountUuid']) && errorList.push('账户必填')
            }

            if (beDeposited && oriState === 'STATE_YYSR_XS' && preAmount > 0 && preAmount < offsetAmount) {
                errorList.push('预收抵扣金额不可大于预收款金额')
            }
            if (beSellOff && oriState === 'STATE_YYSR_TS'  && payableAmount > 0 && payableAmount < offsetAmount) {
                errorList.push('应收抵扣金额不可大于应收款金额')
            }
            if (propertyCarryover === 'SX_HW' || propertyCarryover === 'SX_HW_FW' && stockRange && stockRange.size > 0) {
                stockCardList.some(v => !v.get('cardUuid') && v.get('amount') > 0) && oriState !== 'STATE_YYSR_DJ' && errorList.push('请选择存货卡片')

            }
            if (stockCardList.some(v => !JSON.parse(v.get('isOpenedQuantity') || false) && !v.get('amount'))) {
                const item = stockCardList.find(v => !JSON.parse(v.get('isOpenedQuantity') || false) && !v.get('amount'))
                const code = item.get('code')
                const name = item.get('name')
                errorList.push(`${code} ${name}:请填入金额信息`)
            } else if (stockCardList.some(v => JSON.parse(v.get('isOpenedQuantity') || false) && !v.get('amount') && !v.get('quantity'))) {
                const item = stockCardList.find(v => JSON.parse(v.get('isOpenedQuantity') || false) && !v.get('amount') && !v.get('quantity'))
                const code = item.get('code')
                const name = item.get('name')
                errorList.push(`${code} ${name}:请填入数量和金额信息`)
            } else if (stockCardList.some(v => v.getIn(['financialInfo','openSerial']) && !v.get('quantity'))) {
                const item = stockCardList.find(v => v.getIn(['financialInfo','openSerial']) && !v.get('quantity'))
                const code = item.get('code')
                const name = item.get('name')
                errorList.push(`${code} ${name}:请填入数量`)
            }

            break
        case 'LB_YYZC':
            if (beProject && usedProject) {
                prejectChecked(oriTemp,errorList,projectList)
            }
            if (scale === 'general' && (oriState === 'STATE_YYZC_GJ' || oriState === 'STATE_YYZC_TG') && !billType) {
                errorList.push('票据类型必填')
            }
            if ((beManagemented
                 && (oriState === 'STATE_YYZC_GJ' || oriState === 'STATE_YYZC_TG') && currentAmount > 0 || oriState === 'STATE_YYZC_DJ')
                 || !beManagemented && !strongList.size ) {
                !oriTemp.getIn(['accounts',0,'accountUuid']) && errorList.push('账户必填')
            }
            if (beDeposited && oriState === 'STATE_YYZC_GJ' && preAmount > 0 && preAmount < offsetAmount) {
                errorList.push('预付抵扣金额不可大于预付款金额')
            }
            if (beSellOff && oriState === 'STATE_YYZC_TG'  && payableAmount > 0 && payableAmount < offsetAmount) {
                errorList.push('应付抵扣金额不可大于应付款金额')
            }
            if (propertyCarryover === 'SX_HW' || propertyCarryover === 'SX_HW_FW' && stockRange && stockRange.size > 0) {
                stockCardList.some(v => !v.get('cardUuid') && v.get('amount') > 0) && oriState !== 'STATE_YYZC_DJ' && errorList.push('请选择存货卡片')

            }
            if (stockCardList.some(v => !JSON.parse(v.get('isOpenedQuantity') || false) && !v.get('amount'))) {
                const item = stockCardList.find(v => !JSON.parse(v.get('isOpenedQuantity') || false) && !v.get('amount'))
                const code = item.get('code')
                const name = item.get('name')
                errorList.push(`${code} ${name}:请填入金额信息`)
            } else if (stockCardList.some(v => JSON.parse(v.get('isOpenedQuantity') || false) && !v.get('amount') && !v.get('quantity'))) {
                const item = stockCardList.find(v => JSON.parse(v.get('isOpenedQuantity') || false) && !v.get('amount') && !v.get('quantity'))
                const code = item.get('code')
                const name = item.get('name')
                errorList.push(`${code} ${name}:请填入数量和金额信息`)
            } else if (stockCardList.some(v => v.getIn(['financialInfo','openSerial']) && !v.get('quantity'))) {
                const item = stockCardList.find(v => v.getIn(['financialInfo','openSerial']) && !v.get('quantity'))
                const code = item.get('code')
                const name = item.get('name')
                errorList.push(`${code} ${name}:请填入数量`)
            }

            break
        case 'LB_FYZC':
            if (oriState === 'STATE_FY' && !propertyCost && propertyCostList.size >1) {
                errorList.push('费用性质必填')
            }
            if (beProject && usedProject) {
                prejectChecked(oriTemp,errorList,projectList)
            }
            if ((beManagemented
                 && oriState === 'STATE_FY' && currentAmount > 0 || oriState === 'STATE_FY_DJ')
                 || !beManagemented ) {
                !oriTemp.getIn(['accounts',0,'accountUuid']) && errorList.push('账户必填')
            }
            if (scale === 'general' && oriState === 'STATE_FY' && !billType) {
                errorList.push('票据类型必填')
            }
            break
        case 'LB_XCZC':
            if (!propertyCost
                && (oriState !== 'STATE_XC_JN' || oriState === 'STATE_XC_JN' && pendingStrongList.every(v => !v.get('beSelect')))
                && (oriState !== 'STATE_XC_FF' || oriState === 'STATE_XC_FF' && pendingStrongList.every(v => !v.get('beSelect')))
                && oriState !== 'STATE_XC_DK') {
                errorList.push('费用性质必填')
            }
            if (oriState !== 'STATE_XC_JT' && ((beWithholdTax || beWithholding || beWithholdSocial) && (oriState === 'STATE_XC_FF' || oriState === 'STATE_XC_JN') && actualAmount> 0)) {
                !oriTemp.getIn(['accounts',0,'accountUuid']) && errorList.push('账户必填')
            }
            if ((oriState === 'STATE_XC_JT' || (!beAccrued && !beWelfare)&& (oriState === 'STATE_XC_JN' || oriState === 'STATE_XC_FF')) && beProject && usedProject) {
                prejectChecked(oriTemp,errorList,projectList)
            }
            if (total < 0 && (personSocialSecurityAmount || personAccumulationAmount || incomeTaxAmount) && oriState === 'STATE_XC_FF') {
                 errorList.push('待处理金额为负数，不可输入代扣金额')
                 return errorList
            }
            if (pendingStrongList.some(v => v.get('beSelect'))) {
                switch(propertyPay) {
                    case 'SX_GZXJ':
                    case 'SX_QTXC':
                    case 'SX_FLF':
                    if(Math.abs(total) < amount) {
                        errorList.push('核销金额不能大于所有未处理金额')
                    }
                    break
                    case 'SX_SHBX':
                    if(Math.abs(total) < oriTemp.getIn(['payment','companySocialSecurityAmount'])) {
                        errorList.push('核销金额不能大于所有未处理金额')
                    }
                    break
                    case 'SX_ZFGJJ':
                    if(Math.abs(total) < oriTemp.getIn(['payment','companyAccumulationAmount'])) {
                        errorList.push('核销金额不能大于所有未处理金额')
                    }
                    break
                }
            }
            break
        case 'LB_SFZC':
            if (oriState !== 'STATE_SF_JT' && oriState !== 'STATE_SF_SFJM' && oriState !== 'STATE_SF_ZCWJZZS' && amount > 0) {
                !oriTemp.getIn(['accounts',0,'accountUuid']) && errorList.push('账户必填')
            }
            if (beReduceTax && !reduceAmount) {
                errorList.push('减免金额必填')
            }
            if ((oriState === 'STATE_SF_JT' || !beAccrued && oriState === 'STATE_SF_JN') && beProject && usedProject) {
                prejectChecked(oriTemp,errorList,projectList)
            }
            if (pendingStrongList.some(v => v.get('beSelect'))) {

                switch(propertyTax) {
                    case 'SX_ZZS':
                    if(total < (Number(amount) + Number(offsetAmount) + (beReduceTax?Number(reduceAmount):0)).toFixed(2)) {
                        errorList.push('核销金额不能大于所有未处理金额')
                    }
                    break
                    case 'SX_QYSDS':
                    case 'SX_QTSF':
                    if(total < (Number(amount) + (beReduceTax?Number(reduceAmount):0)).toFixed(2)) {
                        errorList.push('核销金额不能大于所有未处理金额')
                    }
                    break
                }

            }
            break
        case 'LB_CQZC':
            if ((scale !== 'isEnable' && oriState === 'STATE_CQZC_YS' || scale === 'general' && oriState === 'STATE_CQZC_YF') && !billType) {
                errorList.push('票据类型必填')
            }
            if (beCleaning) {
                if (!originalAssetsAmount) {
                    errorList.push('资产原值必填')
                }
            }
            break
        case 'LB_TZ':
            if (pendingStrongList.some(v => v.get('beSelect'))) {

                if(total < amount && handleType === 'JR_HANDLE_QDSY') {
                    errorList.push('核销金额不能大于所有未处理金额')
                }
            }
            if (oriState === 'STATE_ZS_SQ' && oriTemp.get('usedCurrent') && !oriTemp.getIn(['currentCardList',0,'cardUuid'])) {
                errorList.push('往来单位必填')
            }
            break
        case 'LB_YYWSR':
            if (beProject && usedProject) {
                prejectChecked(oriTemp,errorList,projectList)
            }
            if (beManagemented && currentAmount > 0 || !beManagemented) {
                !oriTemp.getIn(['accounts',0,'accountUuid']) && errorList.push('账户必填')
            }
            break
        case 'LB_YYWZC':
            if (beProject && usedProject) {
                prejectChecked(oriTemp,errorList,projectList)
            }
            if (beManagemented && currentAmount > 0 || !beManagemented) {
                !oriTemp.getIn(['accounts',0,'accountUuid']) && errorList.push('账户必填')
            }
            break
        case 'LB_ZSKX':
            if (oriState === 'STATE_ZS_SQ' && beProject && usedProject) {
                prejectChecked(oriTemp,errorList,projectList)
            }
            !oriTemp.getIn(['accounts',0,'accountUuid']) && errorList.push('账户必填')
            if (pendingStrongList.some(v => v.get('beSelect'))) {
                if(total < amount) {
                    errorList.push('核销金额不能大于所有未处理金额')
                }
            }
            break
        case 'LB_ZFKX':
            if (oriState === 'STATE_ZS_SQ' && beProject && usedProject) {
                prejectChecked(oriTemp,errorList,projectList)
            }
            !oriTemp.getIn(['accounts',0,'accountUuid']) && errorList.push('账户必填')
            if (pendingStrongList.some(v => v.get('beSelect'))) {

                if(total < amount) {
                    errorList.push('核销金额不能大于所有未处理金额')
                }
            }
            if (oriState === 'STATE_ZS_SQ' && oriTemp.get('usedCurrent') && !oriTemp.getIn(['currentCardList',0,'cardUuid'])) {
                errorList.push('往来单位必填')
            }
            break
        case 'LB_JK':
            if ((oriState === 'STATE_JK_JTLX' || !beAccrued && oriState === 'STATE_JK_ZFLX')&& beProject && usedProject) {
                prejectChecked(oriTemp,errorList,projectList)
            }
            if (oriState !== 'STATE_JK_JTLX') {
                !oriTemp.getIn(['accounts',0,'accountUuid']) && errorList.push('账户必填')
            }
            if (pendingStrongList.some(v => v.get('beSelect'))) {

                if(total < amount && handleType === 'JR_HANDLE_CHLX') {
                    errorList.push('核销金额不能大于所有未处理金额')
                }
            }
            break
        case 'LB_ZB':
            if (oriState !== 'STATE_ZB_LRFP') {
                !oriTemp.getIn(['accounts',0,'accountUuid']) && errorList.push('账户必填')
            }
            if (pendingStrongList.some(v => v.get('beSelect'))) {

                if(total < amount && handleType === 'JR_HANDLE_LRFP') {
                    errorList.push('核销金额不能大于所有未处理金额')
                }
            }
            break

    }
    return errorList
}


// export const consturctiontProjectTest = (oriTemp,projectList) => {
//     const categoryType = oriTemp.get('categoryType')
//     const handleType = oriTemp.get('handleType')
//     const oriState = oriTemp.get('oriState')
//     const propertyCarryover = oriTemp.get('propertyCarryover')
//     let newProjectList = projectList.filter(v => v.get('code') !== 'XZ_CONSTRUCTION')
//     switch(categoryType) {
//         case 'LB_YYZC':
//             if (propertyCarryover === 'SX_FW') {
//                 newProjectList = projectList
//             }
//             break
//         case 'LB_JK':
//             if (handleType === 'JR_HANDLE_CHLX') {
//                 newProjectList = projectList
//             }
//         break
//         case 'LB_FYZC':
//         case 'LB_XCZC':
//             newProjectList = projectList
//             break
//         default:
//             return true
//     }
// }

export const projectCodeTest = (code) => {
    return code !== 'COMNCRD'
    && code !== 'ASSIST'
    && code !== 'MAKE'
    && code !== 'INDIRECT'
    && code !== 'MECHANICAL' ? (code || '') : ''

}

export const propertyName = {
    'XZ_SALE':'销售费用',
    'XZ_MANAGE':'管理费用',
    'XZ_FINANCE':'财务费用',
    'XZ_SCCB':'生产成本',
    'XZ_FZSCCB':'辅助生产成本',
    'XZ_ZZFY':'制造费用',
    'XZ_HTCB':'合同成本',
    'XZ_JJFY':'间接费用',
    'XZ_JXZY':'机械作业'
}
export const  disablePropertyFunc = (propertyCost) =>
propertyCost === 'XZ_SCCB'
|| propertyCost === 'XZ_FZSCCB'
|| propertyCost === 'XZ_ZZFY'
|| propertyCost === 'XZ_HTCB'
|| propertyCost === 'XZ_JJFY'
|| propertyCost === 'XZ_JXZY'

export const projectTip = {
    XZ_SCCB:`已选择生产项目`,
    XZ_HTCB:`已选择施工项目`,
    XZ_FZSCCB:`已选择"辅助生产成本"项目`,
    XZ_JXZY:`已选择"机械作业"项目`,
    XZ_JJFY:`已选择"间接费用"项目`,
    XZ_ZZFY:`已选择"制造费用"项目`
}
const isSameAssit = (item,curItem) => (item.get('assistList') || []).every(v => curItem.assistList.some(w => w.classificationUuid === v.get('classificationUuid') && w.propertyUuid === v.get('propertyUuid')))
const isSameBatch = (item,curItem) => curItem.batchUuid && item.get('batchUuid') === curItem.batchUuid
const isSameWarehouse = (item,curItem) => curItem.warehouseCardUuid === item.get('warehouseCardUuid') && curItem.warehouseCardUuid
export const filterCarryover = (carryoverCardList,beCarryover,insertOrModify,enableWarehouse) => {
    let newCarryoverCardList = []
    beCarryover && insertOrModify === 'insert' && carryoverCardList.forEach((v,index) => {
    const openAssist = v.getIn(['financialInfo','openAssist']) && v.get('assistList') && v.get('assistList').size === v.getIn(['financialInfo','assistClassificationList']).size
    const openBatch = v.getIn(['financialInfo','openBatch'])
    if (!newCarryoverCardList.some(w =>
        w.cardUuid === v.get('cardUuid') && w.cardUuid
        && (enableWarehouse ? isSameWarehouse(v,w) : true)
        && (openAssist ? isSameAssit(v,w) : true)
        && (openBatch ? isSameBatch(v,w) : true)
        )) {
            newCarryoverCardList.push({...carryoverCardList.get(index).toJS(),index})
    }
        // if (enableWarehouse && !newCarryoverCardList.some(w =>
        //     w.warehouseCardUuid === v.get('warehouseCardUuid') && w.warehouseCardUuid
        //     && w.cardUuid === v.get('cardUuid') && w.cardUuid
        //
        //     )) {
        //     newCarryoverCardList.push({...carryoverCardList.get(index).toJS(),index})
        // } else if (!enableWarehouse && !newCarryoverCardList.some(w => w.cardUuid === v.get('cardUuid') && v.get('cardUuid'))) {
        //     newCarryoverCardList.push({...carryoverCardList.get(index).toJS(),index})
        // }
    })
    // console.log(newCarryoverCardList)
    return newCarryoverCardList
}
export const changeCategoryAllowed = (categoryType,canBeModifyCategory) => {
    return ['LB_YYSR','LB_YYZC','LB_YYWSR','LB_YYWZC','LB_ZSKX','LB_ZFKX','LB_FYZC'].includes(categoryType) && canBeModifyCategory
}
