import { fromJS }	from 'immutable'
import { decimal } from 'app/utils'

export function changeStockCard (state, action) {
    const cardType = action.cardType
    switch (action.dataType) {
        case 'card' : {
            const item = action.value
            const amount = state.getIn(['oriTemp', cardType, action.idx, 'amount'])
            if (action.categoryType=='YYSZ') {//营业收入支出
                const currentItem = state.getIn(['oriTemp', cardType, action.idx])
                const categoryType = state.getIn(['oriTemp', 'categoryType'])
                let list = [], carryoverList = []

                action.value.map((item, i) => {
                    let warehouseCardName = '', warehouseCardUuid = '', warehouseCardCode = ''
                    let unitName = '', unitUuid = '', price = '', amount = ''
                    if (currentItem && i==0) {
                        // amount = currentItem.get('amount')
                        warehouseCardName = currentItem.get('warehouseCardName')
                        warehouseCardUuid = currentItem.get('warehouseCardUuid')
                        warehouseCardCode = currentItem.get('warehouseCardCode')
                    }

                    if (item['isOpenedQuantity']) {
                        if (item['unit']['unitList'].length==0) {//单单位填写默认单价
                            unitName = item['unit']['name']
                            unitUuid = item['unit']['uuid']
                            if (item['unitPriceList']) {
                                item['unitPriceList'].forEach(v => {
                                    if (v['unitUuid']==unitUuid) {
                                        if (categoryType=='LB_YYSR' && v['type']=='2') {
                                            price = Number(v['defaultPrice'])
                                        }
                                        if (categoryType=='LB_YYZC' && v['type']=='1') {
                                            price = Number(v['defaultPrice'])
                                        }
                                    }
                                })
                            }
                        }
                        if (item['unit']['unitList'].length > 0) {//多单位填写默认单价
                            if (item['unitPriceList']) {
                                let unitPriceUuid = ''
                                for (const v of item['unitPriceList']) {
                                    if (categoryType=='LB_YYSR' && v['type']=='2') {
                                        price = Number(v['defaultPrice'])
                                        unitPriceUuid = v['unitUuid']
                                        break
                                    }
                                    if (categoryType=='LB_YYZC' && v['type']=='1') {
                                        price = Number(v['defaultPrice'])
                                        unitPriceUuid = v['unitUuid']
                                        break
                                    }
                                }
                                if (unitPriceUuid) {
                                    item['unit']['unitList'].push({name: item['unit']['name'], uuid: item['unit']['uuid']})
                                    item['unit']['unitList'].forEach(v => {
                                        if (v['uuid']==unitPriceUuid) {
                                            unitName = v['name']
                                            unitUuid = v['uuid']
                                        }
                                    })
                                }

                            }
                        }

                    }

                    list.push({
                        cardUuid: item['uuid'],
                        code: item['code'],
                        name: item['oriName'],
                        isOpenedQuantity: item['isOpenedQuantity'],
                        unitName,
                        unitUuid,
                        warehouseCardName: warehouseCardName ? warehouseCardName : '',
                        warehouseCardUuid: warehouseCardUuid ? warehouseCardUuid : '',
                        warehouseCardCode: warehouseCardCode ? warehouseCardCode : '',
                        price,
                        quantity: '',
                        amount,
                        financialInfo: item['financialInfo'] ? item['financialInfo'] : {},
                        assistList: [],
                        batch: '',
                        batchUuid: '',
                        expirationDate: '',
                    })

                    carryoverList.push({
                        cardUuid: item['uuid'],
                        code: item['code'],
                        name: item['oriName'],
                        amount: '',
                        warehouseCardUuid: warehouseCardUuid ? warehouseCardUuid : '',
                    })
                })

                let stockCardList = state.getIn(['oriTemp', cardType]).toJS()
                let carryoverCardList = state.getIn(['oriTemp', 'carryoverCardList']).toJS()
                stockCardList.splice(action.idx, 1, ...list)
                carryoverCardList.splice(action.idx, 1, ...carryoverList)

                state = state.setIn(['oriTemp', cardType], fromJS(stockCardList))
                .setIn(['oriTemp', 'carryoverCardList'], fromJS(carryoverCardList))

            }
            if (action.categoryType=='JZCB') {//结转成本
                const isJz = state.getIn(['oriTemp', 'oriState'])=='STATE_YYSR_ZJ' ? true : false//是否是直接结转
                const currentItem = state.getIn(['oriTemp', cardType, action.idx])
                let list = []

                action.value.map((item, i) => {
                    if (isJz) {
                        let warehouseCardName = '', warehouseCardUuid = '', warehouseCardCode = ''
                        let unitName = '', unitUuid = '', amount = '', uniformUuid = ''
                        if (currentItem && i==0) {
                            //amount = currentItem.get('amount')
                            warehouseCardName = currentItem.get('warehouseCardName')
                            warehouseCardUuid = currentItem.get('warehouseCardUuid')
                            warehouseCardCode = currentItem.get('warehouseCardCode')
                            uniformUuid = currentItem.get('uniformUuid')
                        }

                        if (item['isOpenedQuantity'] && item['unit']) {
                            unitName = item['unit']['name']
                            unitUuid = item['unit']['uuid']
                        }

                        list.push({
                            cardUuid: item['cardUuid'],
                            code: item['code'],
                            name: item['oriName'],
                            isOpenedQuantity: item['isOpenedQuantity'],
                            isUniformPrice: item['isUniformPrice'],
                            unitName,
                            unitUuid,
                            basicUnitQuantity: 1,
                            warehouseCardName: warehouseCardName ? warehouseCardName : '',
                            warehouseCardUuid: warehouseCardUuid ? warehouseCardUuid : '',
                            warehouseCardCode: warehouseCardCode ? warehouseCardCode : '',
                            uniformUuid: uniformUuid ? uniformUuid : '',
                            price: '',
                            quantity: '',
                            amount,
                            financialInfo: item['financialInfo'] ? item['financialInfo'] : {},
                            assistList: [],
                            batch: '',
                            batchUuid: '',
                            expirationDate: '',
                        })
                    } else {
                        list.push({
                            cardUuid: item['cardUuid'],
                            code: item['code'],
                            name: item['oriName'],
                            isOpenedQuantity: item['isOpenedQuantity'],
                            isUniformPrice: item['isUniformPrice'],
                            amount,
                        })
                    }

                })
                let stockCardList = state.getIn(['oriTemp', cardType]).toJS()
                stockCardList.splice(action.idx, 1, ...list)

                state = state.setIn(['oriTemp', cardType], fromJS(stockCardList))
            }
            if (action.categoryType=='CHDB') {//存货调拨
                let list = []

                action.value.map((item, i) => {
                    let unitName = '', unitUuid = ''
                    if (item['isOpenedQuantity']) {
                        unitUuid = item['unit']['uuid']
                        unitName = item['unit']['name']
                    }

                    list.push({
                        cardUuid: item['uuid'],
                        code: item['code'],
                        name: item['oriName'],
                        isOpenedQuantity: item['isOpenedQuantity'],
                        isUniformPrice: item['isUniformPrice'],
                        unitName,
                        unitUuid,
                        basicUnitQuantity: 1,
                        price: '',
                        unitPrice: '',//参考单价 同一单价
                        quantity: '',
                        amount: '',
                        financialInfo: item['financialInfo'] ? item['financialInfo'] : {},
                        assistList: [],
                        batch: '',
                        batchUuid: '',
                        expirationDate: '',
                    })
                })

                let stockCardList = state.getIn(['oriTemp', cardType]).toJS()
                stockCardList.splice(action.idx, 1, ...list)

                state = state.setIn(['oriTemp', cardType], fromJS(stockCardList))
            }
            if (action.categoryType=='CHYE') {//存货余额调整
                let list = []
                let stockCardList = state.getIn(['oriTemp', cardType]).toJS()
                const currentItem = state.getIn(['oriTemp', cardType, action.idx])

                action.value.map((item, i) => {
                    let unitName = '', unitUuid = ''
                    let warehouseCardName = '', warehouseCardUuid = '', warehouseCardCode = ''
                    if (currentItem && i==0) {
                        warehouseCardName = currentItem.get('warehouseCardName')
                        warehouseCardUuid = currentItem.get('warehouseCardUuid')
                        warehouseCardCode = currentItem.get('warehouseCardCode')
                    }
                    if (item['isOpenedQuantity']) {
                        unitUuid = item['unit']['uuid']
                        unitName = item['unit']['name']
                    }
                    list.push({
                        cardUuid: item['uuid'],
                        code: item['code'],
                        name: item['oriName'],
                        isOpenedQuantity: item['isOpenedQuantity'],
                        isUniformPrice: item['isUniformPrice'],
                        amount: '',
                        price: '',
                        quantity: '',
                        unitUuid,
                        unitName,
                        warehouseCardName,
                        warehouseCardUuid,
                        warehouseCardCode,
                        financialInfo: item['financialInfo'] ? item['financialInfo'] : {},
                        assistList: [],
                        batch: '',
                        batchUuid: '',
                        expirationDate: '',
                    })
                })

                stockCardList.splice(action.idx, 1, ...list)
                state = state.setIn(['oriTemp', cardType], fromJS(stockCardList))
            }
            if (action.categoryType=='JXSEZC') {//进项税额转出
                let list = []
                let stockCardList = state.getIn(['oriTemp', cardType]).toJS()

                action.value.map((item, i) => {
                    list.push({
                        cardUuid: item['uuid'],
                        code: item['code'],
                        name: item['oriName'],
                        amount: '',
                    })
                })

                stockCardList.splice(action.idx, 1, ...list)
                state = state.setIn(['oriTemp', cardType], fromJS(stockCardList))
            }
            if (action.categoryType=='CHZZ') {//存货组装
                const currentItem = state.getIn(['oriTemp', cardType, action.idx])
                let list = []

                action.value.map((item, i) => {
                    let warehouseCardName = '', warehouseCardUuid = '', warehouseCardCode = ''
                    let unitName = '', unitUuid = '', price = '', amount = ''
                    if (currentItem && i==0) {
                        warehouseCardName = currentItem.get('warehouseCardName')
                        warehouseCardUuid = currentItem.get('warehouseCardUuid')
                        warehouseCardCode = currentItem.get('warehouseCardCode')
                    }

                    if (item['isOpenedQuantity']) {
                        unitUuid = item['unit']['uuid']
                        unitName = item['unit']['name']
                    }

                    list.push({
                        cardUuid: item['uuid'],
                        code: item['code'],
                        name: item['oriName'],
                        isOpenedQuantity: item['isOpenedQuantity'],
                        unitName,
                        unitUuid,
                        basicUnitQuantity: 1,
                        warehouseCardName: warehouseCardName ? warehouseCardName : '',
                        warehouseCardUuid: warehouseCardUuid ? warehouseCardUuid : '',
                        warehouseCardCode: warehouseCardCode ? warehouseCardCode : '',
                        price,
                        quantity: '',
                        amount,
                        financialInfo: item['financialInfo'] ? item['financialInfo'] : {},
                        assistList: [],
                        batch: '',
                        batchUuid: '',
                        expirationDate: '',
                    })
                })

                let stockCardList = state.getIn(['oriTemp', cardType]).toJS()
                stockCardList.splice(action.idx, 1, ...list)

                state = state.setIn(['oriTemp', cardType], fromJS(stockCardList))
            }
            if (action.categoryType=='CHZZ_ZZD') {//存货组装 组装单
                let list = []
                action.value.map((item, i) => {
                    let childCardList = []
                    item.materialList.forEach(v => {
                        childCardList.push({
                            cardUuid: v['materialUuid'],
                            code: v['code'],
                            name: v['name'],
                            isOpenedQuantity: v['isOpenQuantity'],
                            unitName: v['unitName'],
                            unitUuid: v['unitUuid'],
                            warehouseCardName: '',
                            warehouseCardUuid: '',
                            warehouseCardCode: '',
                            price: '',
                            quantity: '',
                            amount: '',
                            oriQuantity: v['quantity'],
                            financialInfo: v['financialInfo'] ? v['financialInfo'] : {},
                            assistList: [],
                            batch: '',
                            batchUuid: '',
                            expirationDate: '',
                        })
                    })

                    list.push({
                        cardUuid: item['uuid'],
                        code: item['code'],
                        name: item['oriName'],
                        isOpenedQuantity: true,
                        unitName: item['unitName'],
                        unitUuid: item['unitUuid'],
                        warehouseCardName: '',
                        warehouseCardUuid: '',
                        warehouseCardCode: '',
                        price: '',
                        quantity: '',
                        amount: '',
                        oriQuantity: item['quantity'],
                        childCardList,
                        financialInfo: item['financialInfo'] ? item['financialInfo'] : {},
                        assistList: [],
                        batch: '',
                        batchUuid: '',
                        expirationDate: '',
                    })
                })

                let stockCardList = state.getIn(['oriTemp', cardType]).toJS()
                stockCardList.splice(action.idx, 1, ...list)

                state = state.setIn(['oriTemp', cardType], fromJS(stockCardList))
            }
            if (action.categoryType=='CHZZ_ZZD_CHILD') {
                let list = []

                action.value.map((item, i) => {
                    let unitName = '', unitUuid = ''
                    if (item['isOpenedQuantity']) {
                        unitUuid = item['unit']['uuid']
                        unitName = item['unit']['name']
                    }

                    list.push({
                        cardUuid: item['uuid'],
                        code: item['code'],
                        name: item['oriName'],
                        isOpenedQuantity: item['isOpenedQuantity'],
                        unitName,
                        unitUuid,
                        warehouseCardName: '',
                        warehouseCardUuid: '',
                        warehouseCardCode: '',
                        price: '',
                        quantity: '',
                        amount: '',
                        financialInfo: item['financialInfo'] ? item['financialInfo'] : {},
                        assistList: [],
                        batch: '',
                        batchUuid: '',
                        expirationDate: '',
                    })
                })

                let childCardList = state.getIn(['oriTemp', 'stockCardList', action.idx[0], 'childCardList']).toJS()
                childCardList.splice(action.idx[1], 1, ...list)

                state = state.setIn(['oriTemp', 'stockCardList', action.idx[0], 'childCardList'], fromJS(childCardList))
            }
            if (action.categoryType=='CHTRXM') {//存货投入项目
                let list = []
                action.value.map((item, i) => {
                    let unitName = '', unitUuid = '', amount = ''

                    if (item['isOpenedQuantity'] && item['unit']) {
                        unitName = item['unit']['name']
                        unitUuid = item['unit']['uuid']
                    }

                    list.push({
                        cardUuid: item['uuid'],
                        code: item['code'],
                        name: item['oriName'],
                        isOpenedQuantity: item['isOpenedQuantity'],
                        unitName,
                        unitUuid,
                        basicUnitQuantity: 1,
                        warehouseCardName: '',
                        warehouseCardUuid: '',
                        warehouseCardCode: '',
                        price: '',
                        quantity: '',
                        amount: '',
                        financialInfo: item['financialInfo'] ? item['financialInfo'] : {},
                        assistList: [],
                        batch: '',
                        batchUuid: '',
                        expirationDate: '',
                    })
                })
                let stockCardList = state.getIn(['oriTemp', cardType]).toJS()
                stockCardList.splice(action.idx, 1, ...list)

                state = state.setIn(['oriTemp', cardType], fromJS(stockCardList))
            }
            if (action.categoryType=='XMJZ') {//项目结转
                let list = []
                action.value.map((item, i) => {
                    let unitName = '', unitUuid = '', amount = ''

                    if (item['isOpenedQuantity'] && item['unit']) {
                        unitName = item['unit']['name']
                        unitUuid = item['unit']['uuid']
                    }

                    list.push({
                        cardUuid: item['uuid'],
                        code: item['code'],
                        name: item['oriName'],
                        isOpenedQuantity: item['isOpenedQuantity'],
                        unitName,
                        unitUuid,
                        basicUnitQuantity: 1,
                        warehouseCardName: '',
                        warehouseCardUuid: '',
                        warehouseCardCode: '',
                        price: '',
                        quantity: '',
                        amount: '',
                        financialInfo: item['financialInfo'] ? item['financialInfo'] : {},
                        assistList: [],
                        batch: '',
                        batchUuid: '',
                        expirationDate: '',
                    })
                })
                let stockCardList = state.getIn(['oriTemp', cardType]).toJS()
                stockCardList.splice(action.idx, 1, ...list)

                state = state.setIn(['oriTemp', cardType], fromJS(stockCardList))
            }

            break
        }
        case 'warehouse' : {
            state = state.setIn(['oriTemp', cardType, action.idx, 'warehouseCardUuid'], action.value.uuid)
                        .setIn(['oriTemp', cardType, action.idx, 'uniformUuid'], action.value.uniformUuid)
                        .setIn(['oriTemp', cardType, action.idx, 'warehouseCardCode'], action.value.code)
                        .setIn(['oriTemp', cardType, action.idx, 'warehouseCardName'], action.value.name)
            
            if (action.categoryType=='YYSZ') {
                state = state.setIn(['oriTemp', 'carryoverCardList', action.idx, 'warehouseCardUuid'], action.value.uuid)
            }    
                               
            break
        }
        case 'unit' : {
            const basicUnitQuantity = action.value.basicUnitQuantity ? action.value.basicUnitQuantity : 1
            state = state.setIn(['oriTemp', cardType, action.idx, 'unitUuid'], action.value.value)
                        .setIn(['oriTemp', cardType, action.idx, 'unitName'], action.value.key)
                        .setIn(['oriTemp', cardType, action.idx, 'basicUnitQuantity'], basicUnitQuantity)
            break
        }
        case 'quantity' :
        case 'price' :
        case 'amount' :
        case 'afterQuantity' :
        case 'afterAmount' :
        case 'afterPrice' :
        case 'assistList':
        case 'serialList': {
            state = state.setIn(['oriTemp', cardType, action.idx, action.dataType], action.value)
            if (action.categoryType=='YYSZ' && ['assistList'].includes(action.dataType)) {
                state = state.setIn(['oriTemp', 'carryoverCardList', action.idx, action.dataType], action.value)
            }
            break
        }
        case 'add' : {
            state = state.setIn(['oriTemp', cardType, action.idx], fromJS({amount: ''}))

            if (action.categoryType=='YYSZ') {
                state = state.setIn(['oriTemp', 'carryoverCardList', action.idx], fromJS({amount: ''}))
            }

            break
        }
        case 'delete' : {
            state = state.deleteIn(['oriTemp', cardType, action.idx])

            if (action.categoryType=='YYSZ') {
                state = state.deleteIn(['oriTemp', 'carryoverCardList', action.idx])
            }

            break
        }
        case 'carryoverCardList' : {
            state = state.setIn(['oriTemp', 'carryoverCardList', action.idx, 'amount'], action.value)
            break
        }
        case 'delete_zzd_child': {
            state = state.deleteIn(['oriTemp', cardType, action.idx[0], 'childCardList', action.idx[1]])
            break
        }
        case 'warehouse_zzd_child': {
            state = state.setIn(['oriTemp', cardType, action.idx[0], 'childCardList', action.idx[1], 'warehouseCardUuid'], action.value.uuid)
                        .setIn(['oriTemp', cardType, action.idx[0], 'childCardList', action.idx[1], 'warehouseCardCode'], action.value.code)
                        .setIn(['oriTemp', cardType, action.idx[0], 'childCardList', action.idx[1], 'warehouseCardName'], action.value.name)
            break
        }
        case 'bitch_zzd_child': {
            state = state.mergeIn(['oriTemp', cardType, action.idx[0], 'childCardList', action.idx[1]], action.value)
            break
        }
        case 'quantity_zzd': {//组装单组装修改成品数量
            const assemblyList = state.getIn(['cardAllList', 'assemblyList']).toJS()
            let item = state.getIn(['oriTemp', 'stockCardList', action.idx]).toJS()
            let childCardList = []

            for (const assemblyItem of assemblyList) {
                if (assemblyItem['uuid']==item['cardUuid']) {
                    assemblyItem.materialList.forEach(v => {
                        let basicUnitQuantity = 1
                        v['unitList'].map(unitItem => {
                            if (v['unitUuid']==unitItem['uuid']) {
                                basicUnitQuantity = unitItem['basicUnitQuantity']
                            }
                        })
                        let quantity = decimal(Number(action.value)*(Number(v['quantity'])/Number(assemblyItem['quantity'])))
                        if (v['financialInfo'] && v['financialInfo']['openSerial']) {
                            quantity = ''
                        }
                        childCardList.push({
                            cardUuid: v['materialUuid'],
                            code: v['code'],
                            name: v['name'],
                            isOpenedQuantity: v['isOpenQuantity'],
                            unitName: v['unitName'],
                            unitUuid: v['unitUuid'],
                            basicUnitQuantity,
                            warehouseCardName: '',
                            warehouseCardUuid: '',
                            warehouseCardCode: '',
                            price: '',
                            quantity,
                            amount: '',
                            financialInfo: v['financialInfo'] ? v['financialInfo'] : {},
                            assistList: [],
                            batch: '',
                            batchUuid: '',
                            expirationDate: '',
                        })
                    })
                    break
                }
            }
            item['quantity'] = action.value
            item['childCardList'] = childCardList

            state = state.setIn(['oriTemp', 'stockCardList', action.idx], fromJS(item))
            break
        }
        case 'bitch': {//批次信息
            state = state.mergeIn(['oriTemp', cardType, action.idx], action.value)
            if (action.categoryType=='YYSZ') {
                state = state.mergeIn(['oriTemp', 'carryoverCardList', action.idx], action.value)
            }
            break
        }
        case 'addAssist': {//新增属性
            const inventoryUuid = action.value.getIn(['cardData', 'inventoryUuid'])
            const classificationUuid = action.value.getIn(['cardData', 'classificationUuid'])
            const propertyList = action.value.get('propertyList')

            if (cardType=='CHZZ_ZZD_CHILD') {//组装单物料
                state = state.updateIn(['oriTemp', 'stockCardList'], (item => item.map(v => {
                    if (v.get('cardUuid')==inventoryUuid) {
                        v.getIn(['financialInfo', 'assistClassificationList']).map((w, i) => {
                            if (w.get('uuid')==classificationUuid) {
                                v = v.updateIn(['financialInfo', 'assistClassificationList', i ,'propertyList'], list => propertyList)
                            }
                        })
                    }

                    v = v.update('childCardList', childItem => childItem.map((w, i) => {
                        if (w.get('cardUuid')==inventoryUuid) {
                            w.getIn(['financialInfo', 'assistClassificationList']).map((assist, i) => {
                                if (assist.get('uuid')==classificationUuid) {
                                    w = w.setIn(['financialInfo', 'assistClassificationList', i ,'propertyList'], propertyList)
                                }
                            })
                        }
                        return w
                    }))

                    return v
                })))

                break
            }

            state = state.updateIn(['oriTemp', cardType], (item => item.map(v => {
                if (v.get('cardUuid')==inventoryUuid) {
                    v.getIn(['financialInfo', 'assistClassificationList']).map((w, i) => {
                        if (w.get('uuid')==classificationUuid) {
                            v = v.updateIn(['financialInfo', 'assistClassificationList', i ,'propertyList'], list => propertyList)
                        }
                    })
                }
                return v
            })))

            break
        }
    }
    return state
}
