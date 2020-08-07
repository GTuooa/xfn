import * as Limit from 'app/constants/Limit.js'
import * as editRunning from 'app/constants/editRunning.js'
import { decimal } from 'app/utils'
import chzzSort from './chzzSort.js'

export function check (oriTemp, data, scale, isInsert, isCopy, isOpenedWarehouse) {
    let errorList = []
    const categoryType = oriTemp.get('categoryType')
    const oriState = oriTemp.get('oriState')
    const beManagemented = oriTemp.getIn([editRunning.categoryTypeObj[categoryType], 'beManagemented'])//收付管理
    const beAccrued = oriTemp.getIn([editRunning.categoryTypeObj[categoryType], 'beAccrued'])//计提

    //公有的校验
    if (data['oriAbstract'] == '') {
        errorList.push('请填写摘要')
    }
    if (data['oriAbstract'].length > Limit.RUNNING_ABSTRACT_LENGTH) {
        errorList.push(`摘要长度不能超过${Limit.RUNNING_ABSTRACT_LENGTH}个字符`)
    }

    //项目的校验
    const usedProject = categoryType == 'LB_GGFYFT' ? true : data['usedProject']
    const projectCardList = data['projectCardList']
    let hasEmptyAmount = false, hasEmptyPropertyCost = false
    if (usedProject) {
        let uuidArr = []
        const hasEmpty = projectCardList.every(v => {
            uuidArr.push(v['cardUuid'])
            if (v['amount'] <= 0) {
                hasEmptyAmount = true
            }
            if (v['code']=='COMNCRD' && !v['propertyCost']) {
                hasEmptyPropertyCost = true
            }
            return v['cardUuid']
        })
        if (!hasEmpty) {
            errorList.push('有未选择的项目卡片')
        }
        // let newArr = [...new Set(uuidArr)]
        // if (newArr.length < uuidArr.length) {
        //     errorList.push('有重复的项目卡片')
        // }
    }

    //往来单位的校验
    const usedCurrent = data['usedCurrent']
    if (usedCurrent && !oriTemp.getIn(['currentCardList', 0, 'cardUuid'])) {
        errorList.push('请选择往来单位')
    }

    //存货卡片的校验
    function checkStock () {
        data['stockCardList'].forEach((v,i) => {
            let quantityIsZero = false, amountIsZero = false
            if (!v['cardUuid']) { return }
            if (v['amount'] <= 0) { amountIsZero = true }
            if (!v['isOpenedQuantity'] && amountIsZero) { errorList.push(`存货明细${i+1}未填写金额`) }
            if (v['isOpenedQuantity']) {
                if (v['quantity'] <= 0) {
                    quantityIsZero = true
                } else {
                    if (!v['unitUuid']) { errorList.push(`存货明细${i+1}未选择单位`) }
                }
                if (quantityIsZero && amountIsZero) { errorList.push(`存货明细${i+1}数量和金额不能同时为空`) }
            }
            if (isOpenedWarehouse && v['warehouseCardUuid'] == '') { errorList.push(`存货明细${i+1}未选择仓库`) }

            v['financialInfo'] = v['financialInfo'] ? v['financialInfo'] : {}
            const openAssist = v['financialInfo']['openAssist']//辅助属性
            const openBatch = v['financialInfo']['openBatch']//批次管理
            const openShelfLife = v['financialInfo']['openShelfLife']//保质期管理
            const openSerial = v['financialInfo']['openSerial']//序列号
            const assistList = v['assistList' ]? v['assistList'] : []//选中的属性列表
            if (openAssist) {
                const assistLength = v['financialInfo']['assistClassificationList'].length//设置的属性列表
                if (assistLength!=assistList.length) { errorList.push(`存货明细${i+1}属性未选择完整`) }
            }
            if (openBatch) {
                if (!v['batch']) { errorList.push(`存货明细${i+1}批次未选择`) }
                if (openShelfLife && (!v['expirationDate'])) { errorList.push(`存货明细${i+1}批次未选择截止日期`) }
            }
            if (openSerial && quantityIsZero) { errorList.push(`存货明细${i+1}未选择序列号`) }
        })

    }

    //是否需要校验账户
    let checkAccount = false, hasEmptyAccountAmount = false, totalAccountAmount = 0
    const usedAccounts = oriTemp.get('usedAccounts')//是否开启多账户
    const accounts = oriTemp.get('accounts').toJS()
    if (usedAccounts) {
        let uuidArr = []
        const hasEmpty = accounts.every(v => {
            uuidArr.push(v['accountUuid'])
            if (v['amount'] <= 0) {
                hasEmptyAccountAmount = true
            }
            totalAccountAmount += Number(v['amount'])
            return v['accountUuid']
        })
        if (!hasEmpty) {
            errorList.push('有未选择的账户')
        }
        if (hasEmptyAccountAmount) {
            errorList.push('账户有未填写的金额')
        }
        let newArr = [...new Set(uuidArr)]
        if (newArr.length < uuidArr.length) {
            errorList.push('有重复的账户')
        }
        if (newArr.length > 32) {
            errorList.push('多账户不可超过32个账户')
        }
    }

    //账户手续费的校验
    let needUsedPoundage = false, poundageCurrentCardList = [], poundageProjectCardList = []
    if (isInsert) {
        const hasNeedPoundage = oriTemp.get('accounts').some(v => v.getIn(['poundage', 'needPoundage']))
        if (hasNeedPoundage && oriTemp.get('needUsedPoundage')) {
            needUsedPoundage = true
            poundageCurrentCardList = oriTemp.get('poundageCurrentCardList').toJS()
            poundageProjectCardList = oriTemp.get('poundageProjectCardList').toJS()
        }
    }
    data['needUsedPoundage'] = needUsedPoundage
    data['poundageCurrentCardList'] = poundageCurrentCardList
    data['poundageProjectCardList'] = poundageProjectCardList

    switch (categoryType) {
        case 'LB_YYSR': {
            const propertyCarryover = oriTemp.get('propertyCarryover')
            checkAccount = beManagemented ? false : true
            const offsetAmount = Number(data['offsetAmount'])
            const preAmount = Math.abs(Number(data['preAmount']))
            const payableAmount = Math.abs(Number(data['payableAmount']))
            if (beManagemented) {
                if (oriState == 'STATE_YYSR_DJ' || data['currentAmount'] > 0) {
                    checkAccount = true
                }
            }

            // if (usedAccounts && !(propertyCarryover=='SX_HW' || oriTemp.get('usedStock'))) {
            //     data['amount'] = decimal(totalAccountAmount)
            // }

            if (Math.abs(Number(data['amount'])) == 0) {
                errorList.push('请填写金额')
            }

            if (isInsert && oriState=='STATE_YYSR_XS' && (offsetAmount > preAmount)) {
                errorList.push('预收抵扣金额不可大于预收款')
            }

            if (isInsert && oriState=='STATE_YYSR_TS' && (offsetAmount > payableAmount)) {
                errorList.push('预付抵扣金额不可大于应收款')
            }

            if (isInsert && (offsetAmount) > data['amount']) {
                errorList.push('预收(付)抵扣不可大于总金额')
            }

            if (isInsert && (Number(data['currentAmount']) + Number(data['offsetAmount']) > data['amount'])) {
                errorList.push('本次收(付)款金额+预收(付)抵扣不可大于总金额')
            }

            if (oriState != 'STATE_YYSR_DJ' && (propertyCarryover=='SX_HW' || oriTemp.get('usedStock'))) {
                checkStock()
            }
            if (data['stockCardList']) {
                data['stockCardList'].forEach((v, i) => {
                    if (!v['cardUuid']) {
                        data['stockCardList'].splice(i,1)
                    }
                })
            }
            if (isInsert && data['carryoverCardList']) {
                let cardSetList = []
                data['carryoverCardList'].forEach((v, i) => {
                    const cardUuid = v['cardUuid']
                    const warehouseCardUuid = v['warehouseCardUuid'] ? v['warehouseCardUuid'] : ''
                    const batch = v['batch'] ? v['batch'] : ''
                    const propertyList = v['assistList'] ? v['assistList'].map(v => v['propertyUuid']).sort() : []
                    const allPropertyStr = `${cardUuid}_${warehouseCardUuid}_${batch}_${propertyList.join('_')}`
                    if (cardSetList.includes(allPropertyStr)) {//重复的删掉
                        data['carryoverCardList'].splice(i,1)
                    } else {
                        cardSetList.push(allPropertyStr)
                    }
                })
            }
            if (!isInsert) {
                data['carryoverCardList'] = []
            }
            if (usedAccounts) {
                checkAccount = false
                if (oriState == 'STATE_YYSR_DJ' && decimal(totalAccountAmount) != decimal(data['amount'])) {
                    errorList.push('多账户金额必须与总金额相等')
                }
                if (oriState == 'STATE_YYSR_XS' && decimal(totalAccountAmount) > decimal(data['amount'])) {
                    errorList.push('多账户金额不可大于总金额')
                }
            } else {
                data['accounts'] = data['accounts'].slice(0,1)
            }
            if (propertyCarryover == 'SX_HW_FW' && !oriTemp.get('usedStock')) {
                data['stockCardList']=[]
                data['carryoverCardList']=[]
            }
			break
		}
        case 'LB_YYZC': {
            const propertyCarryover = oriTemp.get('propertyCarryover') === 'SX_HW' ? true : false
            checkAccount = beManagemented ? false : true
            const offsetAmount = Number(data['offsetAmount'])
            const preAmount = Math.abs(Number(data['preAmount']))
            const payableAmount = Math.abs(Number(data['payableAmount']))

            if (beManagemented) {
                if (oriState == 'STATE_YYZC_DJ' || data['currentAmount'] > 0) {
                    checkAccount = true
                }
            }

            // if (usedAccounts && !(propertyCarryover=='SX_HW' || oriTemp.get('usedStock'))) {
            //     data['amount'] = decimal(totalAccountAmount)
            // }
            // if (usedAccounts && oriState == 'STATE_YYZC_DJ') {
            //     data['amount'] = decimal(totalAccountAmount)
            // }
            if (Math.abs(Number(data['amount'])) == 0) {
                errorList.push('请填写金额')
            }

            if (isInsert && oriState=='STATE_YYZC_GJ' && (offsetAmount > preAmount)) {
                errorList.push('预付抵扣金额不可大于预付款')
            }

            if (isInsert && oriState=='STATE_YYZC_TG' && (offsetAmount > payableAmount)) {
                errorList.push('应付抵扣金额不可大于应付款')
            }

            if (isInsert && (offsetAmount > data['amount'])) {
                errorList.push('预收(付)抵扣不可大于总金额')
            }

            if (isInsert && (Number(data['currentAmount']) + Number(data['offsetAmount']) > data['amount'])) {
                errorList.push('本次收(付)款金额+预收(付)抵扣不可大于总金额')
            }

            if (oriState != 'STATE_YYZC_DJ' && propertyCarryover) {
                checkStock()
                data['usedStock'] = true
            }
            if (data['stockCardList']) {
                data['stockCardList'].forEach((v, i) => {
                    if (!v['cardUuid']) {
                        data['stockCardList'].splice(i,1)
                    }
                })
            }
            if (isInsert && data['beCarryover']) {
                if (!oriTemp.get('relationCategoryUuid')) {
                    errorList.push('请选择处理类别')
                }
                let cardList = [], warehouseList = [],  dupCard = []
                data['carryoverCardList'].forEach((v, i) => {
                    const cardUuid = v['cardUuid']
                    if (cardList.includes(cardUuid) && !dupCard.includes(cardUuid)) {
                        dupCard.push(cardUuid)
                    }
                    if (!cardList.includes(cardUuid)) {
                        cardList.push(cardUuid)
                        warehouseList.push([])
                    }
                    //不开启仓库存在重复的卡片
                    if (!isOpenedWarehouse && dupCard.includes(cardUuid)) {
                        data['carryoverCardList'].splice(i,1)
                    }
                    if (isOpenedWarehouse) {
                        const index = cardList.findIndex(value => value==cardUuid)
                        if (warehouseList[index].includes(v['warehouseCardUuid'])){//同一卡片同一仓库
                            data['carryoverCardList'].splice(i,1)
                        } else {
                            warehouseList[index].push(v['warehouseCardUuid'])
                        }
                    }
                })
            }
            if (usedAccounts) {
                checkAccount = false
                if (oriState == 'STATE_YYZC_DJ' && decimal(totalAccountAmount) != decimal(data['amount'])) {
                    errorList.push('多账户金额必须与总金额相等')
                }
                if (oriState == 'STATE_YYZC_GJ' && decimal(totalAccountAmount) > decimal(data['amount'])) {
                    errorList.push('多账户金额不可大于总金额')
                }
            } else {
                data['accounts'] = data['accounts'].slice(0,1)
            }
			break
		}
        case 'LB_FYZC': {
            if (Math.abs(Number(data['amount'])) == 0) {
                errorList.push('请填写金额')
            }
            if (oriState != 'STATE_FY_DJ' && data['propertyCost']=='') {
                errorList.push('请选择费用性质')
            }
            checkAccount = beManagemented ? false : true
            if (beManagemented) {
                if (oriState == 'STATE_FY_DJ' || data['currentAmount'] != 0) {
                    checkAccount = true
                }
            }
            if (usedAccounts) {
                checkAccount = false
                if (oriState == 'STATE_FY_DJ' && decimal(totalAccountAmount) != decimal(data['amount'])) {
                    errorList.push('多账户金额必须与总金额相等')
                }
                if (oriState == 'STATE_FY' && decimal(totalAccountAmount) > decimal(data['amount'])) {
                    errorList.push('多账户金额不可大于总金额')
                }
            } else {
                data['accounts'] = data['accounts'].slice(0,1)
            }
            const offsetAmount = Number(data['offsetAmount'])
            const preAmount = Math.abs(Number(data['preAmount']))
            const payableAmount = Math.abs(Number(data['payableAmount']))
            if (isInsert && oriState=='STATE_FY' && (offsetAmount > preAmount)) {
                errorList.push('预付抵扣金额不可大于预付款')
            }

            if (isInsert && oriState=='STATE_FY' && (offsetAmount > payableAmount)) {
                errorList.push('应付抵扣金额不可大于应付款')
            }

            if (isInsert && (offsetAmount > Math.abs(data['amount']))) {
                errorList.push('预(应)付抵扣不可大于总金额')
            }

            if (isInsert && (Number(data['currentAmount']) + Number(data['offsetAmount']) >  Math.abs(data['amount']))) {
                errorList.push('本次收(付)款金额+预(应)付抵扣不可大于总金额')
            }
			break
		}
        case 'LB_XCZC': {
            let hasSelect = false

            if (['STATE_XC_FF', 'STATE_XC_JN', 'STATE_XC_DK', 'STATE_XC_DJ'].includes(oriState)) {
                let pendingStrongList = []
                data['pendingStrongList'].map(v => {
                    if (v['beSelect']) {
                        hasSelect = true
                        pendingStrongList.push(v)
                    }
                })
                data['pendingStrongList'] = pendingStrongList
            }
            if (!(hasSelect && (['STATE_XC_FF', 'STATE_XC_JN'].includes(oriState))) && data['propertyCost'] == '') {
                errorList.push('请选择费用性质')
            }
            switch (oriTemp.get('propertyPay')) {
                case 'SX_GZXJ': {
                    // if (oriState!='STATE_XC_DK' && Math.abs(Number(data['amount'])) == 0) {
                    //     errorList.push('请填写金额')
                    // }
                    if (oriState == 'STATE_XC_FF') {
                        checkAccount = true
                        const actualAmount = oriTemp.getIn(['payment', 'actualAmount'])// 支付金额
                        if (beAccrued && actualAmount==0) {
                            checkAccount = false
                        }
                    }
                    break
                }
                case 'SX_SHBX':
                case 'SX_ZFGJJ':{
                    if ((oriState == 'STATE_XC_JT') && Math.abs(Number(data['amount'])) == 0) {
                        errorList.push('请填写金额')
                    }
                    if (oriState == 'STATE_XC_JN') {
                        checkAccount = true
                        // const beAccrued = oriTemp.getIn(['payment', 'beAccrued'])//计提
                        if (oriTemp.get('propertyPay')=='SX_SHBX' && isInsert && beAccrued) {
                            data['amount'] = oriTemp.getIn(['payment', 'companySocialSecurityAmount'])
                            const beWithholdSocial = oriTemp.getIn(['acPayment', 'beWithholdSocial'])// 是否代扣代缴社保
                            if (!beWithholdSocial) {
                                data['payment'] = undefined
                            }
                        }
                        if (oriTemp.get('propertyPay')=='SX_ZFGJJ' && isInsert && beAccrued) {
                            data['amount'] = oriTemp.getIn(['payment', 'companyAccumulationAmount'])
                            const beWithholding = oriTemp.getIn(['acPayment', 'beWithholding'])// 是否代扣代缴住房公积金
                            if (!beWithholding) {
                                data['payment'] = undefined
                            }
                        }
                        // if (isCopy) {
                        //     if (oriTemp.get('propertyPay')=='SX_SHBX') {
                        //         data['payment']['companySocialSecurityAmount']=data['amount']
                        //         data['payment']['personSocialSecurityAmount']=0
                        //     }
                        //     if (oriTemp.get('propertyPay')=='SX_ZFGJJ') {
                        //         data['payment']['companyAccumulationAmount']=data['amount']
                        //         data['payment']['personAccumulationAmount']=0
                        //     }
                        //
                        // }
                    }
                    break
                }
                case 'SX_FLF':
                case 'SX_QTXC': {
                    checkAccount = oriState == 'STATE_XC_FF' ? true : false
                    if (Math.abs(Number(data['amount'])) == 0) {
                        errorList.push('请填写金额')
                    }
                    break
                }
                default: {
                    console.log('校验薪酬支出出错');
                }
            }

			break
		}
        case 'LB_SFZC': {
            const propertyTax = oriTemp.get('propertyTax')
            if (oriState == 'STATE_SF_JN' || oriState == 'STATE_SF_SFJM') {
                let pendingStrongList = []
                data['pendingStrongList'].map(v => {
                    if (v['beSelect']) {
                        pendingStrongList.push(v)
                    }
                })
                data['pendingStrongList'] = pendingStrongList
            }
            switch (propertyTax) {
                case 'SX_ZZS': {
                    if (oriState=='STATE_SF_YJZZS') {
                        checkAccount = true
                        if (Math.abs(Number(data['amount'])) == 0) {
                            errorList.push('请填写金额')
                        }
                    }
                    if (oriState=='STATE_SF_ZCWJZZS') {
                        if (Math.abs(Number(data['amount'])) == 0) {
                            errorList.push('请填写金额')
                        }
                    }
                    if (oriState == 'STATE_SF_JN') {
                        const amount = oriTemp.get('amount')//支付金额
                        const offsetAmount = Number(oriTemp.get("offsetAmount"))// 预交抵扣金额
                        const deductedAmount = Number(oriTemp.get("deductedAmount"))// 待抵扣金额
                        const reduceAmount = Number(oriTemp.get('reduceAmount'))//减免金额
                        const jrAmount = Number(oriTemp.get('jrAmount'))//所勾选的计提流水的总额
                        const totalPay = Number(offsetAmount) + Number(amount) + Number(reduceAmount)//税费总额

                        if (data['pendingStrongList'].length == 0) {
                            errorList.push('请选择需要处理的流水')
                        }
                        if (Math.abs(Number(data['amount'])) > 0) {
                            checkAccount = true
                        }
                        if (totalPay == 0) {
                            errorList.push('请填写金额')
                        }
                        if (offsetAmount > deductedAmount) {
                            errorList.push('预交抵扣金额不能大于待抵扣金额')
                        }
                        if (totalPay > jrAmount) {
                            errorList.push('处理税费总额不可大于待核销金额')
                        }
                    }
                    if (oriState=='STATE_SF_SFJM') {
                        if (data['pendingStrongList'].length == 0) {
                            errorList.push('请选择需要处理的流水')
                        }
                        if (Math.abs(Number(data['amount'])) == 0) {
                            errorList.push('请填写金额')
                        }
                    }

                    break
                }
                case 'SX_QTSF':
                case 'SX_QYSDS': {
                    if (oriState == 'STATE_SF_JT' && Math.abs(Number(data['amount'])) == 0) {
                        errorList.push('请填写金额')
                    }
                    if (oriState == 'STATE_SF_JN') {
                        const reduceAmount = Number(oriTemp.get('reduceAmount'))//减免金额
                        const amount = Number(oriTemp.get('amount'))
                        const jrAmount = Number(oriTemp.get('jrAmount'))
                        const totalAmount = amount + reduceAmount

                        if (reduceAmount > 0 && beAccrued && data['pendingStrongList'].length == 0) {
                            errorList.push('请选择需要处理的流水')
                        }
                        if (data['pendingStrongList'].length && beAccrued && totalAmount > jrAmount) {
                            errorList.push('核销金额不可大于待支付金额')
                        }
                        if (totalAmount == 0) {
                            errorList.push('请填写金额')
                        }
                        if (amount > 0) {
                            checkAccount = true
                        }
                    }
                    if (oriState=='STATE_SF_SFJM') {
                        if (data['pendingStrongList'].length == 0) {
                            errorList.push('请选择需要处理的流水')
                        }
                        if (Math.abs(Number(data['amount'])) == 0) {
                            errorList.push('请填写金额')
                        }
                    }
                    break
                }
                case 'SX_GRSF': {
                    checkAccount = true
                    if (Math.abs(Number(data['amount'])) == 0) {
                        errorList.push('请填写金额')
                    }
                    break
                }
                default: {
                    console.log('校验税费支出出错');
                }
            }
			break
		}
        case 'LB_CQZC': {
            if (Math.abs(Number(data['amount'])) == 0) {
                errorList.push('请填写金额')
            }
            const currentAmount = oriTemp.get('currentAmount')
            if (Number(currentAmount) > 0 || (!beManagemented)) {
                checkAccount = true
            }
            if (!isInsert) {//修改时
                const isFullPayment = oriTemp.get('isFullPayment')
                checkAccount = (isFullPayment || (!beManagemented)) ? true : false
            }
            if (data['beCleaning']) {
                const originalAssetsAmount = data['assets']['originalAssetsAmount']
                const depreciationAmount = data['assets']['depreciationAmount']

                if (originalAssetsAmount <= 0) {
                    errorList.push('请填写资产原值')
                }
                // if (depreciationAmount <= 0) {
                //     errorList.push('请填写累计折旧')
                // }
                if (Number(depreciationAmount) > Number(originalAssetsAmount)) {
                    errorList.push('折旧额不能大于原值')
                }
                data['projectCardList'][0]['amount'] = data['assets']['cleaningAmount']
            }
            break
        }
        case 'LB_YYWSR':
        case 'LB_YYWZC': {
            if (Math.abs(Number(data['amount'])) == 0) {
                errorList.push('请填写金额')
            }
            const currentAmount = oriTemp.get('currentAmount')
            if (Number(currentAmount) > 0 || (!beManagemented && Number(data['amount']) > 0)){
                checkAccount = true
            }
            break
        }
        case 'LB_ZSKX': {
            checkAccount = true
            if (Math.abs(Number(data['amount'])) == 0) {
                errorList.push('请填写金额')
            }
            if (oriState == 'STATE_ZS_TH') {
                let pendingStrongList = []
                data['pendingStrongList'].map(v => {
                    if (v['beSelect']) {
                        pendingStrongList.push({
                            beSelect: true,
                            jrJvUuid: v['jrJvUuid'],
                            balanceUuid: v['balanceUuid'],
                        })
                    }
                })
                data['pendingStrongList'] = pendingStrongList
                if (pendingStrongList.length == 0) {
                    errorList.push('请选择需要处理的流水')
                }
                if (data['amount'] > oriTemp.get('jrAmount')) {
                    errorList.push('金额不能大于所有未处理金额')
                }
            }

			break
		}
        case 'LB_ZFKX': {
            checkAccount = true
            if (Math.abs(Number(data['amount'])) == 0) {
                errorList.push('请填写金额')
            }
            if (oriState == 'STATE_ZF_SH') {
                let pendingStrongList = []
                data['pendingStrongList'].map(v => {
                    if (v['beSelect']) {
                        pendingStrongList.push(v)
                    }
                })
                data['pendingStrongList'] = pendingStrongList
                if (pendingStrongList.length == 0) {
                    errorList.push('请选择需要处理的流水')
                }
                if (data['amount'] > oriTemp.get('jrAmount')) {
                    errorList.push('金额不能大于所有未处理金额')
                }
            }

			break
		}
        case 'LB_JK': {
            if (data['amount'] <= 0) {
                errorList.push('请填写金额')
            }
            if (oriState != 'STATE_JK_JTLX') {
                checkAccount = true
            }
            if (beAccrued && oriState == 'STATE_JK_ZFLX') {
                let pendingStrongList = []
                if (!usedProject && !usedCurrent) {
                    data['pendingStrongList'].map(v => {
                        if (v['beSelect']) {
                            pendingStrongList.push(v)
                        }
                    })
                }
                // if (pendingStrongList.length == 0) {
                //     errorList.push('请选择需要处理的流水')
                // }
                if (pendingStrongList.length && data['amount'] > oriTemp.get('jrAmount')) {
                    errorList.push('金额不能大于所有未处理金额')
                }
                data['pendingStrongList'] = pendingStrongList
            }

			break
		}
        case 'LB_TZ': {
            if (data['amount'] <= 0) {
                errorList.push('请填写金额')
            }
            if (oriState != 'STATE_TZ_JTGL' && oriState != 'STATE_TZ_JTLX') {
                checkAccount = true
            }
            if (beAccrued && (oriState == 'STATE_TZ_SRGL' || oriState == 'STATE_TZ_SRLX')) {
                let pendingStrongList = []
                if (!usedProject && !usedCurrent) {
                    data['pendingStrongList'].map(v => {
                        if (v['beSelect']) {
                            pendingStrongList.push(v)
                        }
                    })
                }
                if (pendingStrongList.length && data['amount'] > oriTemp.get('jrAmount')) {
                    errorList.push('金额不能大于所有未处理金额')
                }
                data['pendingStrongList'] = pendingStrongList
            }

			break
		}
        case 'LB_ZB': {
            if (data['amount'] <= 0) {
                errorList.push('请填写金额')
            }
            if (oriState != 'STATE_ZB_LRFP') {
                checkAccount = true
            }
            if (beAccrued && oriState == 'STATE_ZB_ZFLR') {
                let pendingStrongList = []
                if (!usedProject && !usedCurrent) {
                    data['pendingStrongList'].map(v => {
                        if (v['beSelect']) {
                            pendingStrongList.push(v)
                        }
                    })
                }
                if (pendingStrongList.length && data['amount'] > oriTemp.get('jrAmount')) {
                    errorList.push('金额不能大于所有未处理金额')
                }
                data['pendingStrongList'] = pendingStrongList
            }

			break
		}
        case 'LB_ZZ': {
            const fromAccount = oriTemp.getIn(['accounts', 0, 'accountUuid'])
            const toAccount = oriTemp.getIn(['accounts', 1, 'accountUuid'])

            if (data['amount'] <= 0) {
                errorList.push('请填写金额')
            }
            if (!fromAccount) {
                errorList.push('请选择转出账户')
            }
            if (!toAccount) {
                errorList.push('请选择转入账户')
            }
            if (fromAccount == toAccount) {
                errorList.push('转出账户和转入账户不能相同')
            }
            if (isInsert && needUsedPoundage && oriTemp.get('includesPoundage')) {
                const poundageAmount = oriTemp.getIn(['accounts', 0, 'poundageAmount'])
                data['amount'] = decimal(Number(data['amount'])-Number(poundageAmount))
            }

			break
		}
        case 'LB_SFGL': {
            const amount = oriTemp.get('amount')
            const moedAmount = oriTemp.get("moedAmount") ? Number(oriTemp.get("moedAmount")) : 0
            const jrAmount = Number(oriTemp.get("jrAmount"))
            const isManualWriteOff = oriTemp.getIn(['pendingManageDto', 'isManualWriteOff'])//false 自动核销
            let pendingStrongList = [], selectCategory = false//有期初未选择类别
            let allHandleAmount = 0, allMoedAmount = 0
            oriTemp.get('pendingStrongList').toJS().map(v => {
                if (v['beSelect']) {
                    let item = {uuid: v['uuid'], handleAmount: v['handleAmount'], moedAmount: v['moedAmount']}
                    if (v['beOpened']) {
                        item['beOpened'] = true
                        item['categoryUuid'] = v['categoryUuid']
                        if (v['beCard'] && !v['categoryUuid']) {
                            selectCategory = true//未选择类别
                        }
                    }
                    pendingStrongList.push(item)

                    const handleAmount = Number(v['handleAmount']) ? Number(v['handleAmount']) : 0
                    const moedAmount = Number(v['moedAmount']) ? Number(v['moedAmount']) : 0
                    if (v['direction']=='debit') {//借方发生金额
                        allHandleAmount += Number(handleAmount)
                        allMoedAmount += Number(moedAmount)
                    } else {//贷方发生金额
                        allHandleAmount -= Number(handleAmount)
                        allMoedAmount -= Number(moedAmount)
                    }

                }
            })

            if (selectCategory) {
                errorList.push('请选择需要核算的流水的类别')
            }
            if (pendingStrongList.length == 0) {
                errorList.push('请选择需要处理的流水')
            }
            // if (Number(amount)+Number(moedAmount) > Math.abs(jrAmount)) {
            //     errorList.push('收付金额大于您所有业务的所有未处理金额')
            // }
            if (amount > 0 && oriState == 'STATE_SFGL' && !usedAccounts) {
                checkAccount = true
            }

            //金额的校验
            if (isManualWriteOff && isInsert) {
                let hxAmount = decimal(Math.abs(amount)+Math.abs(moedAmount))//收付管理页面显示的金额
                let routerAmount = decimal(Math.abs(allHandleAmount)+Math.abs(allMoedAmount))//手动核销页面显示的金额
                if (usedAccounts && decimal(totalAccountAmount)!=hxAmount) {
                    errorList.push('账户金额与收付款金额不相等')
                }
                if (hxAmount!=routerAmount) {
                    errorList.push('核销金额与手动核销页面金额不一致')
                }
            }
            if (isManualWriteOff && !isInsert) {//修改时的校验

                let hxAmount = decimal(Math.abs(amount))//收付管理页面显示的金额
                allHandleAmount = decimal(Math.abs(allHandleAmount))//手动核销页面显示的金额
                allMoedAmount = decimal(Math.abs(allMoedAmount))//手动核销页面显示的金额

                if (oriState=='STATE_SFGL' && hxAmount!=allHandleAmount) {
                    errorList.push('收付款金额与手动核销页面核销收付款金额不一致')
                }
                if (oriState=='STATE_SFGL_ML' && hxAmount!=allMoedAmount) {
                    errorList.push('收付抹零金额与手动核销页面核销抹零金额不一致')
                }
            }

            if (usedAccounts) {
                checkAccount = false
            } else {
                if (oriState=='STATE_SFGL') {
                    data['accounts'] = data['accounts'].slice(0,1)
                }
            }

            data['pendingManageDto']['pendingManageList'] = pendingStrongList
            data['pendingManageDto']['isManualWriteOff'] = isManualWriteOff
            data['amount'] = Math.abs(amount)
            data['moedAmount'] = Math.abs(moedAmount)

            break
        }
        case 'LB_JZCB': {
            const categoryUuid = oriTemp.get('relationCategoryUuid')
            const isJz = oriState=='STATE_YYSR_ZJ' ? true : false
            if (isJz && !categoryUuid) {
                errorList.push('请选择处理类别')
            }

            let uuidArr = [], jrJvUuidList = []
            const stockCardList = oriTemp.get('stockCardList').toJS()
            const hasEmpty = stockCardList.every((v,i) => {
                uuidArr.push(v['cardUuid'])
                v['amount'] = Number(v['amount'])
                
                if (isJz && v['isOpenedQuantity']) {
                    // if (v['quantity'] != 0 && v['price'] == 0) {
                    //     errorList.push(`存货明细${i+1}未填写单价`)
                    // }
                    if (v['amount'] == 0 && v['quantity'] == 0) {
                        errorList.push(`存货明细${i+1}数量和金额不能同时为0`)
                    }
                    if (v['amount'] != 0 && v['quantity'] != 0 && v['amount']*v['quantity'] < 0) {
                        errorList.push(`存货明细${i+1}数量和金额应该同正负`)
                    }
                    if (v['quantity'] != 0 && !v['unitUuid']) {
                        errorList.push(`存货明细${i+1}未选择单位`)
                    }
                    v['financialInfo'] = v['financialInfo'] ? v['financialInfo'] : {}
                    const openAssist = v['financialInfo']['openAssist']//辅助属性
                    const openBatch = v['financialInfo']['openBatch']//批次管理
                    const openShelfLife = v['financialInfo']['openShelfLife']//保质期管理
                    const openSerial = v['financialInfo']['openSerial']//序列号
                    const assistList = v['assistList' ]? v['assistList'] : []//选中的属性列表
                    if (openAssist) {
                        const assistLength = v['financialInfo']['assistClassificationList'].length//设置的属性列表
                        if (assistLength!=assistList.length) { errorList.push(`存货明细${i+1}属性未选择完整`) }
                    }
                    if (openBatch) {
                        if (!v['batch']) { errorList.push(`存货明细${i+1}批次未选择`) }
                        if (openShelfLife && (!v['expirationDate'])) { errorList.push(`存货明细${i+1}批次未选择截止日期`) }
                    }
                    if (openSerial && v['quantity']<=0) { errorList.push(`存货明细${i+1}未选择序列号`) }               
                }
                if (isOpenedWarehouse && v['warehouseCardUuid'] == '') {
                    errorList.push(`存货明细${i+1}未选择仓库`)
                }
                return v['cardUuid']
            })

            if (!hasEmpty) {
                errorList.push('有未选择的存货卡片')
            }
            if (isJz && stockCardList.length > 160) {
                errorList.push('存货行次不可超过160行')
            }
            if (!isJz && stockCardList.length > 80) {
                errorList.push('存货行次不可超过80行')
            }

            oriTemp.get('pendingStrongList').forEach(v => {
                if (v.get('beSelect')) {
                    jrJvUuidList.push(v.get('jrJvUuid'))
                }
            })
            if (oriState!='STATE_YYSR_ZJ' && jrJvUuidList.length == 0) {
                errorList.push('请选择需要处理的流水')
            }

            if (oriState=='STATE_YYSR_ZJ' && usedProject) {
                data['projectCard'] = data['projectCardList'][0]
            }
            if (isJz) {
                data['categoryUuid'] = categoryUuid
            }
            data['jrJvUuidList'] = jrJvUuidList
            data['stockCardList'] = stockCardList

            break
        }
        case 'LB_FPRZ': {
            let pendingStrongList = []
            data['pendingStrongList'].map(v => {
                if (v['beSelect']) {
                    pendingStrongList.push(v)
                }
            })
            if (pendingStrongList.length == 0) {
                errorList.push('请选择需要处理的流水')
            }
            if (data['amount']<=0) {
                errorList.push('请填写金额')
            }
            if (data['amount'] > oriTemp.get('jrAmount')) {
                errorList.push('金额不能大于待认证税额')
            }
            if (oriState == 'STATE_FPRZ_TG') {
                data['amount'] = -Math.abs(data['amount'])
            }
            data['pendingStrongList'] = pendingStrongList
			break
		}
        case 'LB_KJFP': {
            let pendingStrongList = []
            data['pendingStrongList'].map(v => {
                if (v['beSelect']) {
                    pendingStrongList.push(v)
                }
            })
            if (pendingStrongList.length == 0) {
                errorList.push('请选择需要处理的流水')
            }
            if (data['amount']<=0) {
                errorList.push('请填写金额')
            }
            if (data['amount'] > oriTemp.get('jrAmount')) {
                errorList.push('金额不能大于待开票税额')
            }
            if (oriState == 'STATE_KJFP_TS') {
                data['amount'] = -Math.abs(data['amount'])
            }
            data['pendingStrongList'] = pendingStrongList
			break
		}
        case 'LB_ZCWJZZS': {
            let outputAmount = 0, inputAmount = 0
            oriTemp.get('pendingStrongList').forEach(v => {
                if (v.get('pendingStrongType') === 'JR_STRONG_STAY_ZCXX') {//销项税
                    outputAmount += v.get('taxAmount')
                } else {
                    inputAmount += v.get('taxAmount')
                }
            })

            if (oriTemp.get('pendingStrongList').size == 0) {
                errorList.push('没有需要转出的流水')
            }
            if (inputAmount > outputAmount) {
                errorList.push('进项税额大于销项税额，无需转出未交增值税')
            }

            break
        }
        case 'LB_JZSY': {
            let pendingStrongList = []
            const assets = oriTemp.get('assets')
            const originalAssetsAmount = assets.get('originalAssetsAmount')// 资产原值
            const depreciationAmount = assets.get('depreciationAmount')// 折旧累计
            data['pendingStrongList'].map(v => {
                if (v['beSelect']) {
                    pendingStrongList.push(v)
                }
            })

            if (oriTemp.get('relationCategoryUuid') == '') {
                errorList.push('请选择处理类别')
            }
            if (pendingStrongList.length == 0) {
                errorList.push('请选择需要处理的流水')
            }
            if ( originalAssetsAmount <= 0) {
                errorList.push('请填写资产原值')
            }
            if (Number(depreciationAmount) > Number(originalAssetsAmount)) {
                errorList.push('累计折旧余额不能大于资产原值')
            }

            data['pendingStrongList'] = pendingStrongList
            data['categoryUuid'] = oriTemp.get('relationCategoryUuid')

			break
		}
        case 'LB_ZJTX': {
            if (oriTemp.get('relationCategoryUuid') == '') {
                errorList.push('请选择处理类别')
            }
            if (oriTemp.get('propertyCost') == '') {
                errorList.push('请选择费用性质')
            }
            if (Math.abs(Number(data['amount'])) == 0) {
                errorList.push('请填写金额')
            }
            data['categoryUuid'] = oriTemp.get('relationCategoryUuid')

			break
		}
        case 'LB_GGFYFT': {
            // if (hasEmptyAmount) {//项目金额的校验
            //     errorList.push('项目卡片有未填写的金额')
            // }
            if (hasEmptyPropertyCost) {
                errorList.push('损益公共费用项目卡片未选择费用性质')
            }
            let totalAmount = 0
            projectCardList.map((v)=> {
                totalAmount += Number(v['amount'])
            })
            if (totalAmount != oriTemp.get('jrAmount')) {
                errorList.push('分摊金额合计不等于待分摊金额')
            }

            let jrJvUuidList = [], balanceUuidList = []
            data['pendingStrongList'].map(v => {
                if (v['beSelect']) {
                    if (v['beOpened']) {
                        balanceUuidList.push(v['balanceUuid'])
                    } else {
                        jrJvUuidList.push(v['jrJvUuid'])
                    }
                }
            })
            if (jrJvUuidList.length == 0 && balanceUuidList.length == 0) {
                errorList.push('请选择需要处理的流水')
            }
            if (jrJvUuidList.length+balanceUuidList.length+projectCardList.length > 160) {
                errorList.push('分摊项目和待处理流水的合计不可超过160行')
            }
            data['jrJvUuidList'] = jrJvUuidList
            data['balanceUuidList'] = balanceUuidList
            data['usedProject'] = true
            break
        }
        case 'LB_CHDB': {
            const fromWarehouse = oriTemp.getIn(['warehouseCardList', 0, 'cardUuid'])
            const toWarehouse = oriTemp.getIn(['warehouseCardList', 1, 'cardUuid'])
            let uuidArr = [], quantity = false, totalAmount = 0, amount = false, price = false
            const stockCardList = oriTemp.get('stockCardList').toJS()
            const hasEmpty = stockCardList.every((v,i) => {
                uuidArr.push(v['cardUuid'])
                if (v['isOpenedQuantity']) {
                    if (v['quantity'] <= 0) {
                        quantity = true
                    }
                    if (!v['isUniformPrice']) {
                        if (v['amount'] <= 0) {
                            amount = true
                        }
                        if (v['price'] <= 0) {
                            price = true
                        }
                    }
                } else {
                    if (v['amount'] <= 0) {
                        amount = true
                    }
                }

                v['financialInfo'] = v['financialInfo'] ? v['financialInfo'] : {}
                const openAssist = v['financialInfo']['openAssist']//辅助属性
                const openBatch = v['financialInfo']['openBatch']//批次管理
                const openShelfLife = v['financialInfo']['openShelfLife']//保质期管理
                const openSerial = v['financialInfo']['openSerial']//序列号
                const assistList = v['assistList' ]? v['assistList'] : []//选中的属性列表
                if (openAssist) {
                    const assistLength = v['financialInfo']['assistClassificationList'].length//设置的属性列表
                    if (assistLength!=assistList.length) { errorList.push(`存货明细${i+1}属性未选择完整`) }
                }
                if (openBatch) {
                    if (!v['batch']) { errorList.push(`存货明细${i+1}批次未选择`) }
                    if (openShelfLife && (!v['expirationDate'])) { errorList.push(`存货明细${i+1}批次未选择截止日期`) }
                }
                if (openSerial && quantity) { errorList.push(`存货明细${i+1}未选择序列号`) }
                totalAmount += Number(v['amount'])
                return v['cardUuid']
            })
            if (!fromWarehouse) {
                errorList.push('请选择调出仓库')
            }
            if (!toWarehouse) {
                errorList.push('请选择调入仓库')
            }
            if (fromWarehouse == toWarehouse) {
                errorList.push('调出仓库和调入仓库不能相同')
            }
            if (quantity) {
                errorList.push('存货明细有未填写的数量')
            }
            if (price) {
                errorList.push('存货明细的单价必填且需大于0')
            }
            if (amount) {
                errorList.push('存货明细的金额必填且需大于0')
            }
            if (stockCardList.length > 80) {
                errorList.push('存货行次不可超过80行')
            }

            data['amount'] = totalAmount
            break
        }
        case 'LB_CHYE': {
            switch (oriState) {
                case 'STATE_CHYE': {//未开启仓库
                    data['jrState'] = ''
                    break
                }
                case 'STATE_CHYE_CK': {
                    data['jrState'] = 'STATE_CHYE_CK'
                    break
                }
                case 'STATE_CHYE_CH': {
                    data['jrState'] = 'STATE_CHYE_CH'
                    break
                }
            }

            const stockCardList = oriTemp.get('stockCardList').toJS()
            let uniformPrice = stockCardList[0]['isUniformPrice']
            stockCardList.forEach((v,i) => {
                    let quantity = false, amount = false, price = false, bothZero = false, minus = false
                    if (!v['cardUuid']) {
                        errorList.push(`存货明细${i+1}未选择卡片`)
                        return
                    }
                    const isOpenedQuantity = v['isOpenedQuantity']

                    if (isOpenedQuantity) {
                        if (v['amount'] == 0 && v['quantity'] == 0) {
                            bothZero = true
                        }
                        if (v['amount'] != 0 && v['quantity'] != 0 && v['amount']*v['quantity'] < 0) {
                            minus = true
                        }
                    } else {
                        if (v['amount'] == 0) {
                            amount = true
                        }
                    }

                    if (quantity) {
                        errorList.push(`存货明细${i+1}数量不可为0`)
                    }
                    if (price) {
                        errorList.push(`存货明细${i+1}的单价必填且需大于0`)
                    }
                    if (amount) {
                        errorList.push(`存货明细${i+1}的调整金额不能为0`)
                    }
                    if (bothZero) {
                        errorList.push(`存货明细${i+1}数量或金额至少一项不为0`)
                    }
                    if (minus) {
                        errorList.push(`存货明细${i+1}数量和金额应该同正负`)
                    }

                    v['financialInfo'] = v['financialInfo'] ? v['financialInfo'] : {}
                    const openAssist = v['financialInfo']['openAssist']//辅助属性
                    const openBatch = v['financialInfo']['openBatch']//批次管理
                    const openShelfLife = v['financialInfo']['openShelfLife']//保质期管理
                    const openSerial = v['financialInfo']['openSerial']//序列号
                    const assistList = v['assistList' ]? v['assistList'] : []//选中的属性列表
                    if (openAssist) {
                        const assistLength = v['financialInfo']['assistClassificationList'].length//设置的属性列表
                        if (assistLength!=assistList.length) { errorList.push(`存货明细${i+1}属性未选择完整`) }
                    }
                    if (openBatch) {
                        if (!v['batch']) { errorList.push(`存货明细${i+1}批次未选择`) }
                        if (openShelfLife && (!v['expirationDate'])) { errorList.push(`存货明细${i+1}批次未选择截止日期`) }
                    }
                    if (openSerial && quantity) { errorList.push(`存货明细${i+1}未选择序列号`) }
    
                })                
        
            if (stockCardList.length > 160) {
                errorList.push('存货行次不可超过160行')
            }

            break
        }
        case 'LB_JXSEZC': {
            const categoryUuid = oriTemp.get('relationCategoryUuid')
            if (!categoryUuid) {
                errorList.push('请选择处理类别')
            }

            const usedStock = oriTemp.get('usedStock')
            if (usedStock) {
                const stockCardList = oriTemp.get('stockCardList').toJS()
                let amount = false, warehouse = false, hasEmptyAmount = false, totalAmount = 0

                const hasEmpty = stockCardList.every((v,i) => {
                    if (v['amount'] == 0) {
                        hasEmptyAmount = true
                    }
                    if (isOpenedWarehouse && v['warehouseCardUuid'] == '') {
                        warehouse = true
                    }
                    totalAmount += Number(v['amount'])
                    return v['cardUuid']
                })

                if (!hasEmpty) {
                    errorList.push('有未选择的存货卡片')
                }
                if (hasEmptyAmount) {
                    errorList.push('有未填写的税额')
                }
                if (warehouse) {
                    errorList.push('存货明细有未选择的仓库')
                }
                if (stockCardList.length > 160) {
                    errorList.push('存货行次不可超过160行')
                }
                data['amount'] = decimal(totalAmount)
            } else {
                data['stockCardList'] = []
            }
            if (Math.abs(Number(data['amount'])) == 0) {
                errorList.push('请填写税额')
            }
            break
        }
        case 'LB_CHZZ': {
            if (oriState=='STATE_CHZZ_ZZCX') {
                let stockCardListTotalAmount = 0, stockCardOtherListTotalAmount = 0

                data['stockCardList'].forEach((v,i) => {
                    const amount = v['amount'] ? Number(v['amount']) : 0
                    stockCardListTotalAmount += Number(amount)
                    if (!v['cardUuid']) {
                        data['stockCardList'].splice(i,1)
                        return false
                    }
                    if (v['amount'] <= 0) {
                        errorList.push(`物料明细${i+1}未填写金额`)
                    }
                    if (v['isOpenedQuantity']) {
                        if (v['quantity'] <= 0) {
                            errorList.push(`物料明细${i+1}未填写数量`)
                        } else {
                            if (!v['unitUuid']) {
                                errorList.push(`物料明细${i+1}未选择单位`)
                            }
                        }
                    }
                    if (isOpenedWarehouse && v['warehouseCardUuid'] == '') {
                        errorList.push(`物料明细${i+1}未选择仓库`)
                    }

                    v['financialInfo'] = v['financialInfo'] ? v['financialInfo'] : {}
                    const openAssist = v['financialInfo']['openAssist']//辅助属性
                    const openBatch = v['financialInfo']['openBatch']//批次管理
                    const openShelfLife = v['financialInfo']['openShelfLife']//保质期管理
                    const openSerial = v['financialInfo']['openSerial']//序列号
                    const assistList = v['assistList' ]? v['assistList'] : []//选中的属性列表
                    if (openAssist) {
                        const assistLength = v['financialInfo']['assistClassificationList'].length//设置的属性列表
                        if (assistLength!=assistList.length) { errorList.push(`物料明细${i+1}属性未选择完整`) }
                    }
                    if (openBatch) {
                        if (!v['batch']) { errorList.push(`物料明细${i+1}批次未选择`) }
                        if (openShelfLife && (!v['expirationDate'])) { errorList.push(`物料明细${i+1}批次未选择截止日期`) }
                    }
                })

                data['stockCardOtherList'].forEach((v,i) => {
                    const amount = v['amount'] ? Number(v['amount']) : 0
                    stockCardOtherListTotalAmount += Number(amount)
                    if (!v['cardUuid']) {
                        data['stockCardOtherList'].splice(i,1)
                        return false
                    }
                    if (v['amount'] <= 0) {
                        errorList.push(`成品明细${i+1}未填写金额`)
                    }
                    if (v['isOpenedQuantity']) {
                        if (v['quantity'] <= 0) {
                            errorList.push(`成品明细${i+1}未填写数量`)
                        } else {
                            if (!v['unitUuid']) {
                                errorList.push(`成品明细${i+1}未选择单位`)
                            }
                        }
                    }
                    if (isOpenedWarehouse && v['warehouseCardUuid'] == '') {
                        errorList.push(`成品明细${i+1}未选择仓库`)
                    }

                    v['financialInfo'] = v['financialInfo'] ? v['financialInfo'] : {}
                    const openAssist = v['financialInfo']['openAssist']//辅助属性
                    const openBatch = v['financialInfo']['openBatch']//批次管理
                    const openShelfLife = v['financialInfo']['openShelfLife']//保质期管理
                    const openSerial = v['financialInfo']['openSerial']//序列号
                    const assistList = v['assistList' ]? v['assistList'] : []//选中的属性列表
                    if (openAssist) {
                        const assistLength = v['financialInfo']['assistClassificationList'].length//设置的属性列表
                        if (assistLength!=assistList.length) { errorList.push(`成品明细${i+1}属性未选择完整`) }
                    }
                    if (openBatch) {
                        if (!v['batch']) { errorList.push(`成品明细${i+1}批次未选择`) }
                        if (openShelfLife && (!v['expirationDate'])) { errorList.push(`成品明细${i+1}批次未选择截止日期`) }
                    }
                })

                if (decimal(stockCardListTotalAmount) != decimal(stockCardOtherListTotalAmount)) {
                    errorList.push(`物料和成品的合计金额必须相等`)
                }
                if (decimal(data['stockCardList'].length+data['stockCardOtherList'].length) > 160) {
                    errorList.push(`成品和物料的存货合计不可超过160行`)
                }
            }
            if (oriState=='STATE_CHZZ_ZZD') {
                let totalNumber = 0

                data['stockCardList'].forEach((v,i) => {
                    if (!v['cardUuid']) {
                        data['stockCardList'].splice(i,1)
                        return
                    }
                    totalNumber++
                    let totalAmount = 0

                    if (v['isOpenedQuantity']) {
                        if (v['quantity'] <= 0) {
                            errorList.push(`组装成品${i+1}未填写数量`)
                        } else {
                            if (!v['unitUuid']) {
                                errorList.push(`组装成品${i+1}未选择单位`)
                            }
                        }
                    }
                    if (isOpenedWarehouse && v['warehouseCardUuid'] == '') {
                        errorList.push(`组装成品${i+1}未选择仓库`)
                    }

                    v['financialInfo'] = v['financialInfo'] ? v['financialInfo'] : {}
                    const openAssist = v['financialInfo']['openAssist']//辅助属性
                    const openBatch = v['financialInfo']['openBatch']//批次管理
                    const openShelfLife = v['financialInfo']['openShelfLife']//保质期管理
                    const openSerial = v['financialInfo']['openSerial']//序列号
                    const assistList = v['assistList' ]? v['assistList'] : []//选中的属性列表
                    if (openAssist) {
                        const assistLength = v['financialInfo']['assistClassificationList'].length//设置的属性列表
                        if (assistLength!=assistList.length) { errorList.push(`组装成品${i+1}属性未选择完整`) }
                    }
                    if (openBatch) {
                        if (!v['batch']) { errorList.push(`组装成品${i+1}批次未选择`) }
                        if (openShelfLife && (!v['expirationDate'])) { errorList.push(`组装成品${i+1}批次未选择截止日期`) }
                    }

                    v['childCardList'].forEach((v,i) => {
                        if (!v['cardUuid']) {
                            data['stockCardList']['childCardList'].splice(i,1)
                            return
                        }

                        if (v['isOpenedQuantity']) {
                            if (v['quantity'] <= 0) {
                                errorList.push(`物料明细${i+1}未填写数量`)
                            } else {
                                if (!v['unitUuid']) {
                                    errorList.push(`物料明细${i+1}未选择单位`)
                                }
                            }
                        }
                        if (isOpenedWarehouse && v['warehouseCardUuid'] == '') {
                            errorList.push(`物料明细${i+1}未选择仓库`)
                        }
                        if (v['amount'] <= 0) {
                            errorList.push(`物料明细${i+1}未填写金额`)
                        }
                        totalAmount += Number(v['amount'])

                        v['financialInfo'] = v['financialInfo'] ? v['financialInfo'] : {}
                        const openAssist = v['financialInfo']['openAssist']//辅助属性
                        const openBatch = v['financialInfo']['openBatch']//批次管理
                        const openShelfLife = v['financialInfo']['openShelfLife']//保质期管理
                        const openSerial = v['financialInfo']['openSerial']//序列号
                        const assistList = v['assistList' ]? v['assistList'] : []//选中的属性列表
                        if (openAssist) {
                            const assistLength = v['financialInfo']['assistClassificationList'].length//设置的属性列表
                            if (assistLength!=assistList.length) { errorList.push(`物料明细${i+1}属性未选择完整`) }
                        }
                        if (openBatch) {
                            if (!v['batch']) { errorList.push(`物料明细${i+1}批次未选择`) }
                            if (openShelfLife && (!v['expirationDate'])) { errorList.push(`物料明细${i+1}批次未选择截止日期`) }
                        }
                    })
                    data['stockCardList'][i]['amount']=totalAmount
                })
                if (totalNumber + chzzSort(data['stockCardList']) > 160) {
                    errorList.push(`成品和物料汇总的合计不可超过160行`)
                }


            }
            break
        }
        case 'LB_CHTRXM': {
            data['stockCardList'].forEach((v,i) => {
                const amount = v['amount'] ? Number(v['amount']) : 0
                if (!v['cardUuid']) {
                    data['stockCardList'].splice(i,1)
                    return false
                }
                if (v['amount'] <= 0) {
                    errorList.push(`存货明细${i+1}未填写金额`)
                }
                if (v['isOpenedQuantity']) {
                    if (v['quantity'] <= 0) {
                        //errorList.push(`存货明细${i+1}未填写数量`)
                    } else {
                        if (!v['unitUuid']) {
                            errorList.push(`存货明细${i+1}未选择单位`)
                        }
                    }
                }
                if (isOpenedWarehouse && v['warehouseCardUuid'] == '') {
                    errorList.push(`存货明细${i+1}未选择仓库`)
                }
                v['financialInfo'] = v['financialInfo'] ? v['financialInfo'] : {}
                const openAssist = v['financialInfo']['openAssist']//辅助属性
                const openBatch = v['financialInfo']['openBatch']//批次管理
                const openShelfLife = v['financialInfo']['openShelfLife']//保质期管理
                const openSerial = v['financialInfo']['openSerial']//序列号
                const assistList = v['assistList' ]? v['assistList'] : []//选中的属性列表
                if (openAssist) {
                    const assistLength = v['financialInfo']['assistClassificationList'].length//设置的属性列表
                    if (assistLength!=assistList.length) { errorList.push(`存货明细${i+1}属性未选择完整`) }
                }
                if (openBatch) {
                    if (!v['batch']) { errorList.push(`存货明细${i+1}批次未选择`) }
                    if (openShelfLife && (!v['expirationDate'])) { errorList.push(`存货明细${i+1}批次未选择截止日期`) }
                }
                if (openSerial && v['quantity'] <= 0) { errorList.push(`存货明细${i+1}未选择序列号`) }  
            })
            if (data['stockCardList'].length > 160) {
                errorList.push(`存货行次不可超过160行`)
            }

            break
        }
        case 'LB_XMJZ': {
            let showStock = true
            const projectProperty = projectCardList[0]['projectProperty']
            const amount = Number(data['amount'])
            const currentAmount = Number(data['currentAmount'])

            if (oriState=='STATE_XMJZ_XMJQ') {
                if (projectProperty=='XZ_CONSTRUCTION') {//施工项目
                    const jrAmount = Number(oriTemp.get('jrAmount'))
                    if (isInsert && jrAmount != 0 ) {
                        if (decimal(amount-currentAmount)!=decimal(jrAmount)) {
                            errorList.push(`合同毛利不等于待确认合同毛利，无法结清`)
                        }
                    }
                    if (!isInsert) {
                        data['amount']=''
                        data['currentAmount']=''
                    }
                } else {//生产项目
                    if (Number(oriTemp.get('jrAmount')) <= 0) {
                        showStock = false
                        data['stockCardList']=[]
                        if (Number(oriTemp.get('jrAmount')) < 0) {
                            errorList.push(`项目发生金额小于已入库金额`)
                        }
                    }
                }

            }
            if (projectProperty=='XZ_CONSTRUCTION') {
                showStock = false
                data['stockCardList']=[]
            }
            showStock && data['stockCardList'].forEach((v,i) => {
                const amount = v['amount'] ? Number(v['amount']) : 0
                if (!v['cardUuid']) {
                    data['stockCardList'].splice(i,1)
                    return false
                }
                if (v['amount'] <= 0) {
                    errorList.push(`存货明细${i+1}未填写金额`)
                }
                if (v['isOpenedQuantity']) {
                    if (v['quantity'] <= 0) {
                        //errorList.push(`存货明细${i+1}未填写数量`)
                    } else {
                        if (!v['unitUuid']) {
                            errorList.push(`存货明细${i+1}未选择单位`)
                        }
                    }
                }
                if (isOpenedWarehouse && v['warehouseCardUuid'] == '') {
                    errorList.push(`存货明细${i+1}未选择仓库`)
                }
                v['financialInfo'] = v['financialInfo'] ? v['financialInfo'] : {}
                const openAssist = v['financialInfo']['openAssist']//辅助属性
                const openBatch = v['financialInfo']['openBatch']//批次管理
                const openShelfLife = v['financialInfo']['openShelfLife']//保质期管理
                const openSerial = v['financialInfo']['openSerial']//序列号
                const assistList = v['assistList' ]? v['assistList'] : []//选中的属性列表
                if (openAssist) {
                    const assistLength = v['financialInfo']['assistClassificationList'].length//设置的属性列表
                    if (assistLength!=assistList.length) { errorList.push(`存货明细${i+1}属性未选择完整`) }
                }
                if (openBatch) {
                    if (!v['batch']) { errorList.push(`存货明细${i+1}批次未选择`) }
                    if (openShelfLife && (!v['expirationDate'])) { errorList.push(`存货明细${i+1}批次未选择截止日期`) }
                }
                if (openSerial && v['quantity'] <= 0) { errorList.push(`存货明细${i+1}未选择序列号`) } 
            })
            if (showStock && data['stockCardList'].length > 160) {
                errorList.push(`存货行次不可超过160行`)
            }
            let jrJvUuidList = [], balanceUuidList = []
            if (oriState=='STATE_XMJZ_XMJQ') {
                oriTemp.get('pendingStrongList').forEach(v => {
                    if (v.get('beOpened')) {
                        balanceUuidList.push(v.get('balanceUuid'))
                    } else {
                        jrJvUuidList.push(v.get('jrJvUuid'))
                    }
                    
                })
                data['jrJvUuidList'] = jrJvUuidList
                data['balanceUuidList'] = balanceUuidList
            }
            if (oriState=='STATE_XMJZ_QRSRCB' && amount == 0 && currentAmount == 0) {
                errorList.push(`收入金额和成本金额至少填写一项`)
            }
            break
        }
		default: null
	}

    if (checkAccount && !oriTemp.getIn(['accounts', 0, 'accountUuid'])) {
        errorList.push('请选择账户')
    }
    //账户的处理
    if (!usedAccounts && !checkAccount && data['accounts'] && data['accounts'].length && data['accounts'][0]['accountUuid'] == '') {
        data['accounts'] = []
    }

    //发票的检验
    // if (scale == 'small' && data['billList']) {
    //     if (categoryType == 'LB_YYZC' || categoryType == 'LB_FYZC' || oriState == 'STATE_CQZC_YF') {
    //         data['billList'] = []
    //     }
    // }

    //自定义税额的校验
    if (data['billList'] && data['billList'][0]['taxRate'] == -1) {
        let tax = data['billList'][0]['tax']
        if (Math.abs(Number(tax)) == 0) {
            errorList.push('请填写税额')
        }
        if (Math.abs(Number(tax)) > Math.abs(Number(data['amount']))) {
            errorList.push('税额不能大于价税合计')
        }
        if (data['amount']*tax < 0) {
            errorList.push('税额和金额必须同正负')
        }
    }

    return errorList
}
