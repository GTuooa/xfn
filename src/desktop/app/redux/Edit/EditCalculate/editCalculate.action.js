import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.account.js'
import { fromJS, toJS } from 'immutable'

import { showMessage, formatDate } from 'app/utils'
import { message, Modal } from 'antd'
import thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import {
    DateLib,
    numberCalculate
} from 'app/utils'
import * as allActions from 'app/redux/Home/All/all.action'

import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
import * as innerCalculateActions from 'app/redux/Edit/EditCalculate/innerCalculate.action'

export const changeEditCalculateCommonState = (parent, position, value) => ({
    type: ActionTypes.CHANGE_EIDT_CALCULATE_COMMON_STATE,
    parent,
    position,
    value
})

export const initEncodeType = () => ({
    type: ActionTypes.INIT_ENCODE_TYPE,
})

export const initEditCalculateTemp = (strJudgeType, data, callBackObj, temp,needCategoryUuid) => ({
    type: ActionTypes.INIT_EDIT_CALCULATE_TEMP,
    strJudgeType,
    receivedData: data,
    callBackObj,
    temp,
    needCategoryUuid
})

export const selectEditCalculateItem = (uuid, Tem, stockCardUuid, amount) => ({
    type: ActionTypes.SELECT_EDIT_CALCULATE_ITEM,
    uuid,
    Tem,
    stockCardUuid,
    amount
})
export const selectEditCalculateItemAll = (selectAll, Tem, ListName) => ({
    type: ActionTypes.SELECT_EDIT_CALCULATE_ITEM_ALL,
    selectAll,
    Tem,
    ListName
})
// 成本结转选择流水
export const selectEditCbjzItem = (item,checked,oriDate) => (dispatch,getState) => {
    const editCalculateState = getState().editCalculateState
    const curItem = item.toJS()
    let uuidList = editCalculateState.getIn(['CostTransferTemp', 'uuidList'])

    const showLowerList = editCalculateState.getIn(['views', 'selectList'])
    const selectItem = editCalculateState.getIn(['views', 'selectItem'])

    const oldSelectUuid = editCalculateState.getIn(['CostTransferTemp', 'selectStockUuidList'])
    const oldSelectItem = editCalculateState.getIn(['CostTransferTemp', 'selectStockItem']).toJS()
    let selectStockUuidList = [], selectStockItem=oldSelectItem, selectUuidList = []


    const sortFun = (list)=> list.sort((a,b) => {
        if (a.classificationUuid > b.classificationUuid) { return 1 }
        return -1
    })
    const getSpliceUuidFun = (list) => {
        let sliceUuidArr = [], sliceUuid = ''
        list && list.map(v => {
            sliceUuidArr.push({classificationUuid: v.get('classificationUuid'),propertyUuid: v.get('propertyUuid')})
        })
        const itemAssistList = sortFun(sliceUuidArr)
        itemAssistList && itemAssistList.map(v => {
            sliceUuid = `${sliceUuid}${Limit.TREE_JOIN_STR}${v.classificationUuid}${Limit.TREE_JOIN_STR}${v.propertyUuid}`
        })
        return sliceUuid
    }
    const assistUuid = getSpliceUuidFun(item.get('assistList'))

    if (!checked) { //选中
        if(uuidList.indexOf(curItem.jrJvUuid) === -1){
            let newShowLowerList = showLowerList,newSelectItem = selectItem

            const stockIndex = oldSelectItem.findIndex(v => {
                const oldItemAssistUuid = getSpliceUuidFun(fromJS(v.assistList))
                return v.cardUuid === item.get('stockCardUuid') &&
                        ( item.get('storeCardUuid') ? v.warehouseCardUuid === item.get('storeCardUuid') : true ) &&
                        (assistUuid ? oldItemAssistUuid === assistUuid : true) &&
                        (item.get('batchUuid') ? v.batchUuid === item.get('batchUuid') : true)
            } )
            selectStockUuidList = oldSelectUuid.toJS()
            if(stockIndex === -1){
                if(!(oldSelectItem.length < Limit.STOCK_MAX_NUMBER_ONE)){
                    message.info(`所选存货总数不可超过${Limit.STOCK_MAX_NUMBER_ONE}个`)

                }else{
                    uuidList = uuidList.push(curItem.jrJvUuid)
                    newShowLowerList = showLowerList.push(item.get('jrJvUuid'))
                    newSelectItem = selectItem.push(item)
                    const price = (curItem.number === 0 || numberCalculate(curItem.quantityAmount,curItem.number,2,'multiply') < 0)  ? 0 : numberCalculate(curItem.quantityAmount,curItem.number,4,'divide',4)
                    selectStockItem = oldSelectItem.concat(
                        [{
                            cardUuid: item.get('stockCardUuid'),
                            name: item.get('stockCardName'),
                            code: item.get('stockCardCode'),
                            quantity: item.get('quantity'),
                            amount: item.get('isOpenedQuantity') ? numberCalculate(price,item.get('quantity'),2,'multiply') : '',
                            quantityAmount: curItem.quantityAmount,
                            number:curItem.number,
                            storeNumber: curItem.storeNumber,
                            unitName:curItem.unitCardName,
                            unitUuid:curItem.unitCardUuid,
                            referencePrice: numberCalculate(curItem.quantityAmount,curItem.number,4,'divide',4),
                            referenceQuantity: curItem.storeNumber,
                            isOpenedQuantity: item.get('isOpenedQuantity'),
                            warehouseCardName: item.get('storeCardName'),
                            warehouseCardUuid: item.get('storeCardUuid'),
                            warehouseCardCode: item.get('storeCardCode'),
                            assistList: item.get('assistList'),
                            batch: item.get('batch'),
                            batchUuid: item.get('batchUuid'),
                            productionDate: item.get('productionDate'),
                            price,
                        }]
                    )
                    selectStockUuidList.push(item.get('stockCardUuid'))
                    selectStockUuidList.map(v => selectUuidList.push({cardUuid:v,storeUuid:''}))
                }

            }else{

                uuidList = uuidList.push(curItem.jrJvUuid)
                newShowLowerList = showLowerList.push(item.get('jrJvUuid'))
                newSelectItem = selectItem.push(item)
                const quantity = numberCalculate(oldSelectItem[stockIndex]['quantity'],item.get('quantity'),4,'add',4)
                const unitName = item.get('unitCardName') ? item.get('unitCardName') : selectStockItem[stockIndex]['unitName'] ? selectStockItem[stockIndex]['unitName'] : selectStockItem[stockIndex]['unitCardName']
                const unitUuid = item.get('unitCardUuid') ? item.get('unitCardUuid') : selectStockItem[stockIndex]['unitUuid'] ? selectStockItem[stockIndex]['unitUuid'] : selectStockItem[stockIndex]['unitCardUuid']
                const number = numberCalculate(oldSelectItem[stockIndex]['number'],item.get('number'),4,'add',4)
                const quantityAmount = numberCalculate(oldSelectItem[stockIndex]['quantityAmount'],item.get('quantityAmount'))
                // const storeNumber = numberCalculate(oldSelectItem[stockIndex]['storeNumber'],item.get('storeNumber'),4,'add',4)
                const price = (number === 0 || numberCalculate(quantityAmount,number,2,'multiply') < 0 )  ? 0 : numberCalculate(quantityAmount,number,4,'divide',4)
                const amount = item.get('isOpenedQuantity') ? numberCalculate(price,quantity,2,'multiply') : ''
                selectStockItem[stockIndex] = {
                    ...selectStockItem[stockIndex],
                    quantity,
                    unitName,
                    unitUuid,
                    number,
                    quantityAmount,
                    storeNumber: item.get('storeNumber'),
                    price,
                    referencePrice: numberCalculate(quantityAmount,number,4,'divide',4),
                    referenceQuantity: item.get('storeNumber'),
                    amount
                }
            }

            dispatch({
                type: ActionTypes.SELECT_EDIT_CBJZ_ITEM,
                uuidList,
                newShowLowerList,
                newSelectItem,
                selectStockItem: fromJS(selectStockItem),
                selectStockUuidList
            })
        }



        // selectUuidList.length && dispatch(getCostTransferPrice(oriDate, selectUuidList,0,'CostTransfer','selectStockItem'))
    }else{ //取消选中
        const newShowLowerList = showLowerList.splice(showLowerList.findIndex(v => v === item.get('jrJvUuid')), 1)
        const newSelectItem = selectItem.filter(v => v.get('jrJvUuid')!== item.get('jrJvUuid'))
        const idx = uuidList.findIndex(v => v === curItem.jrJvUuid)
        uuidList = uuidList.splice(idx, 1)

        const stockIndex = oldSelectItem.findIndex(v => {

            const oldItemAssistUuid = getSpliceUuidFun(fromJS(v.assistList))
            return v.cardUuid === item.get('stockCardUuid') &&
            (item.get('storeCardUuid')? v.warehouseCardUuid === item.get('storeCardUuid') : true) &&
            (assistUuid ? oldItemAssistUuid === assistUuid : true) &&
            (item.get('batchUuid') ? v.batchUuid === item.get('batchUuid'): true)
        })
        let newSelectItemUuidList = []
        newSelectItem && newSelectItem.size && newSelectItem.map(v => {

            let selectSpliceUuid = getSpliceUuidFun(v.get('assistList'))
            selectSpliceUuid = `${selectSpliceUuid}${Limit.TREE_JOIN_STR}${v.get('stockCardUuid')}${Limit.TREE_JOIN_STR}${v.get('storeCardUuid')}`

            if(newSelectItemUuidList.indexOf(selectSpliceUuid) === -1){
                newSelectItemUuidList.push(selectSpliceUuid)
            }
        })
        if(newSelectItemUuidList.indexOf(`${assistUuid}${Limit.TREE_JOIN_STR}${item.get('stockCardUuid')}${Limit.TREE_JOIN_STR}${item.get('storeCardUuid')}`) === -1){
            selectStockItem = oldSelectItem.filter(v => {
                const oldItemAssistUuid = getSpliceUuidFun(fromJS(v.assistList))

                return !(v.cardUuid === item.get('stockCardUuid') && (item.get('storeCardUuid') ? v.warehouseCardUuid === item.get('storeCardUuid') : true) && (assistUuid ? oldItemAssistUuid === assistUuid : true) && (item.get('batchUuid') ? v.batchUuid === item.get('batchUuid') : true ))
            })
        }else{
            selectStockItem = oldSelectItem

            const quantity = numberCalculate(oldSelectItem[stockIndex]['quantity'],item.get('quantity'),4,'subtract',4)
            const unitName = item.get('unitCardName') ? item.get('unitCardName') : selectStockItem[stockIndex]['unitName'] ? selectStockItem[stockIndex]['unitName'] : selectStockItem[stockIndex]['unitCardName']
            const unitUuid = item.get('unitCardUuid') ? item.get('unitCardUuid') : selectStockItem[stockIndex]['unitUuid'] ? selectStockItem[stockIndex]['unitUuid'] : selectStockItem[stockIndex]['unitCardUuid']
            const number = numberCalculate(oldSelectItem[stockIndex]['number'],item.get('number'),4,'subtract',4)
            const quantityAmount = numberCalculate(oldSelectItem[stockIndex]['quantityAmount'],item.get('quantityAmount'),2,'subtract')
            // const storeNumber = numberCalculate(oldSelectItem[stockIndex]['storeNumber'],item.get('storeNumber'),4,'subtract',4)
            const price = (number === 0 || numberCalculate(quantityAmount,number,2,'multiply') < 0  )  ? 0 : numberCalculate(quantityAmount,number,4,'divide',4)
            const amount = item.get('isOpenedQuantity') ? numberCalculate(price,quantity,2,'multiply') : ''
            selectStockItem[stockIndex] = {
                ...selectStockItem[stockIndex],
                quantity,
                unitName,
                unitUuid,
                number,
                quantityAmount,
                storeNumber: item.get('storeNumber'),
                price,
                referencePrice: numberCalculate(quantityAmount,number,4,'divide',4),
                referenceQuantity: item.get('storeNumber'),
                amount
            }
        }
        dispatch({
            type: ActionTypes.SELECT_EDIT_CBJZ_ITEM,
            uuidList,
            newShowLowerList,
            newSelectItem,
            selectStockItem: fromJS(selectStockItem),
            selectStockUuidList
        })
    }

}
export const selectEditCbjzItemAll = (selectAll, Tem, ListName,insertOrModify) => (dispatch,getState) => {
    const editCalculateState = getState().editCalculateState
    // const stockCardList = editCalculateState.getIn(['CostTransferTemp','stockCardList'])
    const oldSelectUuid = editCalculateState.getIn(['CostTransferTemp', 'selectStockUuidList'])
    const list = editCalculateState.getIn(['CostTransferTemp','costTransferList'])
    const oldSelectItem = editCalculateState.getIn(['CostTransferTemp', 'selectStockItem']).toJS()
    let chooseAllUuid = oldSelectUuid.toJS()
    list && list.size && list.map(item => {
        if(chooseAllUuid.indexOf(item.get('stockCardUuid')) == -1){
            chooseAllUuid.push(item.get('stockCardUuid'))
        }
    })
    if(!selectAll && chooseAllUuid.length > Limit.STOCK_MAX_NUMBER_ONE){
        message.info(`所选存货总数不可超过${Limit.STOCK_MAX_NUMBER_ONE}个`)
    }else{
        list && list.size && list.map(item => {
            dispatch(selectEditCbjzItem(item,selectAll))
        })
    }

}

// 选择账户
export const changeEditCalculateAccountName = (tab, placeUUid, placeName, value) => ({
    type: ActionTypes.CHANGE_EDIT_ACCOUNT_ACCOUNT_NAME,
    tab,
    placeUUid,
    placeName,
    value
})
// 获取成本结转列表
export const getCostTransferList = (oriState, oriDate,stockCardList, categoryUuidList = [], storeUuidList = [],condition = '',currentPage = 1) => (dispatch, getState) => {
    dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
    const editCalculateState = getState().editCalculateState
    const editRunningAllState = getState().editRunningAllState
    const editRunningState = getState().editRunningState


    const insertOrModify = editRunningAllState.getIn(['views', 'insertOrModify'])
    const stockUuidList = stockCardList ? stockCardList : editCalculateState.getIn(['CostTransferTemp', 'stockUuidList'])
    const canModifyList = editCalculateState.getIn(['CostTransferTemp', 'canModifyList'])
    const pageSize = editCalculateState.getIn(['CostTransferTemp', 'pageSize'])

    const newOriState = oriState ? oriState : editCalculateState.getIn(['CostTransferTemp', 'oriState'])
    const newOriDate = oriDate ? oriDate.slice(0, 10) : editRunningState.getIn(['oriTemp', 'oriDate']).slice(0, 10)

    let cardUuidList = []
    // stockCardList.map((item) => {
    //     item.get('cardUuid') && cardUuidList.push(item.get('cardUuid'))
    // })
    if (newOriDate) {
        if (insertOrModify === 'insert') {
            fetchApi('getJrCarryoverList', 'POST', JSON.stringify({
                oriState: newOriState,
                oriDate: newOriDate,
                categoryUuidList,
                cardUuidList: stockUuidList,
                storeUuidList,
                condition,
                currentPage,
                pageSize,
            }), json => {
                dispatch({
                    type: ActionTypes.SWITCH_LOADING_MASK
                })
                if (showMessage(json)) {
                    dispatch({
                        type: ActionTypes.AFTER_GET_EDIT_CALCULATE_COMMON_LIST,
                        receivedData: json.data,
                        ListName: 'costTransferList',
                        temp: 'CostTransferTemp'
                    })
                }
            })
        } else {
            dispatch({
                type: ActionTypes.SWITCH_LOADING_MASK
            })
            const stockCardUuidArr = []
            stockCardList.map(v => {
                stockCardUuidArr.push(v.get('cardUuid'))
            })
            const list = canModifyList.filter(item => stockCardUuidArr.indexOf(item.get('stockCardUuid')) !== -1).toJS()
            let result = {
                list
            }
            dispatch({
                type: ActionTypes.AFTER_GET_EDIT_CALCULATE_COMMON_LIST,
                receivedData: {
                    result: list
                },
                ListName: 'costTransferList',
                temp: 'CostTransferTemp'
            })
        }

    } else {
        dispatch({
            type: ActionTypes.SWITCH_LOADING_MASK
        })
    }
}

export const initCarryoverFromChangeOriState = () => dispatch => {
    dispatch({
        type: ActionTypes.INIT_CATEGORY_FROM_CHANGE_ORISTATE,
    })
}

export const getCarryoverCategory = (oriDate, oriState,needSaveData) => (dispatch, getState) => {
    dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
    // const stokcCardList = getState().editCalculateState.getIn(['CostTransferTemp','stockCardList'])
    // let newCardUuidList = []
    // stokcCardList && stokcCardList.size && stokcCardList.map(item => {
    //     item.get('cardUuid') && newCardUuidList.push(item.get('cardUuid'))
    // })
    // if(cardUuid){
    //     newCardUuidList.push(cardUuid)
    // }
    // const cardUuidList = oriState === 'STATE_YYSR_ZJ' ? [] : stockUuidList ? stockUuidList : Array.from(new Set(newCardUuidList))
    // if (oriDate  && (oriState === 'STATE_YYSR_ZJ' || oriState !== 'STATE_YYSR_ZJ' && cardUuidList.length > 0)) {
    if (oriDate) {
        fetchApi('getCarryoverCategory', 'POST', JSON.stringify({
            oriDate,
            oriState,
            cardUuidList:[],
        }), json => {
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.GET_CARRYOVER_CATEGORY,
                    receivedData: json.data,
                    needSaveData
                })
            }
            dispatch({
                type: ActionTypes.SWITCH_LOADING_MASK
            })
        })
        if(oriState !== 'STATE_YYSR_ZJ'){
            dispatch(getCarryoverWhareHouseTreeList(oriDate,oriState,'',[]))
        }
    }else{
        dispatch({
            type: ActionTypes.SWITCH_LOADING_MASK
        })
        dispatch({
            type: ActionTypes.INIT_CATEGORY_FROM_GET_CATEGORY,
        })
    }

    dispatch(initCostStockList())
}
export const getInvoiceAuthList = (billAuthType, oriDate, setAss) => (dispatch, getState) => {
    if (oriDate) {
        fetchApi('getBusinessAuthList', 'POST', JSON.stringify({
            billAuthType,
            oriDate: oriDate.slice(0, 10)
        }), json => {
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.AFTER_GET_EDIT_CALCULATE_COMMON_LIST,
                    receivedData: json.data,
                    ListName: 'invoiceAuthList',
                    temp: 'InvoiceAuthTemp'
                })
            }
        })
    }
}
export const getInvoicingList = (billMakeOutType, oriDate) => (dispatch, getState) => {
    if (oriDate) {
        dispatch({
            type: ActionTypes.SWITCH_LOADING_MASK
        })
        fetchApi('getInvoiceList', 'GET', `billType=${billMakeOutType}&oriDate=${oriDate.slice(0,10)}`, json => {
            dispatch({
                type: ActionTypes.SWITCH_LOADING_MASK
            })
            if (showMessage(json)) {
                const ListName = billMakeOutType === 'BILL_MAKE_OUT_TYPE_XS' || billMakeOutType === 'BILL_MAKE_OUT_TYPE_TS' ? 'invoicingList' : 'invoiceAuthList'
                const temp = billMakeOutType === 'BILL_MAKE_OUT_TYPE_XS' || billMakeOutType === 'BILL_MAKE_OUT_TYPE_TS' ? 'InvoicingTemp' : 'InvoiceAuthTemp'
                dispatch({
                    type: ActionTypes.AFTER_GET_EDIT_CALCULATE_COMMON_LIST,
                    receivedData: json.data,
                    ListName,
                    temp
                })
            }
        })
    }
}
export const getTransferOutList = (oriDate) => (dispatch, getState) => {
    fetchApi('getTransferVatList', 'GET', `oriDate=${oriDate.slice(0,10)}`, json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_EDIT_CALCULATE_TRANSFER_OUT_LIST,
                receivedData: json.data
            })
        }
    })
}

const runningDateCheck = (oriDate, list) => {
    return list.every(v => new Date(v.get('oriDate')) <= new Date(oriDate))
}

export const changeEditCalculateCommonString = (tab, place, value) => (dispatch) => {
    let placeArr = typeof place === 'string' ? [`${tab}Temp`, place] : [`${tab}Temp`, ...place ]
    if (place[0] === 'views' || tab === '') {
        placeArr = place
    }
    dispatch({
        type: ActionTypes.CHANGE_CALCULATE_COMMON_STRING,
        tab,
        placeArr,
        value
    })

}
//保存或修改  内部转账
export const insertOrModifyLrInternalTransfer = (saveAndNew) => (dispatch, getState) => {
    const editRunningState = getState().editRunningState
    const allState = getState().allState
    const hideCategoryList = allState.get('hideCategoryList')
    const categoryUuid = hideCategoryList.find(v => v.get('categoryType') === 'LB_ZZ').get('uuid')
    const editCalculateState = getState().editCalculateState
    let InternalTransferTemp = editCalculateState.get('InternalTransferTemp')

    // 附件
    const enclosureList = getState().editRunningAllState.get('enclosureList')

    const oriState = InternalTransferTemp.get('oriState')
    const amount = parseFloat(InternalTransferTemp.get('amount'))
    InternalTransferTemp = InternalTransferTemp.set('categoryUuid', categoryUuid).set('categoryType', 'LB_ZZ')
    InternalTransferTemp = InternalTransferTemp.set('amount', parseFloat(InternalTransferTemp.get('amount')))
    InternalTransferTemp = InternalTransferTemp.set('enclosureList', enclosureList)
    const insertOrModify = getState().editRunningAllState.getIn(['views', 'insertOrModify'])

    InternalTransferTemp = InternalTransferTemp.get('oriUuid') ? InternalTransferTemp : InternalTransferTemp.set('oriUuid', editRunningState.getIn(['oriTemp', 'oriUuid']))
    InternalTransferTemp = InternalTransferTemp.get('jrNumber') ? InternalTransferTemp : InternalTransferTemp.set('jrNumber', editRunningState.getIn(['oriTemp', 'jrNumber']))

    const oriDate = editRunningState.getIn(['oriTemp', 'oriDate'])
    const oriAbstract = InternalTransferTemp.get('oriAbstract')
    const fromuuid = InternalTransferTemp.get('fromAccountUuid')
    const touuid = InternalTransferTemp.get('toAccountUuid')
    const jrIndex = InternalTransferTemp.get('jrIndex')
    const needUsedPoundage = InternalTransferTemp.get('needUsedPoundage')
    const poundageCurrentCardList = InternalTransferTemp.get('poundageCurrentCardList').toJS()
    const poundageProjectCardList = InternalTransferTemp.get('poundageProjectCardList').toJS()
    const poundageAmount = InternalTransferTemp.get('poundageAmount')
    const chooseFirstWay = InternalTransferTemp.get('chooseFirstWay')
    const finallyAmount = chooseFirstWay ? amount : numberCalculate(amount,poundageAmount,2,'subtract')

    if (insertOrModify === 'modify' && !jrIndex) {
        return message.info('流水号必填')
    }
    if (!oriDate) {
        return message.info('日期必填')
    }

    if (!categoryUuid) {
        return message.info('流水类别未获取')
    }

    if (!oriAbstract) {
        return message.info('摘要必填')
    } else if (oriAbstract.length > 64) {
        return message.info('摘要长度不能超过64个字符')
    }
    if (!fromuuid) {
        return message.info('转出账户未获取')
    }
    if (!touuid) {
        return message.info('转入账户未获取')
    }
    dispatch({
        type: ActionTypes.SWITCH_LOADING_MASK
    })

    let data = {
        jrIndex,
        oriDate: oriDate.slice(0, 10),
        categoryUuid,
        oriState,
        amount: finallyAmount,
        oriAbstract,
        needUsedPoundage,
        poundageCurrentCardList,
        poundageProjectCardList,
        accounts: [{
                accountUuid: `${fromuuid}`,
                accountStatus: 'ACCOUNT_STATUS_FROM',
                poundageAmount
            },
            {
                accountUuid: `${touuid}`,
                accountStatus: 'ACCOUNT_STATUS_TO'
            }
        ],
        enclosureList
    }
    if (insertOrModify === 'modify') {
        const oriUuid = InternalTransferTemp.get('oriUuid')
        const jrUuid = InternalTransferTemp.get('jrUuid')
        const encodeType = editCalculateState.getIn(['views','encodeType'])
        data = encodeType ? {
            oriUuid,
            jrUuid,
            ...data,
            encodeType
        } : {
            oriUuid,
            jrUuid,
            ...data
        }
    }

    fetchApi(`${insertOrModify}InternalTransfer`, 'POST', JSON.stringify(data), json => {
        dispatch({
            type: ActionTypes.SWITCH_LOADING_MASK
        })
        if (json.code !== 0) {
            message.info(json.code + ' ' + json.message)
            dispatch(initEncodeType())
        } else {
            if(json.data.encodeType !== null && json.data.encodeType !== undefined){
                dispatch(changeCanModifyJrIndex(json.data.encodeType,jrIndex,saveAndNew))
            }else{
                dispatch(initEncodeType())
                if (insertOrModify === 'insert') {
                    const { jrIndexList } = json.data
                    message.success(`已生成如下流水：记 ${json.data.jrIndex} 号${(jrIndexList || []).reduce((to,cur) => to+=`、记 ${cur} 号`,'')}`)
                } else {
                    message.success(json.message)
                }
                if (saveAndNew) { //保存并新增
                    dispatch(initEditCalculateTemp('saveAndNew', '', '', 'InternalTransferTemp'))
                } else { //保存
                    dispatch(initEditCalculateTemp('afterSave', InternalTransferTemp, json.data, 'InternalTransferTemp'))
                    dispatch(modifyRefreshCalculate('LB_ZZ', saveAndNew))
                }
            }

        }
    })
}

// 保存或修改  长期资产折旧摊销
export const insertOrModifyLrDepreciation = (saveAndNew) => (dispatch, getState) => {
    const editRunningState = getState().editRunningState
    const editCalculateState = getState().editCalculateState
    let DepreciationTemp = editCalculateState.get('DepreciationTemp')
    const oriState = DepreciationTemp.get('oriState')
    DepreciationTemp = DepreciationTemp.set('categoryType', 'LB_ZJTX')
    const amount = parseFloat(DepreciationTemp.get('amount'))
    DepreciationTemp = DepreciationTemp.set('amount', amount)
    const insertOrModify = getState().editRunningAllState.getIn(['views', 'insertOrModify'])
    const beProject = editCalculateState.getIn(['views', 'beProject'])

    DepreciationTemp = DepreciationTemp.get('oriUuid') ? DepreciationTemp : DepreciationTemp.set('oriUuid', editRunningState.getIn(['oriTemp', 'oriUuid']))
    DepreciationTemp = DepreciationTemp.get('jrNumber') ? DepreciationTemp : DepreciationTemp.set('jrNumber', editRunningState.getIn(['oriTemp', 'jrNumber']))

    const oriDate = editRunningState.getIn(['oriTemp', 'oriDate'])
    const oriAbstract = DepreciationTemp.get('oriAbstract')
    const categoryUuid = DepreciationTemp.get('categoryUuid')
    const propertyCost = DepreciationTemp.get('propertyCost')
    const usedProject = DepreciationTemp.get('usedProject')
    const projectCard = DepreciationTemp.get('projectCard')
    const oriUuid = DepreciationTemp.get('oriUuid')
    const jrUuid = DepreciationTemp.get('jrUuid')
    const jrIndex = DepreciationTemp.get('jrIndex')
    const encodeType = editCalculateState.getIn(['views','encodeType'])
    const projectCardList = []
    beProject && usedProject && projectCardList.push({
        cardUuid: projectCard.get('cardUuid'),
        amount: amount,
        name: projectCard.get('name')
    })

    // 附件
    const enclosureList = getState().editRunningAllState.get('enclosureList')


    if (insertOrModify === 'modify' && !jrIndex) {
        return message.info('流水号必填')
    }
    if (!oriDate) {
        return message.info('日期必填')
    }

    if (!categoryUuid) {
        return message.info('处理类别未获取')
    }

    if (!oriAbstract) {
        return message.info('摘要必填')
    } else if (oriAbstract.length > 64) {
        return message.info('摘要长度不能超过64个字符')
    }
    if (beProject && usedProject && !projectCard.get('cardUuid')) {
        return message.info('请选择项目卡片')
    }
    dispatch({
        type: ActionTypes.SWITCH_LOADING_MASK
    })
    let data = {
        jrIndex,
        oriDate: oriDate.slice(0, 10),
        categoryUuid,
        oriState,
        propertyCost,
        amount,
        oriAbstract,
        usedProject: beProject ? usedProject : false,
        projectCardList,
        enclosureList
    }
    data = insertOrModify === 'modify' ? encodeType ?
    {...data,jrUuid,oriUuid,encodeType} :  { ...data, jrUuid, oriUuid } : data

    fetchApi(`${insertOrModify}Depreciation`, 'POST', JSON.stringify(data), json => {
        dispatch({
            type: ActionTypes.SWITCH_LOADING_MASK
        })
        if (json.code !== 0) {
            message.info(json.code + ' ' + json.message)
            dispatch(initEncodeType())
        } else {
            if(json.data.encodeType !== null && json.data.encodeType !== undefined){
                dispatch(changeCanModifyJrIndex(json.data.encodeType,jrIndex,saveAndNew))
            }else{
                const {
                    businessjrNumberList
                } = json.data
                if (insertOrModify === 'insert') {
                    const { jrIndexList } = json.data
                    message.success(`已生成如下流水：记 ${json.data.jrIndex} 号${(jrIndexList || []).reduce((to,cur) => to+=`、记 ${cur} 号`,'')}`)
                } else {
                    message.success(json.message)
                }
                if (saveAndNew) { //保存并新增
                    dispatch(initEditCalculateTemp('saveAndNew', '', '', 'DepreciationTemp'))
                    dispatch(getAssetsList('LB_ZJTX', 'DepreciationTemp'))
                    const projectRange = editCalculateState.getIn(['views', 'projectRange'])
                    dispatch(getProjectCardList(projectRange))
                } else { //保存
                    dispatch(initEditCalculateTemp('afterSave', DepreciationTemp, json.data, 'DepreciationTemp'))
                    dispatch(modifyRefreshCalculate('LB_ZJTX'))
                }
                dispatch(initEncodeType())
            }

        }
    })
}
// 保存或修改 成本结转
export const insertOrModifyLrCostTransfer = (saveAndNew) => (dispatch, getState) => {
    const editCalculateState = getState().editCalculateState
  const editRunningState = getState().editRunningState

  let CostTransferTemp = editCalculateState.get('CostTransferTemp')
  const selectAllItem = editCalculateState.getIn(['views','selectItem'])
  const selectAllList = editCalculateState.getIn(['views','selectList'])
  const costTransferList = CostTransferTemp.get('costTransferList')
  const insertOrModify = getState().editRunningAllState.getIn(['views', 'insertOrModify'])
  const dealTypeUuid = CostTransferTemp.get('dealTypeUuid')
  const oriState = CostTransferTemp.get('oriState')
  const oriDate = editRunningState.getIn(['oriTemp','oriDate'])
  const oriUuid = CostTransferTemp.get('oriUuid')
  const uuidList = CostTransferTemp.get('uuidList')
  const oriAbstract = CostTransferTemp.get('oriAbstract')
  const carryoverAmount = CostTransferTemp.get('carryoverAmount')
  const categoryName = CostTransferTemp.get('categoryName')
  const stockCardList = CostTransferTemp.get('stockCardList')
  const selectStockItem = CostTransferTemp.get('selectStockItem')
  const stockCardUuidList = CostTransferTemp.get('stockCardUuidList')
  const usedProject = CostTransferTemp.get('usedProject')
  const projectCard = CostTransferTemp.get('projectCard')
  const jrIndex = CostTransferTemp.get('jrIndex')
  const encodeType = editCalculateState.getIn(['views','encodeType'])
  const propertyCostList = CostTransferTemp.get('propertyCostList') ? CostTransferTemp.get('propertyCostList').toJS() : []
  const propertyCost = CostTransferTemp.get('propertyCost') ? CostTransferTemp.get('propertyCost') : propertyCostList.length ? propertyCostList[0] : ''
  const beProject = CostTransferTemp.get('beProject')
  // 附件
  const enclosureList = getState().editRunningAllState.get('enclosureList')

  let cardUuidList = []
   stockCardUuidList && stockCardUuidList.map(item => {
       cardUuidList.push(item.get('uuid'))
   })
  if (!oriDate) {
    return message.info('日期必填')
  } else {
    const isLegal = runningDateCheck(oriDate, costTransferList)
    if (!isLegal) {
      return message.info('日期不能比所选流水的日期前')
    }
  }


  if(insertOrModify === 'modify' && !jrIndex){
      return message.info('流水号必填')
  }
  if (!oriAbstract) {
    return message.info('摘要必填')
    } else if (oriAbstract.length > 64) {
        return message.info('摘要长度不能超过64个字符')
    }

  if (!selectAllList.size && oriState !== 'STATE_YYSR_ZJ') {
    return message.info('请勾选要结转的流水')
  }
  let amountCorrect = 'false',
  stockName = [],
  stockCardName = [],
  stockListName = [],
  uuidCorrect = 'false',
  unitCardNameCorrect = 'false',
  quantityCorrect = 'false'
  let newStockList = []
  const stockMapList = oriState === 'STATE_YYSR_ZJ' ? stockCardList : selectStockItem
  stockMapList && stockMapList.forEach(v => {

      if(v.get('cardUuid')){
          if(!Number(v.get('amount'))){
              newStockList.push({
                  ...v.toJS(),
                  amount: 0
              })
              // amountCorrect = 'amountTrue'
              // stockName.push(`${v.get('code')} ${v.get('name')}`)
          }else{
              newStockList.push({
                  ...v.toJS(),
                  amount: Number(v.get('amount'))
              })
          }
          if(oriState === 'STATE_YYSR_ZJ' && v.get('isOpenedQuantity')){
              if(!v.get('unitUuid') && v.get('quantity')){
                  unitCardNameCorrect = 'unitCardNameTrue'
                  stockCardName.push(`${v.get('code')} ${v.get('name')}`)
              }
              if(!v.get('quantity') && !v.get('amount')){
                  amountCorrect = 'amountTrue'
                  stockName.push(`${v.get('code')} ${v.get('name')}`)
              }
          }
      }else{
          if(v.get('amount')){
              uuidCorrect = 'uuidTrue'
          }

      }

  })
  let noRepeatStockName = Array.from(new Set(stockName))
  let noRepeatStockListName = Array.from(new Set(stockListName))

  if(oriState === 'STATE_YYSR_ZJ' && !dealTypeUuid){
       return message.info(`请选择处理类别`)
  }
  if(oriState === 'STATE_YYSR_ZJ' && beProject && usedProject){
      if(!projectCard.getIn([0,'cardUuid'])){
         return message.info(`请选择项目`)
      }
  }
  if (oriState === 'STATE_YYSR_ZJ' && amountCorrect === 'amountTrue') {
    return message.info(`${noRepeatStockName}的数量金额不能同时为0`)
  }
  if (uuidCorrect === 'uuidTrue') {
    return message.info(`请选择存货`)
  }
  // if(quantityCorrect === 'quantityTrue'){
  //   return message.info(`请输入${stockName}的数量`)
  //
  // }
  if(quantityCorrect !== 'quantityTrue' && unitCardNameCorrect === 'unitCardNameTrue'){
    return message.info(`请输入${stockCardName}的单位`)

  }
  if(oriState === 'STATE_YYSR_ZJ' && newStockList.length > Limit.STOCK_MAX_NUMBER_TWO){
      return message.info(`所选存货总数不可超过${Limit.STOCK_MAX_NUMBER_TWO}个`)
  }

  dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
  const finallyUsed =  beProject ? usedProject : false

  let data = {
      jrIndex,
      categoryUuid: dealTypeUuid ? dealTypeUuid : '',
      oriState,
      oriDate: oriDate.slice(0,10),
      stockCardList: newStockList,
      jrJvUuidList: selectAllList,
      oriAbstract,
      enclosureList,
      projectCard: finallyUsed ? projectCard.get(0) : null,
      usedProject: finallyUsed,
    //   propertyCost: finallyUsed ? propertyCost : '',
      propertyCost: propertyCostList.length>1 ? propertyCost : (finallyUsed ? propertyCost : ''),
  }
  data = insertOrModify === 'modify' ? encodeType ?
  {...data,oriUuid,encodeType } : {...data,oriUuid } : data


  fetchApi(`${insertOrModify}JrCarryover`, 'POST', JSON.stringify(data), json => {
      if (json.code !== 0) {
          message.info(json.code + ' ' + json.message)
          dispatch(initEncodeType())
      } else {

          if(json.data.encodeType !== null && json.data.encodeType !== undefined){
              dispatch(changeCanModifyJrIndex(json.data.encodeType,jrIndex,saveAndNew))
          }else{
              dispatch(initEncodeType())
              if (insertOrModify === 'insert') {
                  const { jrIndexList } = json.data
                  message.success(`已生成如下流水：记 ${json.data.jrIndex} 号${(jrIndexList || []).reduce((to,cur) => to+=`、记 ${cur} 号`,'')}`)
              } else {
                  message.success(json.message)
              }
              if (saveAndNew) { //保存并新增
                  dispatch(initEditCalculateTemp('saveAndNew', '', '', 'CostTransferTemp'))
                  dispatch(getCostCarryoverStockList(oriDate,'STATE_YYSR_XS',''))
                  dispatch(getCostTransferList(oriState, oriDate, [],[],[],'',1))
                  dispatch(getCarryoverCategory(oriDate,oriState))
              } else { //保存
                  dispatch(initEditCalculateTemp('afterSave', CostTransferTemp, json.data,'CostTransferTemp'))
                  dispatch(modifyRefreshCalculate('LB_JZCB',saveAndNew))
                  oriState === 'STATE_YYSR_ZJ' && dispatch(editRunningActions.getCostStockList(oriDate,'STATE_YYSR_ZJ',dealTypeUuid))
              }
          }

      }
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
  })
}
// 保存或修改 发票认证
export const insertOrModifyLrInvoiceAuthPz = (saveAndNew) => (dispatch, getState) => {
    const editRunningState = getState().editRunningState
    const allState = getState().allState
    const editCalculateState = getState().editCalculateState
    const hideCategoryList = allState.get('hideCategoryList')

    const categoryChildList = hideCategoryList.find(v => v.get('categoryType') === 'LB_ZZSHS') ? hideCategoryList.find(v => v.get('categoryType') === 'LB_ZZSHS').get('childList') : []
    const categoryUuid = categoryChildList.find(v => v.get('categoryType') === 'LB_FPRZ') ? categoryChildList.find(v => v.get('categoryType') === 'LB_FPRZ').get('uuid') : ''

    let InvoiceAuthTemp = editCalculateState.get('InvoiceAuthTemp')

    // 附件
    const enclosureList = getState().editRunningAllState.get('enclosureList')

    InvoiceAuthTemp = InvoiceAuthTemp.set('enclosureList', enclosureList)
    const invoiceAuthList = InvoiceAuthTemp.get('invoiceAuthList')
    // const insertOrModify = editCalculateState.getIn(['views', 'insertOrModify'])
    const insertOrModify = getState().editRunningAllState.getIn(['views', 'insertOrModify'])
    const uuidList = InvoiceAuthTemp.get('uuidList')
    const billType = InvoiceAuthTemp.get('billAuthType')
    const oriDate = editRunningState.getIn(['oriTemp', 'oriDate'])
    const oriAbstract = InvoiceAuthTemp.get('oriAbstract')
    const oriState = InvoiceAuthTemp.get('oriState')
    const jrUuid = InvoiceAuthTemp.get('jrUuid')
    const oriUuid = InvoiceAuthTemp.get('oriUuid')
    const amount = InvoiceAuthTemp.get('amount')
    const jrIndex = InvoiceAuthTemp.get('jrIndex')
    const encodeType = editCalculateState.getIn(['views','encodeType'])

    InvoiceAuthTemp = InvoiceAuthTemp.set('categoryUuid', categoryUuid)

    const pendingStrongList = []
    let moreAmount = 0
    invoiceAuthList.map((item) => {
        if (uuidList.indexOf(item.get('jrJvUuid')) > -1) {
            pendingStrongList.push(item.toJS())
            if (insertOrModify === 'insert') {
                moreAmount = numberCalculate(moreAmount,item.get('notHandleAmount'))
            } else {
                moreAmount = numberCalculate(numberCalculate(moreAmount,item.get('notHandleAmount')),item.get('handleAmount'))
            }
        }
    })
    if (insertOrModify === 'modify' && !jrIndex) {
        return message.info('流水号必填')
    }
    if (!oriDate) {
        return message.info('日期必填')
    } else {
        const isLegal = runningDateCheck(oriDate, invoiceAuthList)
        if (!isLegal) {
            return message.info('日期不能比所选流水的日期前')
        }
    }

    if (!categoryUuid) {
        return message.info('流水类别未获取')
    }

    if (!oriAbstract) {
        return message.info('摘要必填')
    } else if (oriAbstract.length > 64) {
        return message.info('摘要长度不能超过64个字符')
    }

    if (!uuidList.size) {
        return message.info('请勾选要认证的流水')
    }
    if(pendingStrongList.length > Limit.RUNNING_CHECKED_MAX_NUMBER){
        return message.info(`底部列表勾选的核销流水不能超过${Limit.RUNNING_CHECKED_MAX_NUMBER}条`)
    }

    dispatch({
        type: ActionTypes.SWITCH_LOADING_MASK
    })
    let data = {
        jrIndex,
        oriDate: oriDate.slice(0, 10),
        categoryUuid,
        oriState,
        billType,
        amount: uuidList.size > 1 ? moreAmount : amount,
        oriAbstract,
        pendingStrongList,
        enclosureList
    }
    data = insertOrModify === 'modify' ? encodeType ? {...data, jrUuid, oriUuid,encodeType} : { ...data, jrUuid, oriUuid } : data
    fetchApi(`${insertOrModify}Invoice`, 'POST', JSON.stringify(data), json => {
        if (json.code !== 0) {
            message.info(json.code + ' ' + json.message)
            dispatch(initEncodeType())
        } else {
            if(json.data.encodeType !== null && json.data.encodeType !== undefined){
                dispatch(changeCanModifyJrIndex(json.data.encodeType,jrIndex,saveAndNew))
            }else{
                dispatch(initEncodeType())
                if (insertOrModify === 'insert') {
                    const { jrIndexList } = json.data
                    message.success(`已生成如下流水：记 ${json.data.jrIndex} 号${(jrIndexList || []).reduce((to,cur) => to+=`、记 ${cur} 号`,'')}`)
                } else {
                    message.success(json.message)
                }
                if (saveAndNew) { //保存并新增
                    dispatch(initEditCalculateTemp('saveAndNew', '', '', 'InvoiceAuthTemp'))
                    dispatch(getInvoicingList('BILL_AUTH_TYPE_CG', oriDate))
                } else { //保存
                    dispatch(initEditCalculateTemp('afterSave', InvoiceAuthTemp, json.data, 'InvoiceAuthTemp'))
                    dispatch(modifyRefreshCalculate('LB_FPRZ', saveAndNew))
                }
            }

        }
        dispatch({
            type: ActionTypes.SWITCH_LOADING_MASK
        })
    })

}
// 保存或修改 开具发票
export const insertOrModifyLrInvoicingPz = (saveAndNew) => (dispatch, getState) => {
    const editRunningState = getState().editRunningState
    const allState = getState().allState
    const editCalculateState = getState().editCalculateState
    const hideCategoryList = allState.get('hideCategoryList')
    const categoryChildList = hideCategoryList.find(v => v.get('categoryType') === 'LB_ZZSHS') ? hideCategoryList.find(v => v.get('categoryType') === 'LB_ZZSHS').get('childList') : []
    const categoryUuid = categoryChildList.find(v => v.get('categoryType') === 'LB_KJFP') ? categoryChildList.find(v => v.get('categoryType') === 'LB_KJFP').get('uuid') : ''

    const encodeType = editCalculateState.getIn(['views','encodeType'])

    let InvoicingTemp = editCalculateState.get('InvoicingTemp')

    // 附件
    const enclosureList = getState().editRunningAllState.get('enclosureList')

    InvoicingTemp = InvoicingTemp.set('enclosureList', enclosureList)
    InvoicingTemp = InvoicingTemp.set('categoryUuid', categoryUuid)
    const invoicingList = InvoicingTemp.get('invoicingList')
    const insertOrModify = getState().editRunningAllState.getIn(['views', 'insertOrModify'])
    const uuidList = InvoicingTemp.get('uuidList')
    const billType = InvoicingTemp.get('billMakeOutType')
    const oriDate = editRunningState.getIn(['oriTemp', 'oriDate'])
    const oriAbstract = InvoicingTemp.get('oriAbstract')
    const oriState = InvoicingTemp.get('oriState')
    const jrUuid = InvoicingTemp.get('jrUuid')
    const oriUuid = InvoicingTemp.get('oriUuid')
    const amount = InvoicingTemp.get('amount')
    const jrIndex = InvoicingTemp.get('jrIndex')


    const pendingStrongList = []
    let moreAmount = 0
    invoicingList.map((item) => {
        if (uuidList.indexOf(item.get('jrJvUuid')) > -1) {
            pendingStrongList.push(item.toJS())
            if (insertOrModify === 'insert') {
                moreAmount = numberCalculate(moreAmount,item.get('notHandleAmount'))
            } else {
                moreAmount = numberCalculate(numberCalculate(moreAmount,item.get('notHandleAmount')),item.get('handleAmount'))
            }
        }
    })
    if (insertOrModify === 'modify' && !jrIndex) {
        return message.info('流水号必填')
    }

    if (!oriDate) {
        return message.info('日期必填')
    } else {
        const isLegal = runningDateCheck(oriDate, invoicingList)
        if (!isLegal) {
            return message.info('日期不能比所选流水的日期前')
        }
    }

    if (!categoryUuid) {
        return message.info('流水类别未获取')
    }

    if (!oriAbstract) {
        return message.info('摘要必填')
    } else if (oriAbstract.length > 64) {
        return message.info('摘要长度不能超过64个字符')
    }

    if (!uuidList.size) {
        return message.info('请勾选要认证的流水')
    }
    if(pendingStrongList.length > Limit.RUNNING_CHECKED_MAX_NUMBER){
        return message.info(`底部列表勾选的核销流水不能超过${Limit.RUNNING_CHECKED_MAX_NUMBER}条`)
    }

    dispatch({
        type: ActionTypes.SWITCH_LOADING_MASK
    })
    let data = {
        jrIndex,
        oriDate: oriDate.slice(0, 10),
        categoryUuid,
        oriState,
        billType,
        amount: uuidList.size > 1 ? moreAmount : amount,
        oriAbstract,
        pendingStrongList,
        enclosureList
    }
    data = insertOrModify === 'modify' ? encodeType ? {...data, jrUuid, oriUuid,encodeType } : { ...data, jrUuid, oriUuid } : data
    fetchApi(`${insertOrModify}Invoice`, 'POST', JSON.stringify(data), json => {
        if (json.code !== 0) {
            message.info(json.code + ' ' + json.message)
            dispatch(initEncodeType())
        } else {
            if(json.data.encodeType !== null && json.data.encodeType !== undefined){
                dispatch(changeCanModifyJrIndex(json.data.encodeType,jrIndex,saveAndNew))
            }else{
                dispatch(initEncodeType())
                if (insertOrModify === 'insert') {
                    const { jrIndexList } = json.data
                    message.success(`已生成如下流水：记 ${json.data.jrIndex} 号${(jrIndexList || []).reduce((to,cur) => to+=`、记 ${cur} 号`,'')}`)
                } else {
                    message.success(json.message)
                }
                if (saveAndNew) { //保存并新增
                    dispatch(initEditCalculateTemp('saveAndNew', '', '', 'InvoicingTemp'))
                    dispatch(getInvoicingList('BILL_MAKE_OUT_TYPE_XS', oriDate))
                } else { //保存
                    dispatch(initEditCalculateTemp('afterSave', InvoicingTemp, json.data, 'InvoicingTemp'))
                    dispatch(modifyRefreshCalculate('LB_KJFP', saveAndNew))
                }
            }

        }
        dispatch({
            type: ActionTypes.SWITCH_LOADING_MASK
        })
    })
}
// 保存或修改 转出未交
export const insertOrModifyLrTransferOut = (saveAndNew) => (dispatch, getState) => {
    const editCalculateState = getState().editCalculateState
    const editRunningState = getState().editRunningState
    const allState = getState().allState

    const hideCategoryList = allState.get('hideCategoryList')
    const categoryChildList = hideCategoryList.find(v => v.get('categoryType') === 'LB_ZZSHS') ? hideCategoryList.find(v => v.get('categoryType') === 'LB_ZZSHS').get('childList') : []
    const categoryUuid = categoryChildList.find(v => v.get('categoryType') === 'LB_ZCWJZZS') ? categoryChildList.find(v => v.get('categoryType') === 'LB_ZCWJZZS').get('uuid') : ''

    let TransferOutTemp = editCalculateState.get('TransferOutTemp')
    // 附件
    const enclosureList = getState().editRunningAllState.get('enclosureList')

    TransferOutTemp = TransferOutTemp.set('enclosureList', enclosureList)
    const transferOutObj = TransferOutTemp.get('transferOutObj')
    const jrJvVatDtoList = transferOutObj.get('jrJvVatDtoList')
    const inputAmount = transferOutObj.get('inputAmount')
    const outputAmount = transferOutObj.get('outputAmount')
    const insertOrModify = getState().editRunningAllState.getIn(['views', 'insertOrModify'])
    const uuidList = jrJvVatDtoList.map(v => v.get('uuid'))
    const oriDate = editRunningState.getIn(['oriTemp', 'oriDate'])
    const oriState = TransferOutTemp.get('oriState')
    const oriAbstract = TransferOutTemp.get('oriAbstract')
    const handleMonth = TransferOutTemp.get('handleMonth')
    const oriUuid = TransferOutTemp.get('oriUuid')
    const jrUuid = TransferOutTemp.get('jrUuid')
    const jrIndex = TransferOutTemp.get('jrIndex')
    TransferOutTemp = TransferOutTemp.set('categoryUuid', categoryUuid).set('uuidList', uuidList)
    const encodeType = editCalculateState.getIn(['views','encodeType'])
    if (insertOrModify === 'modify' && !jrIndex) {
        return message.info('流水号必填')
    }
    if (!oriDate) {
        return message.info('日期必填')
    } else {
        const isLegal = runningDateCheck(oriDate, jrJvVatDtoList)
        if (!isLegal) {
            return message.info('日期不能在流水的日期前')
        }
    }

    if (!categoryUuid) {
        return message.info('流水类别未获取')
    }

    if (!oriAbstract) {
        return message.info('摘要必填')
    } else if (oriAbstract.length > 64) {
        return message.info('摘要长度不能超过64个字符')
    }

    if (!uuidList.size) {
        return message.info('没有要转出的流水')
    }

    if (inputAmount >= outputAmount) {
        return message.info('进项税额大于销项税额，无需转出未交增值税')
    }

    dispatch({
        type: ActionTypes.SWITCH_LOADING_MASK
    })
    let data = {
        jrIndex,
        oriDate: oriDate.slice(0, 10),
        categoryUuid,
        oriState,
        oriAbstract,
        handleMonth,
        enclosureList
    }
    data = insertOrModify === 'modify' ? encodeType ? { ...data, jrUuid, oriUuid, encodeType } : { ...data, jrUuid, oriUuid } : data

    fetchApi(`${insertOrModify}TransferVat`, 'POST', JSON.stringify(data), json => {
        if (json.code !== 0) {
            message.info(json.code + ' ' + json.message)
            dispatch(initEncodeType())
        } else {
            if(json.data.encodeType !== null && json.data.encodeType !== undefined){
                dispatch(changeCanModifyJrIndex(json.data.encodeType,jrIndex,saveAndNew))
            }else{
                dispatch(initEncodeType())
                message.success('成功')
                if (saveAndNew) { //保存并新增
                    dispatch(initEditCalculateTemp('saveAndNew', '', '', 'TransferOutTemp'))
                } else { //保存
                    dispatch(initEditCalculateTemp('afterSave', TransferOutTemp, json.data, 'TransferOutTemp'))
                    dispatch(modifyRefreshCalculate('LB_ZCWJZZS', saveAndNew))
                }
            }
        }
        dispatch({
            type: ActionTypes.SWITCH_LOADING_MASK
        })
    })

}
// 保存或修改 处置损益
export const insertOrModifyLrDisposal = (saveAndNew) => (dispatch, getState) => {
    const editCalculateState = getState().editCalculateState
    const editRunningState = getState().editRunningState
    const insertOrModify = getState().editRunningAllState.getIn(['views', 'insertOrModify'])
    const CqzcTemp = editCalculateState.get('CqzcTemp')
    const usedProject = CqzcTemp.get('usedProject')
    const beProject = CqzcTemp.get('beProject')
    const categoryUuid = CqzcTemp.get('categoryUuid')
    const projectCard = CqzcTemp.get('projectCard')
    const cleaningAmount = CqzcTemp.get('amount')
    const amount = CqzcTemp.get('netProfitAmount') >= 0 ? CqzcTemp.get('netProfitAmount') : CqzcTemp.get('lossAmount')
    const oriDate = editRunningState.getIn(['oriTemp', 'oriDate'])
    const oriState = CqzcTemp.get('oriState')
    const oriAbstract = CqzcTemp.get('oriAbstract')
    const pendingStrongList = CqzcTemp.get('businessList')
    const acAssets = CqzcTemp.get('assets')
    const oriUuid = CqzcTemp.get('oriUuid')
    const jrUuid = CqzcTemp.get('jrUuid')
    const jrIndex = CqzcTemp.get('jrIndex')
    const encodeType = editCalculateState.getIn(['views','encodeType'])
    const assets = {
        ...acAssets.toJS(),
        cleaningAmount
    }

    let projectCardList = []
    projectCard.getIn([0, 'cardUuid']) && usedProject && projectCardList.push({
        cardUuid: projectCard.getIn([0, 'cardUuid']),
        amount: amount,
        name: projectCard.getIn([0, 'name'])
    })
    if (insertOrModify === 'modify' && !jrIndex) {
        return message.info('流水号必填')
    }
    if (!oriAbstract) {
        return message.info('摘要必填')
    } else if (oriAbstract.length > 64) {
        return message.info('摘要长度不能超过64个字符')
    }
    if(pendingStrongList.size > Limit.RUNNING_CHECKED_MAX_NUMBER){
        return message.info(`底部列表勾选的核销流水不能超过${Limit.RUNNING_CHECKED_MAX_NUMBER}条`)
    }

    // 附件
    const enclosureList = getState().editRunningAllState.get('enclosureList')

    dispatch({
        type: ActionTypes.SWITCH_LOADING_MASK
    })
    let data = {
        jrIndex,
        oriDate: oriDate.slice(0, 10),
        categoryUuid,
        oriState,
        amount,
        oriAbstract,
        pendingStrongList,
        assets,
        usedProject: beProject ? usedProject : false,
        projectCardList,
        enclosureList
    }
    data = insertOrModify === 'modify' ? encodeType ? {...data, jrUuid, oriUuid,encodeType } : { ...data, jrUuid, oriUuid } : data
    fetchApi(`${insertOrModify}Carryover`, 'POST', JSON.stringify(data), json => {
        dispatch({
            type: ActionTypes.SWITCH_LOADING_MASK
        })
        if (json.code !== 0) {
            message.info(json.code + ' ' + json.message)
            dispatch(initEncodeType())
        } else {
            if(json.data.encodeType !== null && json.data.encodeType !== undefined){
                dispatch(changeCanModifyJrIndex(json.data.encodeType,jrIndex,saveAndNew))
            }else{
                dispatch(initEncodeType())
                const { jrIndexList } = json.data
                if (insertOrModify === 'insert') {
                    message.success(`已生成如下流水：记 ${json.data.jrIndex} 号${(jrIndexList || []).reduce((to,cur) => to+=`、记 ${cur} 号`,'')}`)
                } else {
                    message.success(json.message)
                }
                if (saveAndNew) { //保存并新增
                    dispatch(initEditCalculateTemp('saveAndNew', '', '', 'CqzcTemp'))
                    dispatch(getAssetsList('LB_JZSY', 'CqzcTemp'))
                    dispatch(getJzsyProjectCardList(CqzcTemp.get('projectRange')))

                } else { //保存
                    dispatch(initEditCalculateTemp('afterSave', CqzcTemp, json.data, 'CqzcTemp'))
                    dispatch(modifyRefreshCalculate('LB_JZSY', saveAndNew))
                    dispatch(getAssetsList('LB_JZSY', 'CqzcTemp'))
                }
            }
        }
    })
}
// 保存或修改 收付管理
export const insertOrModifyLrPayManage = (saveAndNew) => (dispatch, getState) => {
    const editCalculateState = getState().editCalculateState
    const editRunningState = getState().editRunningState
    const allState = getState().allState

    const hideCategoryList = allState.get('hideCategoryList')
    const categoryUuid = hideCategoryList.find(v => v.get('categoryType') === 'LB_SFGL').get('uuid')
    const SfglTemp = editCalculateState.get('SfglTemp')
    const views = editCalculateState.get('views')
    const oriAbstract = SfglTemp.get('oriAbstract')
    const oriState = SfglTemp.get('oriState')
    const accountUuid = SfglTemp.get('accountUuid')
    const needUsedPoundage = SfglTemp.get('needUsedPoundage')
    const poundageCurrentCardList = SfglTemp.get('poundageCurrentCardList').toJS()
    const poundageProjectCardList = SfglTemp.get('poundageProjectCardList').toJS()
    const poundageAmount = SfglTemp.get('poundageAmount')
    const moedAmount = SfglTemp.get('moedAmount')
    const beginDate = SfglTemp.get('beginDate')
    const endDate = SfglTemp.get('endDate')
    const accounts = SfglTemp.get('accounts')
    const selectItem = views.get('selectItem')
    const usedAccounts = SfglTemp.get('usedAccounts')

    const insertOrModify = getState().editRunningAllState.getIn(['views', 'insertOrModify'])

    const uuidList = selectItem.map(v => {
        if (v.get('beOpened')) {
            return {
                uuid: v.get('uuid'),
                categoryUuid: v.get('categoryUuid'),
                beOpened: true,
                handleAmount: insertOrModify === 'insert' ? v.get('handleAmount') : oriState === 'STATE_SFGL_ML' ? '' : v.get('handleAmount'),
                moedAmount: insertOrModify === 'insert' ? v.get('moedAmount') : oriState === 'STATE_SFGL_ML' ? v.get('moedAmount') : '',
            }
        } else {
            return {
                uuid: v.get('uuid'),
                beOpened: false,
                handleAmount: insertOrModify === 'insert' ? v.get('handleAmount') : oriState === 'STATE_SFGL_ML' ? '' : v.get('handleAmount'),
                moedAmount: insertOrModify === 'insert' ? v.get('moedAmount') : oriState === 'STATE_SFGL_ML' ? v.get('moedAmount') : '',
            }
        }
    })
    const oriUuid = SfglTemp.get('oriUuid')
    const jrUuid = SfglTemp.get('jrUuid')
    const cardUuid = SfglTemp.get('cardUuid')
    const isAccounts = selectItem.size === 1 && usedAccounts
    const curTotalAccountAmount = accounts.reduce((pre,cur) => pre += Number(cur.get('amount') || 0),0)
    const unAutomatic = SfglTemp.get('unAutomatic')
    const amount = isAccounts ? curTotalAccountAmount :
                    (
                        insertOrModify === 'insert' ?
                        SfglTemp.get('handlingAmount') :
                        (oriState === 'STATE_SFGL_ML' ? moedAmount : SfglTemp.get('handlingAmount') )
                    )
    const oriDate = editRunningState.getIn(['oriTemp', 'oriDate'])
    const typeCategoryUuid = SfglTemp.get('categoryUuid')
    const jrIndex = SfglTemp.get('jrIndex')
    const encodeType = editCalculateState.getIn(['views','encodeType'])

    // 附件
    const enclosureList = getState().editRunningAllState.get('enclosureList')
    if (insertOrModify === 'modify' && !jrIndex) {
        return message.info('流水号必填')
    }
    if (!oriAbstract) {
        return message.info('摘要必填')
    } else if (oriAbstract.length > 64) {
        return message.info('摘要长度不能超过64个字符')
    }
    if(selectItem.size === 1 && usedAccounts && accounts.filter(v => v.get('accountUuid')).size < 2){
        return message.info('多账户至少填写2个账户')
    }
    if(uuidList.length > Limit.RUNNING_CHECKED_MAX_NUMBER){
        return message.info(`底部列表勾选的核销流水不能超过${Limit.RUNNING_CHECKED_MAX_NUMBER}条`)
    }
    dispatch({
        type: ActionTypes.SWITCH_LOADING_MASK
    })
    let data = {
        jrIndex,
        oriDate: oriDate.slice(0, 10),
        categoryUuid,
        amount: Math.abs(amount),
        moedAmount: Math.abs(moedAmount),
        oriAbstract,
        needUsedPoundage,
        poundageCurrentCardList,
        poundageProjectCardList,
        pendingManageDto: {
            isManualWriteOff: unAutomatic,
            categoryUuid: typeCategoryUuid,
            beginDate,
            endDate,
            pendingManageList: uuidList
        },
        accounts: selectItem.size === 1 && usedAccounts ? accounts : (accountUuid || poundageAmount ? [{
            accountUuid,
            poundageAmount
        }] : []),
        currentCardList: [{
            cardUuid
        }],
        enclosureList,
    }
    data = insertOrModify === 'modify' ? encodeType ? { ...data, jrUuid, oriUuid, oriState, encodeType } : { ...data, jrUuid, oriUuid, oriState } : data

    fetchApi(`${insertOrModify}PaymentManage`, 'POST', JSON.stringify(data), json => {
        dispatch({
            type: ActionTypes.SWITCH_LOADING_MASK
        })
        if (json.code !== 0) {
            message.info(json.code + ' ' + json.message)
            dispatch(initEncodeType())
        } else {
            if(json.data.encodeType !== null && json.data.encodeType !== undefined){
                dispatch(changeCanModifyJrIndex(json.data.encodeType,jrIndex,saveAndNew))
            }else{
                dispatch(initEncodeType())
                const { jrIndexList } = json.data
                if (insertOrModify === 'insert') {
                    message.success(`已生成如下流水：记 ${json.data.jrIndex} 号${(jrIndexList || []).reduce((to,cur) => to+=`、记 ${cur} 号`,'')}`)
                } else {
                    message.success(json.message)
                }
                if (saveAndNew) { //保存并新增
                    dispatch(initEditCalculateTemp('saveAndNew', '', '', 'SfglTemp'))
                    dispatch(getContactsCardList(oriDate))
                    dispatch(getPayManageList({
                        oriDate,
                        categoryUuidList: fromJS([]),
                        cardUuidList:fromJS([]),
                        oriUuid:'',
                        currentCardPage: 1
                    }))
                } else { //保存
                    dispatch(initEditCalculateTemp('afterSave', SfglTemp, json.data, 'SfglTemp'))
                    dispatch(modifyRefreshCalculate('LB_SFGL', saveAndNew))
                }
            }

        }
    })
}
// 保存或修改 项目分摊
export const insertOrModifyProjectShare = (saveAndNew) => (dispatch, getState) => {
    const editCalculateState = getState().editCalculateState
    const editRunningState = getState().editRunningState
    let CommonChargeTemp = editCalculateState.get('CommonChargeTemp')
    const insertOrModify = getState().editRunningAllState.getIn(['views', 'insertOrModify'])
    const oriDate = editRunningState.getIn(['oriTemp', 'oriDate'])
    const oriAbstract = CommonChargeTemp.get('oriAbstract')
    const projectCardList = CommonChargeTemp.get('projectCardList')
    const paymentList = CommonChargeTemp.get('paymentList')
    const oriUuid = CommonChargeTemp.get('oriUuid')
    const jrIndex = CommonChargeTemp.get('jrIndex')
    const oriState = CommonChargeTemp.get('oriState')
    const tabName = CommonChargeTemp.get('tabName')
    const encodeType = editCalculateState.getIn(['views','encodeType'])
    const selectItem = editCalculateState.getIn(['views','selectItem'])
    let jrJvUuidList = [], balanceUuidList = []

    selectItem.map(item => {
        item.get('jrJvUuid') ? jrJvUuidList.push(item.get('jrJvUuid')) : balanceUuidList.push(item.get('balanceUuid'))
    })
    let projectCardRepeatList = [],newProjectCardList = [],noPropertyCost = ''
    projectCardList && projectCardList.map((item) => {
        if(item.get('cardUuid') === 'COMNCRD'){
            projectCardRepeatList.push(`${item.get('cardUuid')}+${item.get('propertyCost')}`)
        }
        if(item.get('cardUuid') === 'COMNCRD' & !item.get('propertyCost')){
            noPropertyCost = 'true'
        }
        if(!item.get('propertyCost')){
            const { propertyCost, ...newItem } = item.toJS()
            newProjectCardList.push(newItem)
        }else{
            newProjectCardList.push(item.toJS())
        }
    })
    const noRepeatList = Array.from(new Set(projectCardRepeatList))


    // 附件
    const enclosureList = getState().editRunningAllState.get('enclosureList')

    if (insertOrModify === 'modify' && !jrIndex) {
        return message.info('流水号必填')
    }
    if (!oriAbstract) {
        return message.info('摘要必填')
    } else if (oriAbstract.length > 64) {
        return message.info('摘要长度不能超过64个字符')
    }
    if(noPropertyCost === 'true'){
        return message.info('损益公共项目请选择费用性质')
    }
    if(projectCardRepeatList.length !== noRepeatList.length ){
        return message.info('损益公共项目不能选择相同的费用性质')
    }
    if(newProjectCardList.length + jrJvUuidList.length > Limit.STOCK_MAX_NUMBER_TWO){
        return message.info(`分摊项目和待处理流水的合计不可超过${Limit.STOCK_MAX_NUMBER_TWO}个`)
    }
    dispatch({
        type: ActionTypes.SWITCH_LOADING_MASK
    })
    let data = {
        jrIndex,
        oriState,
        oriDate: oriDate.slice(0, 10),
        oriAbstract,
        projectCardList: newProjectCardList,
        jrJvUuidList,
        balanceUuidList,
        enclosureList,
        shareType: tabName,
    }
    data = insertOrModify === 'modify' ?  encodeType ? {...data, oriUuid,encodeType } : { ...data, oriUuid } : data
    fetchApi(`${insertOrModify}JrProjectShare`, 'POST', JSON.stringify(data), json => {
        dispatch({
            type: ActionTypes.SWITCH_LOADING_MASK
        })
        if (json.code !== 0) {
            message.info(json.code + ' ' + json.message)
            dispatch(initEncodeType())
        } else {
            if(json.data.encodeType !== null && json.data.encodeType !== undefined){
                dispatch(changeCanModifyJrIndex(json.data.encodeType,jrIndex,saveAndNew))
            }else{
                if (saveAndNew) { //保存并新增
                    dispatch(initEditCalculateTemp('saveAndNew', '', '', 'CommonChargeTemp'))
                    dispatch(getProjectShareList())
                    dispatch(getJrProjectShareType())
                    dispatch(getChargeProjectCard(oriState))
                } else { //保存
                    dispatch(initEditCalculateTemp('afterSave', CommonChargeTemp, json.data, 'CommonChargeTemp'))
                    dispatch(modifyRefreshCalculate('LB_GGFYFT', saveAndNew))
                }
                if (insertOrModify === 'insert') {
                    const { jrIndexList } = json.data
                    message.success(`已生成如下流水：记 ${json.data.jrIndex} 号${(jrIndexList || []).reduce((to,cur) => to+=`、记 ${cur} 号`,'')}`)
                } else {
                    message.success(json.message)
                }
            }
        }
    })
}
//保存或修改 存货调拨
export const insertOrModifyInventoryTransfer = (saveAndNew) => (dispatch,getState) => {
    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])
    const oriDate = getState().editRunningState.getIn(['oriTemp','oriDate'])
    const editCalculateState = getState().editCalculateState
    const enclosureList = getState().editRunningAllState.get('enclosureList')
    let StockTemp = editCalculateState.get('StockTemp')
    const oriState = StockTemp.get('oriState')
    const oriAbstract = StockTemp.get('oriAbstract')
    const warehouseCardList = StockTemp.get('chooseWareHouseCardList')
    const stockCardList = StockTemp.get('stockCardList')
    const jrUuid = StockTemp.get('jrUuid')
    const oriUuid = StockTemp.get('oriUuid')
    const jrIndex = StockTemp.get('jrIndex')
    const insertOrModify = getState().editRunningAllState.getIn(['views', 'insertOrModify'])
    let amount = 0
    let newStockCardList = []
    stockCardList && stockCardList.size && stockCardList.toJS().map(item => {
        if(item.cardUuid){
            amount = numberCalculate(amount,item.amount)
            newStockCardList.push({
                ...item,
                // unitUuid: item.unit['uuid']
            })
        }

    })

    const allState = getState().allState
    const hideCategoryList = allState.get('hideCategoryList')
    const categoryChildList = hideCategoryList.find(v => v.get('categoryType') === 'LB_CHHS') ? hideCategoryList.find(v => v.get('categoryType') === 'LB_CHHS').get('childList') : []
    const categoryUuid = categoryChildList.find(v =>  v.get('categoryType') === 'LB_CHDB') ? categoryChildList.find(v => v.get('categoryType') === 'LB_CHDB').get('uuid') : StockTemp.get('categoryUuid')
    const encodeType = editCalculateState.getIn(['views','encodeType'])

    let data = {
        oriDate,
        categoryUuid,
        oriState,
        amount,
        oriAbstract,
        warehouseCardList,
        stockCardList:newStockCardList,
        enclosureList
    }
    data = insertOrModify === 'modify' ? encodeType ? {...data,jrUuid,oriUuid,jrIndex,encodeType } : {...data,jrUuid,oriUuid,jrIndex} : data
    if (!oriDate) {
      return message.info('日期必填')
    }
    if(insertOrModify === 'modify' && !jrIndex){
        return message.info('流水号必填')
    }
    if (!oriAbstract) {
      return message.info('摘要必填')
    } else if (oriAbstract.length > 64) {
        return message.info('摘要长度不能超过64个字符')
    }
    let priceCorrect = 'false',amountCorrect = 'false',stockName = [],uuidCorrect = 'false'
    stockCardList && stockCardList.size && stockCardList.forEach(v => {
        if(v.get('cardUuid')){
            if(!v.get('isOpenedQuantity') && !v.get('amount')){ //调拨无数量核算的存货时，金额必填、不可为负数、不可为0
                amountCorrect = 'amountTrue',
                stockName.push(`${v.get('code')} ${v.get('name')}`)
                return false
            }
            if(v.get('isOpenedQuantity') && !v.get('isUniformPrice')){
                if(!v.get('price')){
                    priceCorrect = 'priceTrue',
                    stockName.push(`${v.get('code')} ${v.get('name')}`)
                    return false
                }
                if(!v.get('amount') && !v.get('quantity')){
                    amountCorrect = 'amountQuantityTrue',
                    stockName.push(`${v.get('code')} ${v.get('name')}`)
                    return false
                }
            }
        }else{
            if(v.get('amount')){
                uuidCorrect = 'true'
            }
        }

    })
    if(priceCorrect === 'priceTrue'){
        return message.info(`请输入【${stockName}】的单价`)
    }
    if(amountCorrect === 'amountQuantityTrue'){
        return message.info(`【${stockName}】的数量金额不能同时为0`)
    }
    if(newStockCardList.length === 0 || uuidCorrect === 'true'){
        return message.info(`请选择存货`)
    }
    if(newStockCardList.length > Limit.STOCK_MAX_NUMBER_ONE){
        return message.info(`所选存货总数不可超过${Limit.STOCK_MAX_NUMBER_ONE}个`)
    }



    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi(`${insertOrModify}InventoryTransfer`,'POST', JSON.stringify(data),json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (json.code !== 0) {
            message.info(json.code + ' ' + json.message)
            dispatch(initEncodeType())
        } else {
            if(json.data.encodeType !== null && json.data.encodeType !== undefined){
                dispatch(changeCanModifyJrIndex(json.data.encodeType,jrIndex,saveAndNew))
            }else{
                dispatch(initEncodeType())
                if (insertOrModify === 'insert') {
                    const { jrIndexList } = json.data
                    message.success(`已生成如下流水：记 ${json.data.jrIndex} 号${(jrIndexList || []).reduce((to,cur) => to+=`、记 ${cur} 号`,'')}`)
                } else {
                    message.success(json.message)
                }
                if (saveAndNew) { //保存并新增
                    dispatch(initEditCalculateTemp('saveAndNew', StockTemp, '', 'StockTemp',true))
                    dispatch(getCanUseWarehouseCardList({temp:'StockTemp'}))
                } else { //保存
                    dispatch(initEditCalculateTemp('afterSave', StockTemp, json.data,'StockTemp'))
                    dispatch(modifyRefreshCalculate('LB_CHDB',saveAndNew))
                }
            }
        }
    })

}
//保存或修改 存货余额调整
export const insertOrModifyBalanceAdjustment = (saveAndNew) => (dispatch, getState) => {
    const oriDate = getState().editRunningState.getIn(['oriTemp', 'oriDate'])
    const editCalculateState = getState().editCalculateState
    const enclosureList = getState().editRunningAllState.get('enclosureList')
    let BalanceTemp = editCalculateState.get('BalanceTemp')
    const oriState = BalanceTemp.get('oriState')
    const oriAbstract = BalanceTemp.get('oriAbstract')
    const chooseWareHouseCard = BalanceTemp.get('chooseWareHouseCard')
    const chooseStockCard = BalanceTemp.get('chooseStockCard')
    const stockCardList = BalanceTemp.get('stockCardList')
    const wareHouseList = BalanceTemp.get('wareHouseList')
    const canUseWarehouse = getState().homeState.getIn(['data', 'userInfo','sobInfo','moduleInfo']).indexOf('WAREHOUSE') > -1
    const jrUuid = BalanceTemp.get('jrUuid')
    const oriUuid = BalanceTemp.get('oriUuid')
    const jrIndex = BalanceTemp.get('jrIndex')
    const insertOrModify = getState().editRunningAllState.getIn(['views', 'insertOrModify'])
    let amount = 0
    let newStockCardList = [],needCheckStock = 'false'
    stockCardList && stockCardList.size && stockCardList.toJS().map(item => {
        if(item.cardUuid){
            amount = numberCalculate(amount, item.amount)
            newStockCardList.push({
                ...item,
                // unitUuid: item.allUnit['uuid']
            })
        }else{
            if(item.amount){
                needCheckStock = 'true'
            }
        }


    })

    const allState = getState().allState
    const hideCategoryList = allState.get('hideCategoryList')
    const categoryChildList = hideCategoryList.find(v => v.get('categoryType') === 'LB_CHHS') ? hideCategoryList.find(v => v.get('categoryType') === 'LB_CHHS').get('childList') : []
    const categoryUuid = categoryChildList.find(v =>  v.get('categoryType') === 'LB_CHYE') ? categoryChildList.find(v => v.get('categoryType') === 'LB_CHYE').get('uuid') : BalanceTemp.get('categoryUuid')

    const encodeType = editCalculateState.getIn(['views','encodeType'])

    let data = {
        oriDate,
        categoryUuid,
        jrState: canUseWarehouse ? oriState : null,
        amount,
        oriAbstract,
        stockCardList: newStockCardList,
        enclosureList
    }
    data = insertOrModify === 'modify' ? encodeType ? {...data, jrUuid, oriUuid, jrIndex, encodeType } : { ...data, jrUuid, oriUuid, jrIndex } : data

    if (!oriDate) {
        return message.info('日期必填')
    }
    if (insertOrModify === 'modify' && !jrIndex) {
        return message.info('流水号必填')
    }
    if (!oriAbstract) {
        return message.info('摘要必填')
    } else if (oriAbstract.length > 64) {
        return message.info('摘要长度不能超过64个字符')
    }
    if (newStockCardList.some(v => v.amount === '-' || v.quantity === '-')) {
        return message.info(`请输入有效的数值`)
    }
    if(newStockCardList.length > Limit.STOCK_MAX_NUMBER_TWO){
        return message.info(`所选存货总数不可超过${Limit.STOCK_MAX_NUMBER_TWO}个`)
    }
    if (!canUseWarehouse) {
        if (newStockCardList.length === 0 || needCheckStock === 'true') {
            return message.info(`请选择存货`)
        }
    } else {

        if (oriState === 'STATE_CHYE_CK') {
            let quantityOrAmountCorrect = 'false',
                stockName = [],
                positiveCorrect = 'false',
                quantityCorrect = 'false',
                uuidCorrect = 'false'
            stockCardList && stockCardList.size && stockCardList.forEach((v, i) => {
                if(v.get('cardUuid')){
                    if(v.get('price') < 0 ){ // 单价不能为负数（数量和金额不可一正一负）
                        positiveCorrect = 'positiveTrue'
                        stockName.push(`${v.get('code')} ${v.get('name')}`)
                        return false
                    }
                    if(v.get('isOpenedQuantity') && !v.get('isUniformPrice') && (!v.get('quantity') && !v.get('amount'))){ // 不同单价  数量金额不能同时为0
                        quantityOrAmountCorrect = 'quantityOrAmountTrue'
                        stockName.push(`${v.get('code')} ${v.get('name')}`)
                        return false
                    }
                }else{
                    if(v.get('amount')){
                        uuidCorrect = 'true'
                        return false
                    }
                }
            })
            if(positiveCorrect === 'positiveTrue'){
                return message.info(`【${stockName}】的单价不能为负数`)
            }
            if(quantityOrAmountCorrect === 'quantityOrAmountTrue'){
                return message.info(`【${stockName}】的数量和金额不能同时为0`)
            }
            if (newStockCardList.length === 0 || uuidCorrect === 'true') {
                return message.info(`请选择存货`)
            }

        } else if (oriState === 'STATE_CHYE_CH') {
            let quantityCorrect = 'false',
                wareHouseName = [],
                uuidCorrect = 'false',
                positiveCorrect = 'false',
                quantityOrAmountCorrect = 'false'
            // if (!chooseStockCard.get('cardUuid')) {
            //     return message.info(`请选择存货`)
            // }
            stockCardList && stockCardList.size && stockCardList.forEach((v, i) => {
                if (v.get('cardUuid')) {
                    if(chooseStockCard.get('isOpenedQuantity') && chooseStockCard.get('isUniformPrice') && (!Number(v.get('quantity')) && !Number(v.get('amount')))){
                        quantityOrAmountCorrect = 'quantityOrAmountTrue'
                        wareHouseName.push(`${v.get('name')}`)
                        return false
                    }
                }else{
                    if(v.get('amount')){
                        uuidCorrect = 'uuidTrue'
                        return false
                    }
                }

            })
            if (uuidCorrect === 'uuidTrue') {
                return message.info(`存货不可为空`)
            }
            if(quantityOrAmountCorrect === 'quantityOrAmountTrue'){
                return message.info(`【${wareHouseName}】的数量和金额不能同时为0`)
            }

        }
    }

    dispatch({
        type: ActionTypes.SWITCH_LOADING_MASK
    })
    fetchApi(`${insertOrModify}BalanceAdjustment`, 'POST', JSON.stringify(data), json => {
        dispatch({
            type: ActionTypes.SWITCH_LOADING_MASK
        })
        if (json.code !== 0) {
            message.info(json.code + ' ' + json.message)
            dispatch(initEncodeType())
        } else {
            if(json.data.encodeType !== null && json.data.encodeType !== undefined){
                dispatch(changeCanModifyJrIndex(json.data.encodeType,jrIndex,saveAndNew))
            }else{
                dispatch(initEncodeType())
                if (insertOrModify === 'insert') {
                    const { jrIndexList } = json.data
                    message.success(`已生成如下流水：记 ${json.data.jrIndex} 号${(jrIndexList || []).reduce((to,cur) => to+=`、记 ${cur} 号`,'')}`)
                } else {
                    message.success(json.message)
                }
                if (saveAndNew) { //保存并新增
                    dispatch(initEditCalculateTemp('saveAndNew', BalanceTemp, '', 'BalanceTemp',true))
                    dispatch(getStockCardList('BalanceTemp'))
                    dispatch(getCanUseWarehouseCardList({temp:'BalanceTemp'}))
                } else { //保存
                    dispatch(initEditCalculateTemp('afterSave', BalanceTemp, json.data, 'BalanceTemp'))
                    dispatch(modifyRefreshCalculate('LB_CHYE', saveAndNew))
                }
            }

        }
    })

}

//保存或修改 进项税额转出
export const insertOrModifyTaxTransfer = (saveAndNew) => (dispatch, getState) => {
    const oriDate = getState().editRunningState.getIn(['oriTemp', 'oriDate'])
    const editCalculateState = getState().editCalculateState
    const enclosureList = getState().editRunningAllState.get('enclosureList')
    let TaxTransferTemp = editCalculateState.get('TaxTransferTemp')
    const categoryMessage = editCalculateState.getIn(['views','categoryMessage'])
    const categoryType = categoryMessage.get('categoryType')
    const propertyCostList = categoryMessage.get('propertyCostList')
    const beProject = categoryMessage.get('beProject')
    const oriState = TaxTransferTemp.get('oriState')
    const oriAbstract = TaxTransferTemp.get('oriAbstract')
    const chooseWareHouseCard = TaxTransferTemp.get('chooseWareHouseCard')
    const chooseStockCard = TaxTransferTemp.get('chooseStockCard')
    const stockCardList = TaxTransferTemp.get('stockCardList')
    const wareHouseList = TaxTransferTemp.get('wareHouseList')
    const canUseWarehouse = getState().homeState.getIn(['data', 'userInfo','sobInfo','moduleInfo']).indexOf('WAREHOUSE') > -1
    const jrUuid = TaxTransferTemp.get('jrUuid')
    const oriUuid = TaxTransferTemp.get('oriUuid')
    const jrIndex = TaxTransferTemp.get('jrIndex')
    const dealTypeUuid = TaxTransferTemp.get('dealTypeUuid')
    const usedProject = TaxTransferTemp.get('usedProject')
    const projectCard = TaxTransferTemp.get('projectCard')
    const allAmount = TaxTransferTemp.get('amount')
    let propertyCost = TaxTransferTemp.get('propertyCost')
    if(categoryType === 'LB_FYZC' && propertyCostList.size === 1){
        propertyCost = propertyCostList.get(0)
    }


    const propertyCarryover = TaxTransferTemp.get('propertyCarryover')
    let stockAmount = 0
    const insertOrModify = getState().editRunningAllState.getIn(['views', 'insertOrModify'])
    let newStockCardList = []
    stockCardList && stockCardList.size && stockCardList.getIn([0,'cardUuid']) && stockCardList.toJS().map(item => {
        stockAmount = numberCalculate(stockAmount,item.amount)
    })
    const amount = stockCardList.getIn([0,'cardUuid']) ? stockAmount : allAmount


    const allState = getState().allState
    const hideCategoryList = allState.get('hideCategoryList')
    const categoryChildList = hideCategoryList.find(v => v.get('categoryType') === 'LB_ZZSHS') ? hideCategoryList.find(v => v.get('categoryType') === 'LB_ZZSHS').get('childList') : []
    const categoryUuid =  categoryChildList.find(v => v.get('categoryType') === 'LB_JXSEZC').get('uuid')

    let data = {
        oriDate,
        categoryUuid,
        relationCategoryUuid: dealTypeUuid,
        oriState,
        amount,
        oriAbstract,
        usedProject: propertyCarryover !== 'SX_HW' && categoryType !== 'LB_CQZC' ? (insertOrModify === 'insert' ? (beProject ? usedProject : false) : usedProject) : false,
        propertyCost,
        usedStock: stockCardList.getIn([0,'cardUuid']) ? true : false,
        stockCardList: stockCardList.toJS(),
        projectCardList:usedProject ? [{cardUuid:projectCard.get('cardUuid')}] : [],
        enclosureList
    }
    data = insertOrModify === 'modify' ? {
        ...data,
        jrUuid,
        oriUuid,
        jrIndex
    } : data

    if (!oriDate) {
        return message.info('日期必填')
    }
    if (insertOrModify === 'modify' && !jrIndex) {
        return message.info('流水号必填')
    }
    if (!oriAbstract) {
        return message.info('摘要必填')
    } else if (oriAbstract.length > 64) {
        return message.info('摘要长度不能超过64个字符')
    }
    if(!dealTypeUuid){
        return message.info('处理类别必填')
    }
    if(categoryType === 'LB_FYZC' && !propertyCost){
        return message.info('费用性质必填')
    }
    if(propertyCarryover !== 'SX_HW' && categoryType !== 'LB_CQZC' &&( usedProject && !projectCard.get('cardUuid') && ( beProject && insertOrModify === 'insert' || insertOrModify === 'modify'))){
        return message.info('请选择项目卡片')
    }
    if (allAmount === '-') {
        return message.info(`请输入有效的数值`)
    }
    if(propertyCarryover === 'SX_HW'){
        let uuidCorrect = 'false', amountCorrect = 'false', stockName = []
        stockCardList && stockCardList.forEach(v => {
            if (!v.get('cardUuid')) {
                uuidCorrect = 'uuidTrue'
                return false
            }
            if(!v.get('amount')){
                amountCorrect = 'amountTrue'
                stockName.push(`${v.get('code')} ${v.get('name')}`)
                return false
            }
        })
        if (uuidCorrect === 'uuidTrue') {
            return message.info(`存货不可为空`)
        }
        if (amountCorrect === 'amountTrue') {
            return message.info(`${stockName}的税额不可为空`)
        }

    }
    if(!amount){
        return message.info('税额必填')
    }

    dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
    fetchApi(`${insertOrModify}TaxTransferOut`, 'POST', JSON.stringify(data), json => {
        dispatch({
            type: ActionTypes.SWITCH_LOADING_MASK
        })
        if (json.code !== 0) {
            message.info(json.code + ' ' + json.message)
        } else {
            if (insertOrModify === 'insert') {
                const { jrIndexList } = json.data
                message.success(`已生成如下流水：记 ${json.data.jrIndex} 号${(jrIndexList || []).reduce((to,cur) => to+=`、记 ${cur} 号`,'')}`)
            } else {
                message.success(json.message)
            }
            if (saveAndNew) { //保存并新增
                dispatch(initEditCalculateTemp('saveAndNew', '', '', 'TaxTransferTemp'))

            } else { //保存
                dispatch(initEditCalculateTemp('afterSave', TaxTransferTemp, json.data, 'TaxTransferTemp'))
                dispatch(modifyRefreshCalculate('LB_JXSEZC', saveAndNew))
            }
        }
    })
}

//保存或修改 存货组装拆卸
export const insertOrModifyStockBuildUp = (saveAndNew) => (dispatch, getState) => {
    const oriDate = getState().editRunningState.getIn(['oriTemp', 'oriDate'])
    const editCalculateState = getState().editCalculateState
    const enclosureList = getState().editRunningAllState.get('enclosureList')
    let StockBuildUpTemp = editCalculateState.get('StockBuildUpTemp')
    const oriState = StockBuildUpTemp.get('oriState')
    const oriAbstract = StockBuildUpTemp.get('oriAbstract')
    const stockCardList = StockBuildUpTemp.get('stockCardList')
    const stockCardOtherList = StockBuildUpTemp.get('stockCardOtherList')
    const assemblySheet = StockBuildUpTemp.get('assemblySheet')
    // const canUseWarehouse = getState().homeState.getIn(['data', 'userInfo','sobInfo','moduleInfo']).indexOf('WAREHOUSE') > -1
    const jrUuid = StockBuildUpTemp.get('jrUuid')
    const oriUuid = StockBuildUpTemp.get('oriUuid')
    const jrIndex = StockBuildUpTemp.get('jrIndex')
    const insertOrModify = getState().editRunningAllState.getIn(['views', 'insertOrModify'])
    let amount = 0, otherAmount = 0
    let newStockCardList = [],newStockCardOtherList = [],stockCardUuidList = [],stockCardOtherUuidList = []
    let noAmount = '', stockNameList = [],needCheckStock=''
    oriState === 'STATE_CHZZ_ZZCX' && stockCardList && stockCardList.size  && stockCardList.toJS().map(item => {
        if(item.cardUuid){
            amount = numberCalculate(amount, item.amount)
            newStockCardList.push({
                ...item,
            })
            if(!item.amount){
                noAmount = 'true'
                stockNameList.push(`${item.code}${item.name}`)
            }
            stockCardUuidList.push(item.cardUuid)
        }else{
            if(item.amount){
                needCheckStock = 'stock'
            }
        }


    })
    oriState === 'STATE_CHZZ_ZZCX' && stockCardOtherList && stockCardOtherList.size && stockCardOtherList.toJS().map(item => {
        if(item.cardUuid){
            otherAmount = numberCalculate(otherAmount, item.amount)
            if(!item.amount){
                noAmount = 'true'
                stockNameList.push(`${item.code}${item.name}`)
            }
            newStockCardOtherList.push({
                ...item,
            })
            stockCardOtherUuidList.push(item.cardUuid)
        }else{
            if(item.amount){
                needCheckStock = 'other'
            }
        }

    })
    let stockRepeat = ''
    stockCardUuidList.map(v => {
        if(stockCardOtherUuidList.indexOf(v) > -1){
            stockRepeat = 'true'
            return false
        }
    })

    const allState = getState().allState
    const hideCategoryList = allState.get('hideCategoryList')

    const categoryChildList = hideCategoryList.find(v => v.get('categoryType') === 'LB_CHHS') ? hideCategoryList.find(v => v.get('categoryType') === 'LB_CHHS').get('childList') : []
    const categoryUuid =   categoryChildList.find(v => v.get('categoryType') === 'LB_CHZZ') ? categoryChildList.find(v => v.get('categoryType') === 'LB_CHZZ').get('uuid') : StockBuildUpTemp.get('categoryUuid')
    let noMaterialList = '', noMaterialName=[]
    const encodeType = editCalculateState.getIn(['views','encodeType'])

    let materialListArr = []
    let materialUuidList = []

    const zzdStockCardList = oriState === 'STATE_CHZZ_ZZD' && assemblySheet && assemblySheet.toJS().map(item => {
        amount = numberCalculate(amount, item.amount)

        let materialList = []
        item.materialList && item.materialList.map(v => {
            //物料汇总数量统计
            const materialUuid = v.materialUuid //物料存货uuid
            const warehouseCardUuid = v.warehouseCardUuid //仓库uuid
            const unitUuid = v.unitUuid //单位uuid

            const assistList = v.assistList ? v.assistList.map(k => k.propertyUuid).sort() : []
            const assistListUuid = assistList.join('_')

            const batchUuid = v.batchUuid
            if (!materialUuidList.includes(materialUuid)) {
                materialListArr.push([v])
                materialUuidList.push(materialUuid)
            } else {
                const cardIndex = materialUuidList.findIndex(value => value == materialUuid)
                let hasCard = false
                materialListArr[cardIndex].forEach(item => {
                    const isOpenBatch = item.financialInfo && item.financialInfo.openBatch
                    const isOpenAssist = item.financialInfo && item.financialInfo.openAssist

                    const itemAssistList = item.assistList ? item.assistList.map(m => m.propertyUuid).sort() : []
                    const assistUuid = itemAssistList.join('_')
                    if (item.warehouseCardUuid === warehouseCardUuid && item.unitUuid === unitUuid && (isOpenBatch ? item.batchUuid === batchUuid : true) && (isOpenAssist ? assistUuid === assistListUuid : true)) {
                        hasCard = true
                    }
                })
                if (!hasCard) {
                    materialListArr[cardIndex].push(v)
                }
            }
            //物料汇总数量统计结束
            if(v.materialUuid){
                materialList.push(v)
            }else{
                if(v.amount){
                    noMaterialList = 'true'
                    noMaterialName.push(`${item.code}${item.name}`)
                }
            }
            if(v.materialUuid === item.uuid){
                stockRepeat = 'true'
            }
            if(!Number(v.amount)){
                noAmount = 'true'
                stockNameList.push(`${v.code}${v.name}`)
            }
            v.cardUuid = v.materialUuid
            v.isOpenedQuantity = v.isOpenQuantity

        })
        if(materialList.length === 0){
            noMaterialList = 'true'
            noMaterialName.push(`${item.code}${item.name}`)
        }
        return {
            ...item,
            childCardList: item.materialList,
            cardUuid: item.uuid ? item.uuid : item.productUuid,
            quantity: item.curQuantity
        }
    }) || []
    const checkStockNameList = Array.from(new Set(stockNameList))

    let data = oriState === 'STATE_CHZZ_ZZCX' ? {
        oriDate,
        categoryUuid,
        oriState,
        amount,
        oriAbstract,
        stockCardList: newStockCardList,
        stockCardOtherList: newStockCardOtherList,
        enclosureList
    } :
    {
        oriDate,
        categoryUuid,
        oriState,
        amount,
        oriAbstract,
        stockCardList: zzdStockCardList,
        enclosureList
    }
    data = insertOrModify === 'modify' ? encodeType ? {...data, jrUuid, oriUuid, jrIndex, encodeType } : { ...data, jrUuid, oriUuid, jrIndex } : data

    if (!oriDate) {
        return message.info('日期必填')
    }
    if (insertOrModify === 'modify' && !jrIndex) {
        return message.info('流水号必填')
    }
    if (!oriAbstract) {
        return message.info('摘要必填')
    } else if (oriAbstract.length > 64) {
        return message.info('摘要长度不能超过64个字符')
    }
    if(oriState === 'STATE_CHZZ_ZZCX'){
        if(newStockCardList.length === 0 || needCheckStock === 'stock'){
            return message.info('请选择物料')
        }
        if(newStockCardOtherList.length === 0 || needCheckStock === 'other'){
            return message.info('请选择成品')
        }
        if(newStockCardList.length + newStockCardOtherList.length > Limit.STOCK_MAX_NUMBER_TWO ){
            return message.info(`成品和物料总数不可超过${Limit.STOCK_MAX_NUMBER_TWO}个`)
        }
    }else{
        if(zzdStockCardList.length === 0){
            return message.info('请选择组装单')
        }
        if(zzdStockCardList.length + materialListArr.length > Limit.STOCK_MAX_NUMBER_TWO){
            return message.info(`成品和物料汇总总数不可超过${Limit.STOCK_MAX_NUMBER_TWO}个`)
        }
        if(noMaterialList){
            return message.info(`请选择组装成品【${noMaterialName}】的物料`)
        }
    }
    if(noAmount === 'true'){
        return message.info(`请输入${checkStockNameList}的金额`)
    }
    if(oriState === 'STATE_CHZZ_ZZCX' && Number(amount) !== Number(otherAmount)){
        return message.info('物料和成品的合计金额必须相等')
    }
    if(stockRepeat === 'true'){
        return message.info('物料和成品不能选择同一存货')
    }


    dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
    fetchApi(`${insertOrModify}StockBuildUp`, 'POST', JSON.stringify(data), json => {
        dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
        if (json.code !== 0) {
            message.info(json.code + ' ' + json.message)
            dispatch(initEncodeType())
        } else {
            if(json.data.encodeType !== null && json.data.encodeType !== undefined){
                dispatch(changeCanModifyJrIndex(json.data.encodeType,jrIndex,saveAndNew))
            }else{
                dispatch(initEncodeType())
                if (insertOrModify === 'insert') {
                    const { jrIndexList } = json.data
                    message.success(`已生成如下流水：记 ${json.data.jrIndex} 号${(jrIndexList || []).reduce((to,cur) => to+=`、记 ${cur} 号`,'')}`)
                } else {
                    message.success(json.message)
                }
                if (saveAndNew) { //保存并新增
                    dispatch(initEditCalculateTemp('saveAndNew', StockBuildUpTemp, '', 'StockBuildUpTemp'))
                    dispatch(getStockCardList('StockBuildUpTemp'))
                    dispatch(getCanUseWarehouseCardList({temp:'StockBuildUpTemp'}))
                } else { //保存
                    dispatch(initEditCalculateTemp('afterSave', StockBuildUpTemp, json.data, 'StockBuildUpTemp'))
                    dispatch(modifyRefreshCalculate('LB_CHZZ', saveAndNew))
                }
            }

        }
    })

}
//保存或修改 存货投入项目
export const insertOrModifyStockIntoProject = (saveAndNew) => (dispatch, getState) => {
    const oriDate = getState().editRunningState.getIn(['oriTemp', 'oriDate'])
    const editCalculateState = getState().editCalculateState
    const enclosureList = getState().editRunningAllState.get('enclosureList')
    let StockIntoProjectTemp = editCalculateState.get('StockIntoProjectTemp')
    const oriAbstract = StockIntoProjectTemp.get('oriAbstract')
    const stockCardList = StockIntoProjectTemp.get('stockCardList')
    const projectCard = StockIntoProjectTemp.get('projectCard')
    // const canUseWarehouse = getState().homeState.getIn(['data', 'userInfo','sobInfo','moduleInfo']).indexOf('WAREHOUSE') > -1
    const jrUuid = StockIntoProjectTemp.get('jrUuid')
    const oriUuid = StockIntoProjectTemp.get('oriUuid')
    const jrIndex = StockIntoProjectTemp.get('jrIndex')
    const insertOrModify = getState().editRunningAllState.getIn(['views', 'insertOrModify'])
    let amount = 0, otherAmount = 0
    let newStockCardList = [],newStockCardOtherList = [],stockCardUuidList = [],stockCardOtherUuidList = [],needCheckStock=''

    let noAmount = '', stockNameList = []
    stockCardList && stockCardList.size && stockCardList.toJS().map(item => {
        if(item.cardUuid){
            amount = numberCalculate(amount, item.amount)
            newStockCardList.push({
                ...item,
                unit: item.unit ? item.unit : null
            })
            if(!Number(item.amount)){
                noAmount = 'true'
                stockNameList.push(`${item.code}${item.name}`)
            }
        }else{
            if(Number(item.amount)){
                needCheckStock = 'true'
            }
        }
    })

    const checkStockNameList = Array.from(new Set(stockNameList))

    const allState = getState().allState
    const hideCategoryList = allState.get('hideCategoryList')
    // const categoryUuid = hideCategoryList.find(v => v.get('categoryType') === 'LB_CHTRXM').get('uuid')
    const encodeType = editCalculateState.getIn(['views','encodeType'])

    let data = {
        oriDate,
        oriAbstract,
        stockCardList: newStockCardList,
        projectCardList:[projectCard],
        enclosureList
    }
    data = insertOrModify === 'modify' ? encodeType ? {...data, jrUuid, oriUuid, jrIndex, encodeType } : { ...data, jrUuid, oriUuid, jrIndex } : data

    if (!oriDate) {
        return message.info('日期必填')
    }
    if (insertOrModify === 'modify' && !jrIndex) {
        return message.info('流水号必填')
    }
    if (!oriAbstract) {
        return message.info('摘要必填')
    } else if (oriAbstract.length > 64) {
        return message.info('摘要长度不能超过64个字符')
    }
    if(!projectCard.get('cardUuid')){
        return message.info('请选择项目卡片')
    }
    if(newStockCardList.length === 0 || needCheckStock !== ''){
        return message.info('请选择存货')
    }
    if(newStockCardList.length > Limit.STOCK_MAX_NUMBER_TWO){
        return message.info(`所选存货总数不可超过${Limit.STOCK_MAX_NUMBER_TWO}个`)
    }
    if(noAmount === 'true'){
        return message.info(`请输入${checkStockNameList}的金额`)
    }



    dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
    fetchApi(`${insertOrModify}StockIntoProject`, 'POST', JSON.stringify(data), json => {
        dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
        if (json.code !== 0) {
            message.info(json.code + ' ' + json.message)
            dispatch(initEncodeType())
        } else {
            if(json.data.encodeType !== null && json.data.encodeType !== undefined){
                dispatch(changeCanModifyJrIndex(json.data.encodeType,jrIndex,saveAndNew))
            }else{
                dispatch(initEncodeType())
                if (insertOrModify === 'insert') {
                    const { jrIndexList } = json.data
                    message.success(`已生成如下流水：记 ${json.data.jrIndex} 号${(jrIndexList || []).reduce((to,cur) => to+=`、记 ${cur} 号`,'')}`)
                } else {
                    message.success(json.message)
                }
                if (saveAndNew) { //保存并新增
                    dispatch(initEditCalculateTemp('saveAndNew', '', '', 'StockIntoProjectTemp'))
                    dispatch(getChargeProjectCard('STATE_CHTRXM','StockIntoProjectTemp'))
                    dispatch(getCostCarryoverStockList(oriDate,'STATE_YYSR_ZJ','','StockIntoProjectTemp'))
                    dispatch(getCanUseWarehouseCardList({temp:'StockIntoProjectTemp'}))
                } else { //保存
                    dispatch(initEditCalculateTemp('afterSave', StockIntoProjectTemp, json.data, 'StockIntoProjectTemp'))
                    dispatch(modifyRefreshCalculate('LB_CHTRXM', saveAndNew))
                }
            }

        }
    })

}
//保存或修改 存货项目结转
export const insertOrModifyProjectCarryover = (saveAndNew) => (dispatch, getState) => {
    const oriDate = getState().editRunningState.getIn(['oriTemp', 'oriDate'])
    const editCalculateState = getState().editCalculateState
    const enclosureList = getState().editRunningAllState.get('enclosureList')
    let ProjectCarryoverTemp = editCalculateState.get('ProjectCarryoverTemp')
    const oriAbstract = ProjectCarryoverTemp.get('oriAbstract')
    const stockCardList = ProjectCarryoverTemp.get('stockCardList')
    const projectCard = ProjectCarryoverTemp.get('projectCard')
    const projectProperty = projectCard.get('projectProperty')
    // const canUseWarehouse = getState().homeState.getIn(['data', 'userInfo','sobInfo','moduleInfo']).indexOf('WAREHOUSE') > -1
    const jrUuid = ProjectCarryoverTemp.get('jrUuid')
    const oriUuid = ProjectCarryoverTemp.get('oriUuid')
    const jrIndex = ProjectCarryoverTemp.get('jrIndex')
    const oriState = ProjectCarryoverTemp.get('oriState')
    const carryoverList = ProjectCarryoverTemp.get('carryoverList')
    const allHappenAmount = ProjectCarryoverTemp.get('allHappenAmount')
    const allStoreAmount = ProjectCarryoverTemp.get('allStoreAmount')
    const receiveAmount = ProjectCarryoverTemp.get('receiveAmount')
    const currentAmount = ProjectCarryoverTemp.get('currentAmount')
    const insertOrModify = getState().editRunningAllState.getIn(['views', 'insertOrModify'])
    let amount = 0, otherAmount = 0
    let newStockCardList = [],newStockCardOtherList = [],stockCardUuidList = [],stockCardOtherUuidList = []

    let noAmount = '', stockNameList = []
    stockCardList && stockCardList.size && stockCardList.getIn([0,'cardUuid']) && stockCardList.toJS().map(item => {
        amount = numberCalculate(amount, item.amount)
        newStockCardList.push({
            ...item,
        })
        if(!Number(item.amount)){
            noAmount = 'true'
            stockNameList.push(`${item.code}${item.name}`)
        }

    })
    let jrJvUuidList = [], balanceUuidList = []
    oriState === 'STATE_XMJZ_XMJQ'  && carryoverList && carryoverList.map(item => {
        item.get('jrJvUuid') ? jrJvUuidList.push(item.get('jrJvUuid')) : balanceUuidList.push(item.get('balanceUuid'))
    })

    const checkStockNameList = Array.from(new Set(stockNameList))

    const allState = getState().allState
    const hideCategoryList = allState.get('hideCategoryList')
    const encodeType = editCalculateState.getIn(['views','encodeType'])

    let data = {
        oriDate,
        oriState,
        oriAbstract,
        stockCardList: newStockCardList,
        projectCardList:[projectCard],
        jrJvUuidList,
        balanceUuidList,
        amount: oriState === 'STATE_XMJZ_XMJQ' && Number(allStoreAmount) !== Number(allHappenAmount) || oriState === 'STATE_XMJZ_QRSRCB' ? Number(receiveAmount) : '',
        currentAmount: oriState === 'STATE_XMJZ_XMJQ' && Number(allStoreAmount) !== Number(allHappenAmount) || oriState === 'STATE_XMJZ_QRSRCB' ? (currentAmount ? Number(currentAmount) : 0) : '',
        enclosureList
    }
    data = insertOrModify === 'modify' ? encodeType ? {...data, jrUuid, oriUuid, jrIndex, encodeType } : { ...data, jrUuid, oriUuid, jrIndex } : data

    if (!oriDate) {
        return message.info('日期必填')
    }
    if (insertOrModify === 'modify' && !jrIndex) {
        return message.info('流水号必填')
    }
    if (!oriAbstract) {
        return message.info('摘要必填')
    } else if (oriAbstract.length > 64) {
        return message.info('摘要长度不能超过64个字符')
    }
    if(!projectCard.get('cardUuid')){
        return message.info('请选择项目卡片')
    }
    if(projectCard.get('projectProperty') === 'XZ_CONSTRUCTION'){
        if(!Number(receiveAmount) && !currentAmount && (oriState === 'STATE_XMJZ_QRSRCB' || oriState === 'STATE_XMJZ_XMJQ' &&  allStoreAmount !== allHappenAmount) ){
            return message.info(`收入金额、成本金额不能同时为空`)
        }
        // if(oriState === 'STATE_XMJZ_XMJQ' && ( numberCalculate(allStoreAmount,allHappenAmount,2,'subtract') < 0 )){
        //     return message.info(`项目贷方金额小于借方金额，无法结清`)
        // }
        if(oriState === 'STATE_XMJZ_XMJQ' && ( Number(allStoreAmount) !== Number(allHappenAmount)  &&  Number(numberCalculate(receiveAmount,currentAmount,2,'subtract')) !== Number(numberCalculate(allHappenAmount,allStoreAmount,2,'subtract')))){
            return message.info(`合同毛利不等于待确认合同毛利，无法结清`)
        }
    }else{
        if(oriState === 'STATE_XMJZ_XMJQ' && ( Number(amount) !== Number(numberCalculate(allHappenAmount,allStoreAmount,2,'subtract')) )){
            return message.info(`入库金额不等于待入库金额，无法结清`)
        }
    }
    if(noAmount === 'true'){
        return message.info(`请输入${checkStockNameList}的金额`)
    }
    if(newStockCardList.length > Limit.STOCK_MAX_NUMBER_TWO){
        return message.info(`所选存货总数不可超过${Limit.STOCK_MAX_NUMBER_TWO}个`)
    }




    dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
    fetchApi(`${insertOrModify}ProjectCarryover`, 'POST', JSON.stringify(data), json => {
        dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
        if (json.code !== 0) {
            message.info(json.code + ' ' + json.message)
            dispatch(initEncodeType())
        } else {
            if(json.data.encodeType !== null && json.data.encodeType !== undefined){
                dispatch(changeCanModifyJrIndex(json.data.encodeType,jrIndex,saveAndNew))
            }else{
                dispatch(initEncodeType())
                if (insertOrModify === 'insert') {
                    const { jrIndexList } = json.data
                    message.success(`已生成如下流水：记 ${json.data.jrIndex} 号${(jrIndexList || []).reduce((to,cur) => to+=`、记 ${cur} 号`,'')}`)
                } else {
                    message.success(json.message)
                }
                if (saveAndNew) { //保存并新增
                    dispatch(initEditCalculateTemp('saveAndNew', '', '', 'ProjectCarryoverTemp'))
                    dispatch(getProjectCarryoverCard({
                        oriDate,
                        categoryUuid: '',
                        level: '',
                        justCard: true,
                        needLeft: false
                    }))
                    dispatch(getCostCarryoverStockList(oriDate,'STATE_YYSR_ZJ','','ProjectCarryoverTemp'))
                    dispatch(getCanUseWarehouseCardList({temp:'ProjectCarryoverTemp'}))
                } else { //保存
                    dispatch(initEditCalculateTemp('afterSave', ProjectCarryoverTemp, json.data, 'ProjectCarryoverTemp'))
                    dispatch(modifyRefreshCalculate('LB_XMJZ', saveAndNew))
                }
            }

        }
    })

}

export const changeStockList = (stockCardList,index,dealType='add') => (dispatch, getState) => {
    const editCalculateState = getState().editCalculateState
    const editRunningAllState = getState().editRunningAllState
    const insertOrModify = editRunningAllState.getIn(['views', 'insertOrModify'])
    const oriDate = getState().editRunningState.getIn(['oriTemp', 'oriDate'])
    const oriState = editCalculateState.getIn(['CostTransferTemp', 'oriState'])
    const canModifyList = editCalculateState.getIn(['CostTransferTemp', 'canModifyList'])

    let stockCardListJ = stockCardList.toJS()

        if(dealType == 'delete'){
            stockCardListJ.splice(index,1)
            let stockUuidList = []
            stockCardListJ && stockCardListJ.map( item => {
                stockUuidList.push(item.cardUuid)
            })
            dispatch(changeEditCalculateCommonString('CostTransfer','stockCardList',  fromJS(stockCardListJ)))
            if(oriState !== 'STATE_YYSR_ZJ'){
                if(insertOrModify === 'insert'){
                    // stockCardListJ[0] && stockCardListJ[0]['cardUuid'] ? dispatch(getCostTransferList(oriState, oriDate,dealTypeUuid)) : ''
                    // dispatch(getCostTransferList(oriState, oriDate,''))
                    dispatch(getCarryoverCategory(oriDate,oriState))

                }else{
                    const stockCardUuidArr = []
                    stockCardListJ.map(v =>{
                        stockCardUuidArr.push(v.cardUuid)
                    })
                    const list = canModifyList.filter(item => stockCardUuidArr.indexOf(item.get('stockCardUuid')) !== -1).toJS()
                    let result = {list}
                    dispatch({type: ActionTypes.AFTER_GET_EDIT_CALCULATE_COMMON_LIST, receivedData: {result:list}, ListName: 'costTransferList', temp: 'CostTransferTemp'})
                }
            }

        }else{
            stockCardListJ.splice(index+1,0,{amount:'',cardUuid:''})
            dispatch(changeEditCalculateCommonString('CostTransfer','stockCardList',  fromJS(stockCardListJ)))
        }



}
// 折旧摊销处理类别
export const getAssetsList = (type, temp) => dispatch => {
    dispatch({
        type: ActionTypes.SWITCH_LOADING_MASK
    })
    fetchApi('getAssetsList', 'POST', JSON.stringify({
        type,
    }), json => {
        dispatch({
            type: ActionTypes.SWITCH_LOADING_MASK
        })
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_CALCULATE_DEAL_TYPE_CATEGORY,
                receivedData: json.data.result,
                temp
            })
        }
    })
}
// 结转损益流水
export const getUnprocessedList = (oriDate, categoryUuid, beProject) => (dispatch, getState) => {

    const isbeProject = beProject ? beProject : getState().editCalculateState.getIn(['CqzcTemp', 'beProject'])

    fetchApi('getUnprocessedList', 'GET', `oriDate=${oriDate.slice(0,10)}&categoryUuid=${categoryUuid}`, json => {
        if (showMessage(json)) {
            dispatch(changeEditCalculateCommonState('CqzcTemp', 'businessList', fromJS(json.data.jrList)))
            if (json.data.jrList.length > 0 && isbeProject) {
                dispatch(changeEditCalculateCommonState('CqzcTemp', 'usedProject', true))
            }
        }
    })
}
export const getJzsyProjectCardList = (projectRange, position = 'CqzcTemp',needCommonCard=false,projectProperty='',needIndirect,needMechanical,needAssist,needMake) => (dispatch, getState) => {
    dispatch({
        type: ActionTypes.SWITCH_LOADING_MASK
    })
    // dispatch(changeEditCalculateCommonState('CqzcTemp','beProject',true))
    dispatch(changeEditCalculateCommonState(position, 'projectRange', projectRange))
    const sobId = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'sobId'])

    fetchApi('getProjectCardList', 'POST', JSON.stringify({
        sobId,
        categoryList: projectRange,
        needCommonCard,
        projectProperty,
        needIndirect,
        needMechanical,
        needAssist,
        needMake,
    }), json => {
        dispatch({
            type: ActionTypes.SWITCH_LOADING_MASK
        })
        if (showMessage(json)) {
            dispatch(changeEditCalculateCommonState(position, 'projectList', fromJS(json.data.result)))
        }
    })
}
export const calculateGainForJzsy = () => (dispatch, getState) => {
    const editCalculateState = getState().editCalculateState
    const CqzcTemp = editCalculateState.get('CqzcTemp')
    const businessList = CqzcTemp.get('businessList')
    const selectAmount = businessList.reduce((total, cur) => cur.get('beSelect') ? total + (Number(cur.get('amount'))) : total, 0)
    const depreciationAmount = CqzcTemp.getIn(['assets', 'depreciationAmount'])
    const originalAssetsAmount = CqzcTemp.getIn(['assets', 'originalAssetsAmount'])
    const loss = (Number(originalAssetsAmount) - Number(depreciationAmount)).toFixed(2)//资产原值-累计折旧摊销
    const diff = (loss - selectAmount).toFixed(2)
    //资产原值-累计折旧摊销 < 处置金额合计 显示收益，否则显示损失 1011知世确认
    let place, deletePlace
    // if (Number(loss) <= selectAmount) {
    //     place = ['CqzcTemp', 'netProfitAmount']
    //     deletePlace = ['CqzcTemp', 'lossAmount']
    // } else {
    //     place = ['CqzcTemp', 'lossAmount']
    //     deletePlace = ['CqzcTemp', 'netProfitAmount']
    // }
    dispatch(changeEditCalculateCommonString('Cqzc', 'amount', selectAmount))
    // if ((originalAssetsAmount || depreciationAmount) && selectAmount !== 0) {
        // dispatch({
        //     type: ActionTypes.EDIT_CALCULATE_GAIN_OR_LOSS,
        //     deletePlace,
        //     place,
        //     diff
        // })
    // }
    const diffAmount = (originalAssetsAmount || depreciationAmount) && selectAmount !== 0 ? diff : ''
    dispatch({
        type: ActionTypes.EDIT_CALCULATE_CQZC_GAIN_OR_LOSS,
        place:  ['CqzcTemp', 'diffAmount'],
        diff: diffAmount
    })
}
// 项目卡片
export const getProjectCardList = (projectRange, beProject) => (dispatch, getState) => {
    const isbeProject = beProject ? beProject : getState().editCalculateState.getIn(['DepreciationTemp', 'beProject'])
    const editRunningAllState = getState().editRunningAllState
    const insertOrModify = editRunningAllState.getIn(['views', 'insertOrModify'])
    const sobId = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'sobId'])
    fetchApi('getProjectCardList', 'POST', JSON.stringify({
        sobId,
        categoryList: projectRange,
        needCommonCard: true,
        needAssist:true,
        needMake:true,
        needIndirect: true,
        needMechanical: true
    }), json => {
        if (showMessage(json)) {
            dispatch(changeEditCalculateCommonState('views', 'projectList', fromJS(json.data.result)))
            if (json.data.result.length > 0 && isbeProject && insertOrModify === 'insert') {
                dispatch(changeEditCalculateCommonState('DepreciationTemp', 'usedProject', true))
            }
        }
    })
}

export const saveCalculatebusiness = (paymentType, saveAndNew = false) => dispatch => {
    switch (paymentType) {
        case 'LB_ZZ':
            dispatch(insertOrModifyLrInternalTransfer(saveAndNew))
            break
        case 'LB_ZJTX':
            dispatch(insertOrModifyLrDepreciation(saveAndNew))
            break
        case 'LB_FPRZ':
            dispatch(insertOrModifyLrInvoiceAuthPz(saveAndNew))
            break
        case 'LB_KJFP':
            dispatch(insertOrModifyLrInvoicingPz(saveAndNew))
            break
        case 'LB_JZSY':
            dispatch(insertOrModifyLrDisposal(saveAndNew))
            break
        case 'LB_ZCWJZZS':
            dispatch(insertOrModifyLrTransferOut(saveAndNew))
            break
        case 'LB_SFGL':
            dispatch(insertOrModifyLrPayManage(saveAndNew))
            break
        case 'LB_JZCB':
            dispatch(insertOrModifyLrCostTransfer(saveAndNew))
            break
        case 'LB_GGFYFT':
            dispatch(insertOrModifyProjectShare(saveAndNew))
            break
        case 'LB_CHDB':
            dispatch(insertOrModifyInventoryTransfer(saveAndNew))
            break
        case 'LB_CHYE':
            dispatch(insertOrModifyBalanceAdjustment(saveAndNew))
            break
        case 'LB_JXSEZC':
            dispatch(insertOrModifyTaxTransfer(saveAndNew))
            break
        case 'LB_CHZZ':
            dispatch(insertOrModifyStockBuildUp(saveAndNew))
            break
        case 'LB_CHTRXM':
            dispatch(insertOrModifyStockIntoProject(saveAndNew))
            break
        case 'LB_XMJZ':
            dispatch(insertOrModifyProjectCarryover(saveAndNew))
            break

        default:

            break
    }
}

export const justNewCalculatebusiness = (paymentType,curOriState,noNeedRequest = false) => (dispatch, getState) => {
    // noNeedRequest为true => 复制流水不请求
    const editCalculateState = getState().editCalculateState
    const editRunningState = getState().editRunningState
    const oriDate = editRunningState.getIn(['oriTemp','oriDate'])
    const oriState = curOriState || (paymentType === 'LB_JZCB' ? editCalculateState.getIn(['CostTransferTemp', 'oriState']) : '')

    const period = getState().allState.get('period')
    const year = period.get('openedyear')
    const month = period.get('openedmonth')

    dispatch({
        type: ActionTypes.INIT_EIDT_CALCULATE,
    })

    dispatch(changeEditCalculateCommonState('views', 'paymentTypeStr',editCalculateState.getIn(['views', 'paymentTypeStr']) ))

    if(!noNeedRequest){
        switch (paymentType) {
            case 'LB_ZZ':
                dispatch({
                    type: ActionTypes.AFTER_SUCCESS_INSERT_CALCULATE_LB_ZZ,
                    saveAndNew: true,
                })
                break
            case 'LB_SFGL':
                dispatch(getPayManageList({
                    oriDate,
                    categoryUuidList: fromJS([]),
                    cardUuidList:fromJS([]),
                    oriUuid:'',
                    currentCardPage: 1
                }))
                dispatch(getContactsCardList(oriDate))
                break
            case 'LB_JZCB':
                // dispatch(getCarryoverCategory(oriDate, oriState))
                if (oriState === 'STATE_YYSR_ZJ') {
                    dispatch(getCarryoverCategory(oriDate,oriState,true))
                }
                dispatch(getCostCarryoverStockList(oriDate, oriState, ''))
                oriState !== 'STATE_YYSR_ZJ' && dispatch(getCostTransferList(oriState, oriDate, [],[],[],'',1))
                oriState !== 'STATE_YYSR_ZJ' && dispatch(getCarryoverCategory(oriDate,oriState))
                break
            case 'LB_FPRZ':
                dispatch(getInvoicingList('BILL_AUTH_TYPE_CG', oriDate))
                break
            case 'LB_KJFP':
                dispatch(getInvoicingList('BILL_MAKE_OUT_TYPE_XS', oriDate))
                break
            case 'LB_ZCWJZZS':
                break
            case 'LB_GGFYFT':
                dispatch(getProjectShareList())
                dispatch(getJrProjectShareType())
                break
            case 'LB_ZJTX':
                dispatch(getAssetsList('LB_ZJTX', 'DepreciationTemp'))
                break
            case 'LB_JZSY':
                dispatch(getAssetsList('LB_JZSY', 'CqzcTemp'))
                break
            case 'LB_CHDB':
                dispatch(getCanUseWarehouseCardList({temp:'StockTemp'}))
                // dispatch(getStockCardList())
                break
            case 'LB_CHYE':
                dispatch(getCanUseWarehouseCardList({temp:'BalanceTemp'}))
                dispatch(getStockCardList('BalanceTemp'))
                break
            case 'LB_JXSEZC':
                // dispatch(getCanUseWarehouseCardList('TaxTransferTemp'))
                // dispatch(getStockCardList('TaxTransferTemp'))
                break
            case 'LB_CHZZ':
                dispatch(getStockCardList('StockBuildUpTemp'))
                dispatch(getCanUseWarehouseCardList({temp:'StockBuildUpTemp'}))
                break
            case 'LB_CHTRXM':
                dispatch(getChargeProjectCard('STATE_CHTRXM', 'StockIntoProjectTemp'))
                dispatch(getCostCarryoverStockList(oriDate,'STATE_YYSR_ZJ','','StockIntoProjectTemp'))
                dispatch(getCanUseWarehouseCardList({temp:'StockIntoProjectTemp'}))
                break
            case 'LB_XMJZ':
                dispatch(getProjectCarryoverCard({
                    oriDate,
                    categoryUuid: '',
                    level: '',
                    justCard: true,
                    needLeft: false
                }))
                dispatch(getCostCarryoverStockList(oriDate,'STATE_YYSR_ZJ','','ProjectCarryoverTemp'))
                dispatch(getCanUseWarehouseCardList({temp:'ProjectCarryoverTemp'}))
                break
            default:
                break
        }
    }

    dispatch({
        type: ActionTypes.AFTER_SUCCESS_INSERT_CALCULATE_AND_NEW
    })
}
export const getStokcListFromConfig = () => (dispatch, getState) => {
    const editCalculateState = getState().editCalculateState
    const editRunningAllState = getState().editRunningAllState
    const editRunningState = getState().editRunningState
    const paymentType = editRunningAllState.getIn(['views', 'paymentType'])
    const oriDate = editRunningState.getIn(['oriTemp','oriDate'])
    switch (paymentType) {
        case 'LB_CHZZ':
            dispatch(getStockCardList('StockBuildUpTemp'))
            break
        case 'LB_XMJZ':
            dispatch(getCostCarryoverStockList(oriDate,'STATE_YYSR_ZJ','','ProjectCarryoverTemp'))
            break
        default:
            break
    }
}
export const insertRefreshCalculate = (paymentType) => (dispatch, getState) => {
    dispatch(justNewCalculatebusiness(paymentType))
}
export const modifyRefreshCalculate = (paymentType, saveAndNew) => (dispatch, getState) => {
    dispatch({
        type: ActionTypes.SWITCH_LOADING_MASK
    })
    ;const setPlace = ({
        'LB_JZCB': () => 'CostTransferTemp',
        'LB_FPRZ': () => 'InvoiceAuthTemp',
        'LB_KJFP': () => 'InvoicingTemp',
        'LB_ZCWJZZS': () => 'TransferOutTemp',
        'LB_ZZ': () => 'InternalTransferTemp',
        'LB_ZJTX': () => 'DepreciationTemp',
        'LB_JZSY': () => 'CqzcTemp',
        'LB_SFGL': () => 'SfglTemp',
        'LB_GGFYFT': () => 'CommonChargeTemp',
        'LB_CHDB': () => 'StockTemp',
        'LB_CHYE': () => 'BalanceTemp',
        'LB_JXSEZC': () => 'TaxTransferTemp',
        'LB_CHZZ': () => 'StockBuildUpTemp',
        'LB_CHTRXM': () => 'StockIntoProjectTemp',
        'LB_XMJZ': () => 'ProjectCarryoverTemp',
        'LB_SYJZ': () => 'JzjzsyTemp',
    } [paymentType] || (() => ''))()
    const editCalculateState = getState().editCalculateState
    const uuidList = editCalculateState.getIn(['views', 'switchUuidList'])
    const item = editCalculateState.get(setPlace)
    const oriUuid = item.get('oriUuid')
    const oriDate = item.get('oriDate')
    const oriState = item.get('oriState')
    if (!oriUuid) {
        dispatch(allActions.sendMessageToDeveloper({
            title: '获取单条流水',
            message: 'oriUuid不存在，function:modifyRefreshCalculate',
            remark: '录入刷新',
        }))
    }
    fetchApi('getJrOri', 'GET', `oriUuid=${oriUuid}`, json => {
        if (showMessage(json)) {
            const setActionType = ({
                'LB_JZCB': () => 'COST_TRANSFER_FROM_SEARCH_JUMP_TO_LRLS',
                'LB_FPRZ': () => 'INVOICE_AUTH_FROM_SEARCH_JUMP_TO_LRLS',
                'LB_KJFP': () => 'INVOICING_FROM_SEARCH_JUMP_TO_LRLS',
                'LB_ZCWJZZS': () => 'TRANSFER_OUT_FROM_SEARCH_JUMP_TO_LRLS',
                'LB_ZZ': () => 'TRANSFER_OUT_FROM_SEARCH_JUMP_TO_NBZZ',
                'LB_ZJTX': () => 'TRANSFER_OUT_FROM_SEARCH_JUMP_TO_ZJTX',
                'LB_JZSY': () => 'TRANSFER_OUT_FROM_SEARCH_JUMP_TO_JZSY',
                'LB_SFGL': () => 'PAYMANAGE_FROM_SEARCH_JUMP_TO_LRLS',
                'LB_GGFYFT': () => 'COMMONCHARGE_FROM_SEARCH_JUMP_TO_LRLS',
                'LB_CHDB': () => 'INVENTORY_TRANSFER_FROM_SEARCH_JUMP_TO_LRLS',
                'LB_CHYE': () => 'INVENTORY_BALANCE_FROM_SEARCH_JUMP_TO_LRLS',
                'LB_JXSEZC': () => 'TAX_TRANSTER_FROM_SEARCH_JUMP_TO_LRLS',
                'LB_CHZZ': () => 'STOCK_BUILDUP_FROM_SEARCH_JUMP_TO_LRLS',
                'LB_CHTRXM': () => 'STOCK_INTO_PROJECT_FROM_SEARCH_JUMP_TO_LRLS',
                'LB_XMJZ': () => 'PROJECT_CARROVER_FROM_SEARCH_JUMP_TO_LRLS',
                'LB_SYJZ': () => 'TRANSFER_OUT_FROM_SEARCH_JUMP_TO_SYJZ',
            } [paymentType])()
            dispatch({
                type: ActionTypes[setActionType],
                item,
                receivedData: json.data,
                insertOrModify: 'modify',
                uuidList
            })
            dispatch(editRunningActions.changeLrAccountCommonString('ori', 'oriDate', json.data.jrOri.oriDate))
            let stockPriceList = [],stockOtherPrice = [],dbWarehouseUuid='',allMaterialList=[]
            if(oriState === 'LB_CHDB'){
                json.data.jrOri.warehouseCardList.map(v => {
                    if(v.warehouseStatus === 'WAREHOUSE_STATUS_FROM'){
                        dbWarehouseUuid = v.cardUuid
                    }
                })
            }
            if(json.data.jrOri.stockCardList && json.data.jrOri.stockCardList.length){
                json.data.jrOri.stockCardList.map((item,index) => {
                    if(oriState!== 'STATE_CHZZ_ZZD' && !item.childCardList){
                        stockPriceList.push({
                            cardUuid: item.cardUuid,
                            storeUuid: oriState !== 'LB_CHDB' ? item.warehouseCardUuid : dbWarehouseUuid,
                            assistList: item.assistList,
                            batchUuid: item.batchUuid,
                        })
                    }else{
                        item.amount = 0
                        item.childCardList.map((childItem,childIndex) => {
                            childItem.storeUuid = childItem.warehouseCardUuid
                            childItem.parentIndex = index
                            stockPriceList.push(childItem)
                        })
                    }
                })
            }
            if(json.data.jrOri.stockCardOtherList && json.data.jrOri.stockCardOtherList.length){
                json.data.jrOri.stockCardOtherList.map((item,index) => {
                    stockOtherPrice.push({
                        cardUuid: item.cardUuid,
                        storeUuid: item.warehouseCardUuid,
                        assistList: item.assistList,
                        batchUuid: item.batchUuid,
                    })
                })
            }
            if (!saveAndNew && paymentType === 'LB_JZSY') {
                dispatch(getJzsyProjectCardList(json.data.category.projectRange))
            }
            if (!saveAndNew && paymentType === 'LB_JZCB') {

                const needCommonCard = true
                const needIndirect = json.data.jrOri.relationCategoryType === 'LB_FYZC' ? true : false
                const needMechanical = json.data.jrOri.relationCategoryType === 'LB_FYZC' ? true : false
                const needAssist = json.data.jrOri.relationCategoryType === 'LB_FYZC' ? true : false
                const needMake = json.data.jrOri.relationCategoryType === 'LB_FYZC' ? true : false
                dispatch(getJzsyProjectCardList(json.data.jrOri.projectRange, 'CostTransferTemp',needCommonCard,'',needIndirect,needMechanical,needAssist,needMake))
                if (json.data.jrOri.oriState === 'STATE_YYSR_ZJ') {
                    dispatch(getCanUseWarehouseCardList({temp:'CostTransferTemp'}))
                    dispatch(getCostCarryoverStockList(oriDate, 'STATE_YYSR_ZJ', json.data.jrOri.relationCategoryUuid))
                }else{
                    // dispatch(getCostTransferList(json.data.jrOri.oriState, json.data.jrOri.oriDate, [],[],[],'',1))
                }
                if(stockPriceList.length > 0){
                    if(json.data.jrOri.oriState === 'STATE_YYSR_ZJ'){
                        dispatch(innerCalculateActions.getModifyStockPrice(json.data.jrOri.oriDate,stockPriceList,'CostTransfer','stockCardList',''))

                    }

                }
            }
            // if (!saveAndNew && paymentType === 'LB_SFGL') {
            //     const pendingManageList = json.data.jrOri.pendingManageDto.pendingManageList
            //     pendingManageList.forEach((item, index) => {
            //         if (item.beCard) {
            //             dispatch(getManagerCategoryList(index, item.uuid))
            //         }
            //     })
            // }

            if (!saveAndNew && paymentType === 'LB_ZJTX') {
                dispatch(getProjectCardList(json.data.category.projectRange))
            }
            if (!saveAndNew && paymentType === 'LB_CHDB') {
                dispatch(getCanUseWarehouseCardList({temp:'StockTemp'}))
                dispatch(getStockCardList())
                dispatch(innerCalculateActions.getModifyStockPrice(json.data.jrOri.oriDate,stockPriceList,'Stock','stockCardList',''))
            }
            if (!saveAndNew && paymentType === 'LB_CHYE') {
                dispatch(getStockCardList('BalanceTemp'))
                dispatch(getCanUseWarehouseCardList({temp:'BalanceTemp'}))
                dispatch(innerCalculateActions.getModifyStockPrice(json.data.jrOri.oriDate,stockPriceList,'Balance','stockCardList',''))

            }
            if(paymentType === 'LB_CHZZ'){
                dispatch(getStockCardList('StockBuildUpTemp'))
                dispatch(getCanUseWarehouseCardList({temp:'StockBuildUpTemp'}))
                if(oriState === 'STATE_CHZZ_ZZCX'){
                    dispatch(innerCalculateActions.getModifyStockPrice(json.data.jrOri.oriDate,stockPriceList.concat(stockOtherPrice),'StockBuildUp','stockCardList','stock'))
                }else{
                    dispatch(innerCalculateActions.getModifyStockPrice(json.data.jrOri.oriDate,stockPriceList,'StockBuildUp','stockCardList','Assembly',json.data.jrOri.stockCardList))
                }
            }
            if (!saveAndNew && paymentType === 'LB_JXSEZC') {
                const categoryType = json.data.category.relationCategoryType
                const propertyCarryover = json.data.category.propertyCarryover
                const projectRange = json.data.category.projectRange
                const acBusinessExpense = json.data.category.acBusinessExpense
                if(categoryType === 'LB_YYZC' && propertyCarryover === 'SX_FW' || categoryType === 'LB_FYZC'){
                    dispatch(getJzsyProjectCardList(projectRange,'TaxTransferTemp',true))
                }
                if(categoryType === 'LB_YYZC' && propertyCarryover === 'SX_HW'){
                    dispatch(getStockCategoryList(acBusinessExpense.stockRange))
                    dispatch(getCanUseWarehouseCardList({temp:'TaxTransferTemp'}))
                }
            }
            if(paymentType === 'LB_GGFYFT'){
                dispatch(getJrProjectShareType())
                dispatch(getChargeProjectCard(oriState))
            }
            if(paymentType === 'LB_CHTRXM'){
                dispatch(getChargeProjectCard('STATE_CHTRXM','StockIntoProjectTemp'))
                dispatch(getCostCarryoverStockList(json.data.jrOri.oriDate,'STATE_YYSR_ZJ','','StockIntoProjectTemp'))
                dispatch(getCanUseWarehouseCardList({temp:'StockIntoProjectTemp'}))
                stockPriceList.length && dispatch(innerCalculateActions.getModifyStockPrice(json.data.jrOri.oriDate,stockPriceList,'StockIntoProject','stockCardList',''))
            }
            if(paymentType === 'LB_XMJZ'){
                dispatch(getProjectCarryoverCard({
                    oriDate: json.data.jrOri.oriDate,
                    categoryUuid: '',
                    level: '',
                    justCard: true,
                    needLeft: false
                }))
                dispatch(getCostCarryoverStockList(json.data.jrOri.oriDate,'STATE_YYSR_ZJ','','ProjectCarryoverTemp'))
                dispatch(getCanUseWarehouseCardList({temp:'ProjectCarryoverTemp'}))
                if(json.data.jrOri.oriState === 'STATE_XMJZ_JZRK' || json.data.jrOri.oriState === 'STATE_XMJZ_QRSRCB'){
                    dispatch(getProjectCarryoverList(json.data.jrOri.oriDate,json.data.jrOri.projectCardList[0].cardUuid,json.data.jrOri.oriUuid))
                    stockPriceList.length && dispatch(innerCalculateActions.getModifyStockPrice(json.data.jrOri.oriDate,stockPriceList,'ProjectCarryover','stockCardList','',allMaterialList))
                }
            }
            dispatch({
                type: ActionTypes.SWITCH_LOADING_MASK
            })
        } else {
            dispatch({
                type: ActionTypes.SWITCH_LOADING_MASK
            })
        }
    })
}
// 收付管理
export const addAccounts = (accounts,index) => dispatch => {
    let accountsJ = accounts.toJS()
    accountsJ.splice(index+1,0,{amount:'',uuid:''})
    dispatch(changeEditCalculateCommonString('Sfgl','accounts',  fromJS(accountsJ)))
}
export const deleteAccounts = (accounts,index) => dispatch => {
    let accountsJ = accounts.toJS()
    accountsJ.splice(index,1)
    dispatch(changeEditCalculateCommonString('Sfgl','accounts', fromJS(accountsJ)))
}
export const getContactsCardList = (oriDate) => dispatch => {
    dispatch(getPaymentCategory(oriDate))
    dispatch(getPaymentCardList(oriDate))

}
export const getPaymentCategory = (oriDate) => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getPaymentCategory', 'GET',`oriDate=${oriDate.slice(0,10)}`,json => {
        if (showMessage(json)) {
           dispatch(changeEditCalculateCommonString('Sfgl', ['categoryList',0], fromJS(json.data.category)))
           dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
       }else{
           dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
       }
    })
}
export const getPaymentCardList = (oriDate) => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getPaymentCardList', 'GET',`oriDate=${oriDate.slice(0,10)}`,json => {
        if (showMessage(json)) {
            dispatch(changeEditCalculateCommonState('SfglTemp', 'cardList', fromJS(json.data.cardList)))
            dispatch(editRunningActions.changeEditOutCommonString('selectThingsList', fromJS(json.data.cardList)))
            dispatch(editRunningActions.changeEditOutCommonString('thingsList', fromJS(json.data.cardList)))
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        }else{
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        }
    })
}
export const getPaymentCardTree = (oriDate) => dispatch => {
    dispatch({
        type: ActionTypes.SWITCH_LOADING_MASK
    })
    fetchApi('getPaymentCardTree', 'GET', `oriDate=${oriDate.slice(0,10)}`, json => {
        dispatch({
            type: ActionTypes.SWITCH_LOADING_MASK
        })
        if (showMessage(json)) {
            dispatch(editRunningActions.changeEditOutCommonString('MemberList', fromJS(json.data.cardTree)))
        }
    })
}
export const getPaymentCardTreeList = (oriDate, uuid, level) => dispatch => {
    let cardCategoryUuid = '',
        subordinateUuid = ''
    level == 1 ? cardCategoryUuid = uuid : subordinateUuid = uuid
    dispatch({
        type: ActionTypes.SWITCH_LOADING_MASK
    })
    fetchApi('getPaymentCardTreeList', 'GET', `oriDate=${oriDate.slice(0,10)}&cardCategoryUuid=${cardCategoryUuid}&subordinateUuid=${subordinateUuid}`, json => {
        dispatch({
            type: ActionTypes.SWITCH_LOADING_MASK
        })
        if (showMessage(json)) {
            dispatch(editRunningActions.changeEditOutCommonString('selectThingsList', fromJS(json.data.cardList)))
            dispatch(editRunningActions.changeEditOutCommonString('thingsList', fromJS(json.data.cardList)))
        }
    })
}

export const getPayManageList = (getlistObj) => (dispatch,getState) => {
    const {
        oriDate,
        categoryUuidList,
        cardUuidList,
        oriUuid,
        currentCardPage,
        condition = '',
        fromPage,
        writeOffType ='',
        pageSize,
        beginDate,
        endDate,
        notCheckDate
     } = getlistObj
    // if(!categoryUuid && !cardUuid){
    //     return
    // }

    const SfglTemp = getState().editCalculateState.get('SfglTemp')
    const sfPageSize = pageSize ? pageSize : SfglTemp.get('pageSize')

    const begin = notCheckDate ? beginDate : (beginDate ? beginDate : SfglTemp.get('beginDate'))
    const end = notCheckDate ? endDate : (endDate ? endDate : SfglTemp.get('endDate'))

    let newCategoryUuidList = categoryUuidList,
        newCardUuidList = cardUuidList
    categoryUuidList && categoryUuidList.map(item => {
        if(!item){
            newCategoryUuidList = fromJS([])
        }
    })
    cardUuidList && cardUuidList.map(item => {
        if(!item){
            newCardUuidList = fromJS([])
        }
    })
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
      fetchApi('getPaymentManageList', 'POST',JSON.stringify({
          oriDate: oriDate.slice(0,10),
          cardUuidList: newCardUuidList ? (writeOffType ? [] : newCardUuidList) : [],
          categoryUuidList: newCategoryUuidList ? (writeOffType ? [] : newCategoryUuidList) : [],
          oriUuid: oriUuid ? oriUuid : null,
          currentPage: currentCardPage,
          condition: writeOffType ? '' : condition,
          writeOffType,
          pageSize: sfPageSize,
          beginDate: begin,
          endDate: end
      }),json => {
            if (showMessage(json )) {
                  dispatch({
                    type:ActionTypes.GET_PAYMANAGE_LIST,
                    receivedData:json.data,
                    fromPage,
                    condition,
                    begin,
                    end,
                    needWriteOffTypeList: (newCardUuidList.size !==0 || newCategoryUuidList.size !==0  || condition !=='' || writeOffType !=='' ) ? false : true
                  })
                  writeOffType && dispatch(manageCheckboxCheckAll(false, fromJS(json.data.pendingManageList)))
                  dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            }else{
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            }
        })
}
export const initDetailList = () => dispatch => {
    dispatch({
        type: ActionTypes.ITIT_PAYMANAGE_LIST
    })
}

export const getManagerCategoryList = (index, uuid) => dispatch => {
    fetchApi('getPerCategoryTree', 'GET', `uuid=${uuid}`, json => {
        if (showMessage(json)) {
            dispatch(changeEditCalculateCommonString('Sfgl', ['managerCategoryList', index], fromJS({uuid,category:json.data.category})))
        }
    })
}
export const accountItemCheckboxCheck = (checked, item, index, uuidName='uuid') => ({
    type: ActionTypes.EDITRUNNING_ITEM_CHECKBOX_CHECK,
    checked,
    item,
    index,
    uuidName,
})
export const manageCheckboxCheckAll = (selectAll, list, uuidName='uuid') => (dispatch, getState) => {
    const editCalculateState = getState().editCalculateState
    const detail = editCalculateState.getIn(['SfglTemp', 'detail'])
    const managerCategoryList = editCalculateState.getIn(['SfglTemp', 'managerCategoryList'])

    // list.forEach((item, index) => {
    //     if (item.get('beCard') && !managerCategoryList.get(index)) {
    //         dispatch(getManagerCategoryList(index, item.get('uuid')))
    //     }
    // })

    dispatch({
        type: ActionTypes.EDITRUNNING_ITEM_CHECKBOX_CHECK_ALL,
        selectAll,
        list,
        uuidName
    })
}
export const accountTotalAmount = (needChangeHanle) => (dispatch, getState) => {
    const editCalculateState = getState().editCalculateState
    const selectItem = editCalculateState.getIn(['views', 'selectItem'])
    let totalAmount = 0
    selectItem && selectItem.size && selectItem.map((v, i) => {
        const direction = v.get('direction')
        let showAmount
        let amount = Number(v.get('amount'))
        showAmount = amount.toFixed(2)
        if (direction === 'debit') { //借
            totalAmount += Number(showAmount)
        } else {
            totalAmount -= Number(showAmount)
        }
    })
    dispatch(changeEditCalculateCommonState('views', 'totalAmount', totalAmount.toFixed(2)))
    if (needChangeHanle) {
        dispatch(changeEditCalculateCommonString('Sfgl', 'handlingAmount', Math.abs(totalAmount).toFixed(2)))
    }

}

export const changeBeforeAmount = (value, index, uuid) => (dispatch, getState) => {
    const categoryUuid = value.split(Limit.TREE_JOIN_STR)[0]
    const categoryName = value.split(Limit.TREE_JOIN_STR)[1]
    dispatch(changeEditCalculateCommonString('Sfgl', ['detail', index, 'categoryUuid'], categoryUuid))
    dispatch(changeEditCalculateCommonString('Sfgl', ['detail', index, 'categoryName'], categoryName))

    let selectIndex = -1
    const selectItem = getState().editCalculateState.getIn(['views', 'selectItem'])
    selectItem.map((item, i) => {
        if (item.get('uuid') === uuid) {
            selectIndex = i
        }
    })
    if (selectIndex > -1) {
        dispatch(changeEditCalculateCommonString('', ['views', 'selectItem', selectIndex, 'categoryUuid'], categoryUuid))
        dispatch(changeEditCalculateCommonString('', ['views', 'selectItem', selectIndex, 'categoryName'], categoryName))
    }


}

// 项目分摊
export const getProjectShareList = (date,chooseShareType,tabName = 0,currentPage = 1,pageSize) => (dispatch, getState) => {
    const editRunningState = getState().editRunningState
    const CommonChargeTemp = getState().editCalculateState.get('CommonChargeTemp')
    const ftPageSize = pageSize ? pageSize : CommonChargeTemp.get('pageSize')
    const shareType = chooseShareType ? chooseShareType : CommonChargeTemp.get('oriState')
    const oriDate = date || editRunningState.getIn(['oriTemp', 'oriDate'])
    const data = shareType === 'STATE_GGFYFT' ? `oriDate=${oriDate.slice(0,10)}&oriState=${shareType}&shareType=${tabName}&pageNum=${currentPage}&pageSize=${ftPageSize}` : `oriDate=${oriDate.slice(0,10)}&oriState=${shareType}&pageNum=${currentPage}&pageSize=${ftPageSize}`
    fetchApi('getJrProjectShareList', 'GET', data, json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.CHANGE_PAYMENT_LIST_XMFT,
                paymentList: json.data.shareList,
                currentPage,
                pageSize: ftPageSize,
                cardPages: json.data.pageCount,
                totalNumber: json.data.total,
            })
        }
    })
}
export const getJrProjectShareType = (date) => (dispatch, getState) => {
    fetchApi('getJrProjectShareType', 'GET', ``, json => {
        if (showMessage(json)) {
            dispatch(changeEditCalculateCommonString('CommonCharge', 'shareTypeList', fromJS(json.data.typeList)))
        }
    })
}
// 项目 puer
export const getChargeProjectCard = (shareType,temp = 'CommonChargeTemp',currentPage = 0) => (dispatch,getState) => {
    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])
    let projectProperty = shareType ? 'XZ_LOSS' : '', notProjectProperty = undefined,
        needCommon = false, //是否需要公关费用分摊卡片
        needAssist = false, //是否需要辅助生产成本卡片
        needMake = false, //是否需要制造费用卡片
        needIndirect = false, //是否需要间接费用卡片,
        needMechanical = false, //是否需要机械作业卡片,
        needEmptyCard = shareType === 'STATE_GGFYFT' ? true : false //公共费用分摊项目卡片 无项目

    switch (shareType) {
        case 'STATE_GGFYFT':
            projectProperty = 'XZ_LOSS'
            break
        case 'STATE_FZSCCB':
            projectProperty = 'XZ_PRODUCE'
            needCommon = true
            break

        case 'STATE_ZZFY':
            projectProperty = 'XZ_PRODUCE'
            needCommon = true
            needAssist = true
            break
        case 'STATE_JJFY':
            projectProperty = 'XZ_CONSTRUCTION'
            needCommon = true
            break
        case 'STATE_JXZY':
            projectProperty = 'XZ_CONSTRUCTION'
            needCommon = true
            needIndirect = true
            break
        case 'STATE_CHTRXM':
            notProjectProperty = 'XZ_LOSS'
            needCommon = false
            needAssist = true
            needMake = true
            needIndirect = true
            needMechanical = true
            break
        case 'STATE_XMJZ':
            notProjectProperty = 'XZ_LOSS'
            break
        default:
    }


    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi(`getProjectAllTreeList`, 'POST', JSON.stringify({
        sobId,
        projectProperty: notProjectProperty ? '' : projectProperty,
        notProjectProperty,
    }), json => {
        if (showMessage(json)) {
            dispatch(changeEditCalculateCommonState('commonCardObj', 'memberList', fromJS(json.data.typeList)))
        }
    })
    const data = `listFrom=&treeFrom=&notProjectProperty=${notProjectProperty}&projectProperty=${notProjectProperty ? '' : projectProperty}&needCommon=${needCommon}&needAssist=${needAssist}&needMake=${needMake}&needIndirect=${needIndirect}&needMechanical=${needMechanical}&needEmptyCard=${needEmptyCard}&used=true&currentPage=${currentPage}&pageSize=${Limit.MXB_CARD_PAGE_SIZE}`
    fetchApi(`getProjectListAndTree`, 'GET', data, json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            const cardPageObj = {
                currentPage: json.data.currentPage ? json.data.currentPage : 1,
                pages: json.data.pages ? json.data.pages : 1,
                total: json.data.total ? json.data.total : 1,
            }
            dispatch(changeEditCalculateCommonState('commonCardObj', 'thingsList', fromJS(json.data.resultList)))
            dispatch(changeEditCalculateCommonState('commonCardObj', 'cardPageObj', fromJS(cardPageObj)))
            dispatch(changeEditCalculateCommonState('commonCardObj', 'selectThingsList', fromJS(json.data.resultList)))
            dispatch(changeEditCalculateCommonState(temp, 'projectList', fromJS(json.data.resultList)))
        }
    })

}
// 获取项目结转 项目
export const getProjectCarryoverCard = (xmObject) => (dispatch) => {
    const { oriDate,categoryUuid,level,justCard = false,needLeft = false,currentPage = 0 } = xmObject
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    if(needLeft){
        fetchApi(`getXmjzCategory`, 'GET', ``, json => {
            if (showMessage(json)) {
                dispatch(changeEditCalculateCommonState('commonCardObj', 'memberList', fromJS(json.data.typeList)))
            }
        })
    }

    if(justCard){
        fetchApi(`getXmjzCardList`, 'GET', `oriDate=${oriDate}&currentPage=${currentPage}&pageSize=${Limit.MXB_CARD_PAGE_SIZE}`, json => {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            if (showMessage(json)) {
                const cardPageObj = {
                    currentPage: json.data.currentPage ? json.data.currentPage : 1,
                    pages: json.data.pages ? json.data.pages : 1,
                    total: json.data.total ? json.data.total : 1,
                }
                dispatch(changeEditCalculateCommonState('commonCardObj', 'thingsList', fromJS(json.data.resultList)))
                dispatch(changeEditCalculateCommonState('commonCardObj', 'selectThingsList', fromJS(json.data.resultList)))
                dispatch(changeEditCalculateCommonState('ProjectCarryoverTemp', 'projectList', fromJS(json.data.resultList)))
                dispatch(changeEditCalculateCommonState('commonCardObj', 'cardPageObj', fromJS(cardPageObj)))
            }
        })
    }else{
        fetchApi(`getXmjzCardByCategory`, 'POST', JSON.stringify({
            oriDate,
            cardCategoryUuid: Number(level) === 1 ? categoryUuid : '',
            subordinateUuid: Number(level) === 1 ? '' : categoryUuid,
            currentPage,
            pageSize: Limit.MXB_CARD_PAGE_SIZE
        }), json => {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            if (showMessage(json)) {
                const cardPageObj = {
                    currentPage: json.data.currentPage ? json.data.currentPage : 1,
                    pages: json.data.pages ? json.data.pages : 1,
                    total: json.data.total ? json.data.total : 1,
                }
                dispatch(changeEditCalculateCommonState('commonCardObj', 'thingsList', fromJS(json.data.result)))
                dispatch(changeEditCalculateCommonState('commonCardObj', 'selectThingsList', fromJS(json.data.result)))
                dispatch(changeEditCalculateCommonState('ProjectCarryoverTemp', 'projectList', fromJS(json.data.result)))
                dispatch(changeEditCalculateCommonState('commonCardObj', 'cardPageObj', fromJS(cardPageObj)))
            }
        })
    }


}


// export const calculateCommonChargeAmount = (index, checked) => (dispatch, getState) => {
//     const CommonChargeTemp = getState().editCalculateState.get('CommonChargeTemp')
//     const paymentList = CommonChargeTemp.get('paymentList')
//     let amount = paymentList.size ? paymentList.reduce((total, item, i) => {
//         if (index === i) {
//             return checked ? total + Number(item.get('notHandleAmount')) : total
//         } else {
//             return item.get('beSelect') ? total + Number(item.get('notHandleAmount')) : total
//         }
//     }, 0) : 0
//     dispatch(changeEditCalculateCommonString('CommonCharge', 'amount', amount.toFixed(2)))
// }
export const changeCommonChargeProject = (oldProjectCardList) => (dispatch) => {
    let newProjectCardList = []
    oldProjectCardList.size && oldProjectCardList.map(item => {
        const uuid = item.
        get('uuid') ? item.get('uuid') : item.get('cardUuid')
        newProjectCardList.push({
            cardUuid: uuid,
            amount: item.get('amount'),
            code: item.get('code'),
            name: item.get('name'),
            percent: item.get('percent') ? item.get('percent') : '',
            propertyCost: item.get('propertyCost') ? item.get('propertyCost') : '',
        })
    })
    dispatch(changeEditCalculateCommonString('CommonCharge', 'projectCardList', fromJS(newProjectCardList)))
}

// 成本结转清空存货列表
export const initCostStockList = () => dispatch => {
    dispatch({
        type: ActionTypes.INIT_COST_STOCK_ARRAY,
    })
}
// 成本结转清空筛选条件
export const initCostCondition = (notClearItem,dealType,stockUuidList) => dispatch => {
    dispatch({
        type: ActionTypes.INIT_CATEGORY_FROM_GET_CATEGORY,
        notClearItem,
        dealType,
        stockUuidList
    })
}
// 成本结转获取存货
export const getCostCarryoverStockList = (oriDate, oriState, categoryUuid,temp='CostTransferTemp') => dispatch => {
    fetchApi('getCarryoverCard', 'GET', `oriDate=${oriDate}&oriState=${oriState}&categoryUuid=${categoryUuid}`, json => {
        if (showMessage(json)) {
            dispatch(changeEditCalculateCommonState('CostTransferTemp', 'costStockList', fromJS(json.data.cardList)))
            dispatch(changeEditCalculateCommonState(temp, 'allStockCardList', fromJS(json.data.cardList)))
            dispatch(changeEditCalculateCommonState('commonCardObj', 'thingsList', fromJS(json.data.cardList)))
        }
    })
}
//获取项目卡片+类别
export const getProjectAllCardList = (categoryList, modalName, leftNotNeed,needCommonCard=false,projectProperty = '',needIndirect,needMechanical,needAssist,needMake,currentPage = 0) => (dispatch, getState) => {
    const sobId = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'sobId'])
    dispatch({
        type: ActionTypes.SWITCH_LOADING_MASK
    })
    if (!leftNotNeed) {
        fetchApi('getProjectTreeList', 'POST', JSON.stringify({
            sobId,
            categoryList,
        }), json => {
            if (showMessage(json)) {
                dispatch(changeEditCalculateCommonState('commonCardObj', 'memberList', fromJS(json.data.typeList)))
            }
        })
    }
    fetchApi('getProjectCardList', 'POST', JSON.stringify({
        sobId,
        categoryList,
        needCommonCard,
        needIndirect,
        needMechanical,
        projectProperty,
        needAssist,
        needMake,
        currentPage,
        pageSize: Limit.MXB_CARD_PAGE_SIZE

    }), json => {
        dispatch({
            type: ActionTypes.SWITCH_LOADING_MASK
        })
        if (showMessage(json)) {
            const cardPageObj = {
                currentPage: json.data.currentPage ? json.data.currentPage : 1,
                pages: json.data.pages ? json.data.pages : 1,
                total: json.data.total ? json.data.total : 1,
            }
            dispatch(changeEditCalculateCommonState('commonCardObj', 'selectThingsList', fromJS(json.data.result)))
            dispatch(changeEditCalculateCommonState('commonCardObj', 'thingsList', fromJS(json.data.result)))
            dispatch(changeEditCalculateCommonState('commonCardObj', modalName, true))
            dispatch(changeEditCalculateCommonState('commonCardObj', 'cardPageObj', fromJS(cardPageObj)))
        }
    })
}
// 成本结转-存货
export const getCarryoverStock = (oriDate, oriState, modalName, categoryUuid, modalNameShow = true,currentPage = 0) => (dispatch, getState) => {
    dispatch({
        type: ActionTypes.SWITCH_LOADING_MASK
    })
    const insertOrModify = getState().editRunningAllState.getIn(['views','insertOrModify'])
    const oriUuid = insertOrModify === 'modify' && (oriState === 'STATE_YYSR_XS' || oriState === 'STATE_YYSR_TS') ? getState().editCalculateState.getIn(['CostTransferTemp','oriUuid']) : ''

    fetchApi('getCarryoverStockList', 'POST', JSON.stringify({
        oriState,
        oriDate,
        oriUuid,
        categoryUuid,
        cardCategoryUuid: '',
        subordinateUuid: '',
        currentPage,
        pageSize: currentPage ? Limit.MXB_CARD_PAGE_SIZE : ''
    }), json => {
        dispatch({
            type: ActionTypes.SWITCH_LOADING_MASK
        })
        if (showMessage(json)) {
            const cardPageObj = {
                currentPage: json.data.currentPage ? json.data.currentPage : 1,
                pages: json.data.pages ? json.data.pages : 1,
                total: json.data.total ? json.data.total : 1,
            }
            dispatch(changeEditCalculateCommonState('commonCardObj', modalName, modalNameShow))
            dispatch(changeEditCalculateCommonState('commonCardObj', 'selectThingsList', fromJS(json.data.result)))
            dispatch(changeEditCalculateCommonState('commonCardObj', 'thingsList', fromJS(json.data.result)))
            dispatch(changeEditCalculateCommonState('commonCardObj', 'cardPageObj', fromJS(cardPageObj)))
        }
    })
    fetchApi('getCarryoverStockTree', 'GET', `oriDate=${oriDate}&oriState=${oriState}&categoryUuid=${categoryUuid}&oriUuid=${oriUuid ? oriUuid : ''}`, json => {
        if (showMessage(json)) {
            dispatch(changeEditCalculateCommonState('commonCardObj', 'memberList', fromJS(json.data.typeList)))
        }
    })

}
//成本结转-存货
export const getCarryoverStockTypeList = (oriDate, oriState, uuid, level, categoryUuid, currentPage) => (dispatch, getState) => {
    const insertOrModify = getState().editRunningAllState.getIn(['views','insertOrModify'])
    const oriUuid = insertOrModify === 'modify' && (oriState === 'STATE_YYSR_XS' || oriState === 'STATE_YYSR_TS') ? getState().editCalculateState.getIn(['CostTransferTemp','oriUuid']) : ''
    dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
    if (level == 1) {
        fetchApi('getCarryoverStockList', 'POST', JSON.stringify({
            cardCategoryUuid: uuid,
            subordinateUuid: '',
            categoryUuid,
            oriDate,
            oriState,
            oriUuid,
            currentPage,
            pageSize: currentPage ? Limit.MXB_CARD_PAGE_SIZE : ''
        }), json => {
            dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
            if (showMessage(json)) {
                const cardPageObj = {
                    currentPage: json.data.currentPage ? json.data.currentPage : 1,
                    pages: json.data.pages ? json.data.pages : 1,
                    total: json.data.total ? json.data.total : 1,
                }
                dispatch(changeEditCalculateCommonState('commonCardObj', 'selectThingsList', fromJS(json.data.result)))
                dispatch(changeEditCalculateCommonState('commonCardObj', 'thingsList', fromJS(json.data.result)))
                dispatch(changeEditCalculateCommonState('commonCardObj', 'cardPageObj', fromJS(cardPageObj)))
            }
        })
    } else {
        fetchApi('getCarryoverStockList', 'POST', JSON.stringify({
            subordinateUuid: uuid,
            cardCategoryUuid: '',
            categoryUuid,
            oriDate,
            oriState,
            oriUuid,
            currentPage,
            pageSize: Limit.MXB_CARD_PAGE_SIZE
        }), json => {
            if (showMessage(json)) {
                dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
                const cardPageObj = {
                    currentPage: json.data.currentPage ? json.data.currentPage : 1,
                    pages: json.data.pages ? json.data.pages : 1,
                    total: json.data.total ? json.data.total : 1,
                }
                dispatch(changeEditCalculateCommonState('commonCardObj', 'selectThingsList', fromJS(json.data.result)))
                dispatch(changeEditCalculateCommonState('commonCardObj', 'thingsList', fromJS(json.data.result)))
                dispatch(changeEditCalculateCommonState('commonCardObj', 'cardPageObj', fromJS(cardPageObj)))
            }
        })
    }

}
//根据类别获取项目
export const getProjectSomeCardList = (uuid, level, oriState,currentPage = 0) => (dispatch, getState) => {
    const sobId = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'sobId'])
    let projectProperty = oriState ? 'XZ_LOSS' : '',
        needCommon = false

    switch (oriState) {
        case 'STATE_GGFYFT':
            projectProperty = 'XZ_LOSS'
            break
        case 'STATE_FZSCCB':
        case 'STATE_ZZFY':
            projectProperty = 'XZ_PRODUCE'
            needCommon = true
            break
        case 'STATE_XMJZ':
            projectProperty = 'XZ_PRODUCE'
            break
        case 'STATE_YYSR_ZJ':
            projectProperty = 'XZ_LOSS'
            needCommon = true
            break
        default:
    }
    dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
    if (level == 1) {
        fetchApi('getProjectSubordinateCardList', 'POST', JSON.stringify({
            sobId,
            categoryUuid: uuid,
            listByCategory: true,
            subordinateUuid: '',
            projectProperty,
            needCommon,
            currentPage,
            pageSize: Limit.MXB_CARD_PAGE_SIZE,
        }), json => {
            dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
            if (showMessage(json)) {
                const cardPageObj = {
                    currentPage: json.data.currentPage ? json.data.currentPage : 1,
                    pages: json.data.pages ? json.data.pages : 1,
                    total: json.data.total ? json.data.total : 1,
                }
                dispatch(changeEditCalculateCommonState('commonCardObj', 'selectThingsList', fromJS(json.data.resultList)))
                dispatch(changeEditCalculateCommonState('commonCardObj', 'thingsList', fromJS(json.data.resultList)))
                dispatch(changeEditCalculateCommonState('commonCardObj', 'cardPageObj', fromJS(cardPageObj)))
            }
        })
    } else {
        fetchApi('getProjectSubordinateCardList', 'POST', JSON.stringify({
            sobId,
            subordinateUuid: uuid,
            listByCategory: false,
            categoryUuid: uuid,
            projectProperty,
            needCommon,
            currentPage,
            pageSize: Limit.MXB_CARD_PAGE_SIZE,
        }), json => {
            dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
            if (showMessage(json)) {
                const cardPageObj = {
                    currentPage: json.data.currentPage ? json.data.currentPage : 1,
                    pages: json.data.pages ? json.data.pages : 1,
                    total: json.data.total ? json.data.total : 1,
                }
                dispatch(changeEditCalculateCommonState('commonCardObj', 'selectThingsList', fromJS(json.data.resultList)))
                dispatch(changeEditCalculateCommonState('commonCardObj', 'thingsList', fromJS(json.data.resultList)))
                dispatch(changeEditCalculateCommonState('commonCardObj', 'cardPageObj', fromJS(cardPageObj)))
            }
        })
    }
}
// 成本结转
export const changeCostCarryoverWareHouseCard = (index, changeWareHouseCard) => (dispatch) => {
    dispatch({
        type: ActionTypes.GET_COST_CARRYOVER_CANUSE_WAREHOUSE_CARD,
        index,
        changeWareHouseCard
    })
}
export const getCostTransferPrice = (oriDate,stockPriceList,oriIndex='',temp='CostTransfer',stockTemp = 'stockCardList') => (dispatch,getState) => {
    const stockCardList = getState().editCalculateState.getIn([`${temp}Temp`,stockTemp])

    const oriState = getState().editCalculateState.getIn([`${temp}Temp`,'oriState'])
    let hasCardUuid = false, postStockList = []
    stockPriceList && stockPriceList.map(item => {
        if(item.cardUuid){
            hasCardUuid = true
        }
        postStockList.push(
            {
                ...item,
                assistList: item.assistList ? item.assistList : [],
                batchUuid: item.batchUuid ? item.batchUuid : ''
            }
        )
    })
    const uuidName = temp === 'Balance' ? 'uuid' : 'cardUuid'
    hasCardUuid && dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    hasCardUuid && fetchApi('getCarryoverStockPrice', 'POST', JSON.stringify({
        oriDate,
        stockPriceList:postStockList,
        canNegate: true
    }), json => {
        dispatch({
            type: ActionTypes.SWITCH_LOADING_MASK
        })
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_COST_TRANSFER_PRICE,
                stockCardList,
                receivedData: json.data,
                stockPriceList,
                stockTemp,
                uuidName,
                oriIndex,
                temp,
            })

        }
    })
}
// export const updateStockListItem = (temp,index,valueName,value) => dispatch => {
//     dispatch({
//         type: ActionTypes.UPDATE_STOCK_LIST_ITEM,
//         temp,
//         index,
//         valueName,
//         value
//     })
// }

// 存货调拨
// 获取仓库卡片
export const getCanUseWarehouseCardList = (cardObj) => (dispatch) => {
    dispatch({
        type: ActionTypes.SWITCH_LOADING_MASK
    })
    const {
        temp = 'StockTemp',
        isUniform = false,
        inventoryUuid = '',
        uniformUuid = '',
        oriDate = '',
        conditionType = '',
        canUse = true,
        cardFrom = '',
        selectIndex = 0,
        stockCardTemp = 'countStockCardList',
    } = cardObj
    fetchApi('getCanUseCardList', 'GET', `isUniform=${isUniform}&inventoryUuid=${inventoryUuid}&uniformUuid=${uniformUuid}&oriDate=${oriDate}&conditionType=${conditionType}&canUse=${canUse}`, json => {
        dispatch({
            type: ActionTypes.SWITCH_LOADING_MASK
        })
        if (showMessage(json)) {
            // if(cardFrom === 'count' && !isUniform){
            //     dispatch({
            //         type: ActionTypes.GET_CANUSE_WAREHOUSE_CARD_CHILD_LIST,
            //         receivedData: json.data.cardList,
            //         selectIndex,
            //         stockCardTemp: 'countStockCardList',
            //         temp
            //     })
            // }else{
                dispatch({
                    type: ActionTypes.GET_CANUSE_WAREHOUSE_CARD_LIST,
                    receivedData: json.data.cardList,
                    canUseWarehouse: json.data.enableWarehouse,
                    temp,
                })
            // }

        }
    })

}
// 选择调入调出仓库
export const changeWareHouseCardList = (warehouseStatus, name, uuid) => (dispatch) => {
    dispatch({
        type: ActionTypes.CHANGE_CANUSE_WAREHOUSE_CARD_LIST,
        warehouseStatus,
        name,
        uuid
    })

}
// 获取存货卡片列表
export const getStockCardList = (temp = 'StockTemp', isUniform = false, openQuantity = false, warehouseUuid = '',currentPage = 0) => (dispatch, getState) => {
    const sobId = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'sobId'])
    const oriState = getState().editCalculateState.getIn([temp, 'oriState'])
    dispatch({
        type: ActionTypes.SWITCH_LOADING_MASK
    })
    const data = warehouseUuid ?
    {
        sobId,
        categoryList: [],
        property: '0',
        isUniform: null,
        openQuantity,
        haveQuantity:true,
        warehouseUuid,
        currentPage,
        pageSize: currentPage ? Limit.MXB_CARD_PAGE_SIZE : '',
    } :
    {
        sobId,
        categoryList: [],
        property: '0',
        isUniform: null,
        openQuantity,
        currentPage,
        pageSize: currentPage ? Limit.MXB_CARD_PAGE_SIZE : '',
    }
    fetchApi('getStockCategoryList', 'POST', JSON.stringify(data), json => {
        dispatch({
            type: ActionTypes.SWITCH_LOADING_MASK
        })
        if (showMessage(json)) {
            const cardPageObj = {
                currentPage: json.data.currentPage ? json.data.currentPage : 1,
                pages: json.data.pages ? json.data.pages : 1,
                total: json.data.total ? json.data.total : 1,
            }
            dispatch({
                type: ActionTypes.CHANGE_CANUSE_STOCK_CARD_LIST,
                receivedData: json.data.result,
                canUseWarehouse: json.data.enableWarehouse,
                temp,
                cardPageObj,
            })
        }
    })

}
// 获取存货的选择里的类别和卡片
export const getStockCardCategoryAndList = (parameterObj = {}) => (dispatch, getState) => {

    dispatch({
        type: ActionTypes.SWITCH_LOADING_MASK
    })
    const {
        isUniform = null,
        openQuantity = false,
        warehouseUuid = '',
        oriDate = '',
        haveQuantity = '',
        type = '',
        currentPage = 0,
    } = parameterObj

    const sobId = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'sobId'])
    const data = {
        oriDate,
        sobId,
        categoryList: [],
        isUniform,
        openQuantity,
        haveQuantity,
        warehouseUuid: type === 'count' ? warehouseUuid : undefined
    }


    fetchApi('getStockCardList', 'POST', JSON.stringify(data), json => {
        if (showMessage(json)) {
            dispatch(changeEditCalculateCommonState('commonCardObj', 'memberList', fromJS(json.data.typeList)))

        }
    })
    fetchApi('getStockCategoryList', 'POST', JSON.stringify({
        ...data,
        property: '0',
        pageSize: currentPage ? Limit.MXB_CARD_PAGE_SIZE : '',
        currentPage,
    }), json => {
        if (showMessage(json)) {
            const cardPageObj = {
                currentPage: json.data.currentPage ? json.data.currentPage : 1,
                pages: json.data.pages ? json.data.pages : 1,
                total: json.data.total ? json.data.total : 1,
            }
            dispatch(changeEditCalculateCommonState('commonCardObj', 'thingsList', fromJS(json.data.result)))
            dispatch(changeEditCalculateCommonState('commonCardObj', 'cardPageObj', fromJS(cardPageObj)))
        }
        dispatch({
            type: ActionTypes.SWITCH_LOADING_MASK
        })
    })
}
export const getStockSomeCardList = (parameterObj = {}) => (dispatch, getState) => {
    const {
        uuid = '',
        level = '',
        isUniform = '',
        openQuantity = '',
        warehouseUuid = '',
        haveQuantity = '',
        type = '',
        currentPage = 0,
    } = parameterObj

    const sobId = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'sobId'])

    dispatch({
        type: ActionTypes.SWITCH_LOADING_MASK
    })
    const categoryUuid = level == 1 ? uuid : ''
    const listByCategory = level == 1 ? true : false
    const subordinateUuid = level == 1 ? '' : uuid

    const data = {
        sobId,
        categoryUuid,
        subordinateUuid,
        listByCategory,
        property: '0',
        isUniform,
        openQuantity,
        haveQuantity,
        warehouseUuid: type === 'count' ? warehouseUuid : undefined,
        currentPage,
        pageSize: Limit.MXB_CARD_PAGE_SIZE
    }
    fetchApi('getRunningStockMemberList', 'POST', JSON.stringify(data), json => {
        dispatch({
            type: ActionTypes.SWITCH_LOADING_MASK
        })
        if (showMessage(json)) {
            const cardPageObj = {
                currentPage: json.data.currentPage ? json.data.currentPage : 1,
                pages: json.data.pages ? json.data.pages : 1,
                total: json.data.total ? json.data.total : 1,
            }
            dispatch(changeEditCalculateCommonState('commonCardObj', 'thingsList', fromJS(json.data.resultList)))
            dispatch(changeEditCalculateCommonState('commonCardObj', 'cardPageObj', fromJS(cardPageObj)))
        }
    })
}

export const changeItemCheckboxCheck = (checked,item, isAssembly = false, index) => ({
    type: ActionTypes.CHANGE_ITEM_CHECKBOX_CHECKED,
    checked,
    item,
    isAssembly,
    index
})
export const changeItemCheckboxCheckAll = (checked,allList,thingsList, isAssembly = false,isCardUuid = false) => dispatch => {
    const uuidName = isAssembly ? 'productUuid' : isCardUuid ? 'cardUuid' : 'uuid'
    allList.map((v,index) => {
        const item = thingsList.find(w => w.get(uuidName) === v[uuidName]).toJS()
        dispatch(changeItemCheckboxCheck(checked,item,isAssembly,index))
    })
}

export const changeSelectStock = (oldProjectCardList, temp = 'stock', stockTemplate = 'stockCardList',justNeedBefore =  false) => (dispatch, getState) => {
    let newStockCardList = []
    const editCalculateState = getState().editCalculateState
    const oriState = editCalculateState.getIn([`${temp}Temp`, 'oriState'])
    const wareHouseNoChild = editCalculateState.getIn([`${temp}Temp`, 'wareHouseNoChild'])
    const chooseWareHouseCard = editCalculateState.getIn([`${temp}Temp`, 'chooseWareHouseCard'])

    const warehouseCardUuid = chooseWareHouseCard ? chooseWareHouseCard.get('cardUuid') : ''
    const warehouseCardName = chooseWareHouseCard ? chooseWareHouseCard.get('name') : ''

    oldProjectCardList.size && oldProjectCardList.map(item => {
        const uuid = item.get('uuid') ? item.get('uuid') : item.get('cardUuid')
        const amount = item.get('amount') ? item.get('amount') : 0
        const quantity = item.get('quantity') ? item.get('quantity') : ''
        const price = item.get('price') ? item.get('price') : 0

        const beforeQuantity = item.get('beforeQuantity') ? item.get('beforeQuantity') : 0
        const beforePrice = item.get('beforePrice') ? item.get('beforePrice') : 0
        const beforeAmount = item.get('beforeAmount') ? item.get('beforeAmount') : 0

        const afterQuantity = justNeedBefore ? item.get('afterQuantity') ?item.get('afterQuantity') : '' :  numberCalculate(quantity,beforeQuantity,4,'add',4)
        const afterAmount = numberCalculate(amount,beforeAmount)
        const afterPrice = numberCalculate(afterAmount,afterQuantity,4,'divide',4)
        const needUnitName = stockTemplate === 'countStockCardList' ? true : false

        const isFromCount = (oriState === 'STATE_YYSR_ZJ' || oriState === 'STATE_CHYE_CK') && wareHouseNoChild


        newStockCardList.push({
            ...(item.toJS()),
            cardUuid: uuid,
            code: item.get('code'),
            name: item.get('name'),
            amount,
            quantity,
            price,
            isOpenedQuantity: item.get('isOpenedQuantity'),
            isUniformPrice: item.get('isUniformPrice'),
            allUnit:item.get('allUnit'),
            unit:item.get('unit'),
            referencePrice: item.get('referencePrice') ? item.get('referencePrice') : '',
            referenceQuantity: item.get('referenceQuantity') ? item.get('referenceQuantity') : '',
            beforeQuantity,
            beforePrice,
            beforeAmount,
            afterQuantity,
            afterPrice,
            afterAmount,
            basicUnitQuantity: item.get('basicUnitQuantity') ? item.get('basicUnitQuantity') : '',
            warehouseCardCode: (item.get('warehouseCardCode') ? item.get('warehouseCardCode') : ''),
            warehouseCardName: isFromCount ? warehouseCardName : (item.get('warehouseCardName') ? item.get('warehouseCardName') : ''),
            warehouseCardUuid: isFromCount ? warehouseCardUuid : (item.get('warehouseCardUuid') ? item.get('warehouseCardUuid') : ''),
            uniformUuid: item.get('uniformUuid') ? item.get('uniformUuid') : '',
            unitCardName: item.get('unitCardName') ? item.get('unitCardName') : item.get('allUnit') ? item.getIn(['allUnit','name']) : '',
            unitName: item.get('unitName') ? item.get('unitName') : item.get('allUnit') ? item.getIn(['allUnit','name']) : '',
            unitUuid: item.get('unitUuid') ? item.get('unitUuid') : item.get('allUnit') ? item.getIn(['allUnit','uuid']) : '',
        })
    })
    dispatch(changeEditCalculateCommonString(temp, stockTemplate, fromJS(newStockCardList)))
}

// 存货调拨、存货余额调整删除存货
export const deleteStockList = (stockCardList, index, dealType = 'delete', temp = 'Stock',stockTemplate = 'stockCardList') => (dispatch, getState) => {
    const editCalculateState = getState().editCalculateState
    const oriState = editCalculateState.getIn([`${temp}Temp`, 'oriState'])
    const wareHouseNoChild = editCalculateState.getIn([`${temp}Temp`, 'wareHouseNoChild'])
    const chooseWareHouseCard = editCalculateState.getIn([`${temp}Temp`, 'chooseWareHouseCard'])


    let stockCardListJ = stockCardList.toJS()
    if(dealType == 'delete'){
        stockCardListJ.splice(index,1)
        dispatch(changeEditCalculateCommonString(temp,stockTemplate,  fromJS(stockCardListJ)))
    }else{
        if((oriState === 'STATE_YYSR_ZJ' || oriState === 'STATE_CHYE_CK') && wareHouseNoChild){
            const warehouseCardName = chooseWareHouseCard.get('name')
            const warehouseCardUuid = chooseWareHouseCard.get('cardUuid')
            stockCardListJ.splice(index+1,0,{amount:'',cardUuid:'',warehouseCardName,warehouseCardUuid,afterQuantity: '',quantity: ''})
        }else{
            stockCardListJ.splice(index+1,0,{amount:'',cardUuid:'',afterQuantity: '',quantity: ''})
        }

        dispatch(changeEditCalculateCommonString(temp,stockTemplate,  fromJS(stockCardListJ)))
    }


}
export const changeMaterialList = ( index, materialIndex,materialList,dealType = 'delete') => (dispatch, getState) => {
    let materialListJ = materialList.toJS()
    if(dealType == 'delete'){
        materialListJ.splice(materialIndex,1)
        dispatch(changeEditCalculateCommonString('StockBuildUp',['assemblySheet',index,'materialList'],  fromJS(materialListJ)))
    }else{
        materialListJ.splice(materialIndex+1,0,{amount:'',materialUuid:'',isOpenQuantity: false})
        dispatch(changeEditCalculateCommonString('StockBuildUp',['assemblySheet',index,'materialList'],  fromJS(materialListJ)))
    }


}

// 存货余额调整  切换oriState清空数据
export const clearBalanceTemp = (oriState) => dispatch => {
    dispatch({
        type: ActionTypes.CLEAR_BALANCETEMP,
        oriState
    })
}
export const getBalanceUniformPrice = (cardObj) => (dispatch) => {
    dispatch({
        type: ActionTypes.SWITCH_LOADING_MASK
    })
    const {
        selectIndex,
        temp,
        stockCardTemp,
        warehouseUuid,
        ...postData
    } = cardObj
    fetchApi('getBalanceUniformPrice', 'POST', JSON.stringify({
        ...postData,
        warehouseUuid: warehouseUuid === 'all' ? '' : warehouseUuid
    }), json => {
        dispatch({
            type: ActionTypes.SWITCH_LOADING_MASK
        })
        if (showMessage(json)) {
            dispatch({
                type:ActionTypes.GET_BALANCE_UNIFORM_PRICE,
                receivedData: json.data,
                selectIndex,
                temp,
                stockCardTemp
            })
        }
    })

}

export const deleteWareHouseList = (wareHouseList, index, temp = 'Balance') => (dispatch, getState) => {
    let wareHouseListJ = wareHouseList.toJS()
    wareHouseListJ.splice(index, 1)
    dispatch(changeEditCalculateCommonString(temp, 'wareHouseList', fromJS(wareHouseListJ)))
}
export const getBalanceAdjustPrice = (oriDate, stockPriceList, listName, temp = 'Balance',isCardUuid = false, justNeedBefore = false,isFromUnitCount = false) => (dispatch, getState) => {

    const editCalculateState =  getState().editCalculateState
    const oriState = editCalculateState.getIn(['BalanceTemp', 'oriState'])
    const canUseWarehouse = getState().homeState.getIn(['data', 'userInfo','sobInfo','moduleInfo']).indexOf('WAREHOUSE') > -1
    const stockOrWarehouseCardList = editCalculateState.getIn([`${temp}Temp`,listName])
    const stockCardUuid = editCalculateState.getIn(['BalanceTemp','chooseStockCard','cardUuid'])
    const numberRound = (number,digits=2) => {return (Math.round(number * Math.pow(10, digits)) / Math.pow(10, digits)).toFixed(digits)}

    let hasCardUuid = false, postStockList = []
    stockPriceList && stockPriceList.map(item => {
        if(item.cardUuid){
            hasCardUuid = true
        }
        postStockList.push(
            {
                ...item,
                assistList: item.assistList ? item.assistList : [],
                batchUuid: item.batchUuid ? item.batchUuid : ''
            }
        )
    })
    hasCardUuid && dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    hasCardUuid && fetchApi('getCarryoverStockPrice', 'POST', JSON.stringify({
        oriDate,
        stockPriceList:postStockList,
        canNegate: true
    }), json => {
        dispatch({
            type: ActionTypes.SWITCH_LOADING_MASK
        })
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.CHANGE_BALANCE_ADJUST_PRICE,
                stockOrWarehouseCardList,
                receivedData: json.data,
                temp,
                listName,
                isCardUuid,
                canUseWarehouse,
                stockPriceList,

            })

        }
    })
}
export const changeWareHouseList = (wareHouseList, index, dealType = 'add') => (dispatch, getState) => {
    let wareHouseListJ = wareHouseList.toJS()

        if(dealType == 'delete'){
            wareHouseListJ.splice(index,1)
            dispatch(changeEditCalculateCommonString('Balance','wareHouseList',  fromJS(wareHouseListJ)))

        }else{
            wareHouseListJ.splice(index+1,0,{amount:'',uuid:'',quantity:'',price:'',beforeQuantity:'',beforeAmount:''})
            dispatch(changeEditCalculateCommonString('Balance','wareHouseList',  fromJS(wareHouseListJ)))
        }
}
export const changeCanModifyJrIndex = (encodeType,jrIndex,saveAndNew) => ({
    type:ActionTypes.CHANGE_CAN_MODIFY_JRINDEX,
    encodeType,
    jrIndex,
    saveAndNew
})

export const getAccountRunningCate = (uuid,position) => (dispatch,getState) => {
    fetchApi('getRunningDetail','GET','uuid='+uuid, json => {
        if (showMessage(json)) {
            const accountProjectRange = json.data.result.projectRange
            const accountContactsRange = json.data.result.acCost.contactsRange
            dispatch(changeEditCalculateCommonString(position,'accountProjectRange' ,fromJS(accountProjectRange)))
            dispatch(changeEditCalculateCommonString(position,'accountContactsRange' , fromJS(accountContactsRange)))
        }
    })
}

export const getAccountContactsCardList = (contactsRange,position) => (dispatch,getState) => {
    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        fetchApi('getContactsCategoryList','POST', JSON.stringify({
            sobId,
            categoryList:contactsRange.toJS(),
            property:'NEEDPAY'
        }),json => {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            if (showMessage(json)) {
                dispatch(changeEditCalculateCommonString(position,'accountContactsRangeList', fromJS(json.data.result)))
            }
        })
}

export const getAccountProjectCardList = (projectRange,position) => (dispatch,getState) => {
    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])
    fetchApi('getProjectCardList','POST',JSON.stringify({
        sobId,
        categoryList:projectRange,
        needCommonCard:true,
        needAssist:true,
        needMake:true,
        needIndirect: true,
        needMechanical: true
    }), json => {
        if (showMessage(json)) {
            dispatch(changeEditCalculateCommonString(position,'accountProjectList', fromJS(json.data.result)))
        }
    })
}
export const getCategoryMessage = ( uuid ) => (dispatch) => {
    dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
    fetchApi('getRunningDetail', 'GET', 'uuid='+uuid, json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            const data = json.data.result
            const categoryType = data.categoryType
            const propertyCarryover = data.propertyCarryover
            dispatch({
                type: ActionTypes.GET_MESSAGE_OF_CATEGORY,
                message: data
            })
            if(categoryType === 'LB_YYZC' && propertyCarryover === 'SX_FW' || categoryType === 'LB_FYZC'){
                dispatch(getJzsyProjectCardList(data.projectRange,'TaxTransferTemp',true))
            }
            if(categoryType === 'LB_YYZC' && propertyCarryover === 'SX_HW'){
                dispatch(getStockCategoryList(data.acBusinessExpense.stockRange))
                dispatch(getCanUseWarehouseCardList({temp:'TaxTransferTemp'}))
            }
            if(categoryType === 'LB_FYZC' && data.propertyCostList.length === 1){
                dispatch(changeEditCalculateCommonState('TaxTransferTemp','propertyCost',data.propertyCostList[0]))
            }else{
                dispatch(changeEditCalculateCommonState('TaxTransferTemp','propertyCost',''))
            }

        }
      })
}

export const getStockCategoryList =( categoryList, leftNeed = false, currentPage = 0) => (dispatch,getState) => {
    dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])
    if(leftNeed) {
        fetchApi('getStockCardList', 'POST', JSON.stringify({
            sobId,
            categoryList,
        }),json => {
            if (showMessage(json)) {
                dispatch(changeEditCalculateCommonState('commonCardObj','memberList', fromJS(json.data.typeList)))
            }
        })
    }
    fetchApi('getStockCategoryList', 'POST', JSON.stringify({
        sobId,
        categoryList,
        property: 5,
        currentPage,
        pageSize: currentPage ? Limit.MXB_CARD_PAGE_SIZE : ''
    }), json => {
        if (showMessage(json)) {
            const cardPageObj = {
                currentPage: json.data.currentPage ? json.data.currentPage : 1,
                pages: json.data.pages ? json.data.pages : 1,
                total: json.data.total ? json.data.total : 1,
            }
            dispatch(changeEditCalculateCommonState('commonCardObj', 'thingsList', fromJS(json.data.result)))
            dispatch(changeEditCalculateCommonState('commonCardObj', 'cardPageObj', fromJS(cardPageObj)))
        }
        dispatch({
            type: ActionTypes.SWITCH_LOADING_MASK
        })
    })
}

export const changeJxsStockList = (stockCardList,index,dealType='add',dealTypeUuid) => (dispatch, getState) => {
    const editCalculateState = getState().editCalculateState
    const editRunningAllState = getState().editRunningAllState
    const insertOrModify = editRunningAllState.getIn(['views', 'insertOrModify'])
    const oriDate = getState().editRunningState.getIn(['oriTemp', 'oriDate'])
    const oriState = editCalculateState.getIn(['TaxTransferTemp', 'oriState'])
    const canModifyList = editCalculateState.getIn(['TaxTransferTemp', 'canModifyList'])

    let stockCardListJ = stockCardList.toJS()

        if(dealType == 'delete'){
            stockCardListJ.splice(index,1)
            dispatch(changeEditCalculateCommonString('TaxTransfer','stockCardList',  fromJS(stockCardListJ)))
            if(insertOrModify === 'modify'){
                const stockCardUuidArr = []
                stockCardListJ.map(v =>{
                    stockCardUuidArr.push(v.cardUuid)
                })
                const list = canModifyList.filter(item => stockCardUuidArr.indexOf(item.get('stockCardUuid')) !== -1).toJS()
                let result = {list}
                dispatch({
                    type: ActionTypes.AFTER_GET_JXSE_STOCK_LIST,
                    receivedData: {result:list},
                    ListName: 'taxTransferList',
                    temp: 'TaxTransferTemp'
                })
            }

        }else{
            stockCardListJ.splice(index+1,0,{amount:'',cardUuid:'',name:'',code:''})
            dispatch(changeEditCalculateCommonString('TaxTransfer','stockCardList',  fromJS(stockCardListJ)))
        }



}
export const getCalaulateStockAmount = () => (dispatch,getState) => {
    const stockCardList = getState().editCalculateState.getIn(['CalculateTemp','stockCardList'])
    let amount = stockCardList.reduce((total,cur) => {
        const amount = cur.get('amount') && cur.get('amount')!=='.' ? Number(cur.get('amount')) : 0
        return  (total * 100 + amount * 100) / 100
    },0)
    dispatch(changeEditCalculateCommonString('Calculate','amount', amount.toFixed(2)))

}
export const changeCalculateStock = (stockCardList,index,dealType = 'add') => dispatch => {
    if(dealType === 'add'){
        let stockCardListJ = stockCardList.toJS()
        stockCardListJ.splice(index+1,0,{amount:'',uuid:''})
        dispatch(changeEditCalculateCommonString('Calculate','stockCardList',  fromJS(stockCardListJ)))
    }else{
        let stockCardListJ = stockCardList.toJS()
        stockCardListJ.splice(index,1)
        dispatch(changeEditCalculateCommonString('Calculate','stockCardList', fromJS(stockCardListJ)))
        dispatch(getCalaulateStockAmount())
    }
}
export const changeCalculateWareHouse = (wareHouseCardList,index,dealType = 'add') => dispatch => {
    let wareHouseCardListJ = wareHouseCardList.toJS()
    if(dealType === 'add'){
        wareHouseCardListJ.push({amount:'',uuid:'',index})
        dispatch(changeEditCalculateCommonString('ori','wareHouseCardList',  fromJS(wareHouseCardList)))
    }else{
        wareHouseCardListJ.splice(index,1)
        dispatch(changeEditCalculateCommonString('ori','wareHouseCardList', fromJS(wareHouseCardListJ)))
    }
}

export const initWriteOffType = () => ({
    type: ActionTypes.INIT_WRITE_OFF_TYPE,
})
export const clearFilterCondition = () => ({
    type: ActionTypes.CLEAR_FILTER_CONDITION,
})

// 存货组装拆卸
export const getStockBuildUpPrice = (oriDate,stockPriceList,oriIndex='',temp='StockBuildUp',type,newitem,notConcat,warehouseCards) => (dispatch,getState) => {

    const editCalculateState = getState().editCalculateState
    const stockCardList =  type === 'count' ? editCalculateState.getIn([`${temp}Temp`,'countStockCardList']) : (type === 'notFinish' ? editCalculateState.getIn([`${temp}Temp`,'stockCardList']) : editCalculateState.getIn([`${temp}Temp`,'stockCardOtherList']))
    const stockCardListName = type === 'count' ? 'countStockCardList' : (type === 'notFinish' ? 'stockCardList': 'stockCardOtherList')
    const oriState = getState().editCalculateState.getIn([`${temp}Temp`,'oriState'])

    const assemblySheet = getState().editCalculateState.getIn([`StockBuildUpTemp`,'assemblySheet'])
    const assemblySheetToJS = assemblySheet.toJS()
    let hasCardUuid = false, postStockList =[]
    stockPriceList && stockPriceList.map(item => {
        if(item.cardUuid){
            hasCardUuid = true
        }
        postStockList.push(
            {
                ...item,
                assistList: item.assistList ? item.assistList : [],
                batchUuid: item.batchUuid ? item.batchUuid : ''
            }
        )
    })

    // hasCardUuid && dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    hasCardUuid && fetchApi('getCarryoverStockPrice', 'POST', JSON.stringify({
        oriDate,
        stockPriceList:postStockList,
        canNegate: true,
    }), json => {
        // dispatch({
        //     type: ActionTypes.SWITCH_LOADING_MASK
        // })
        if (showMessage(json)) {
            let stockNameList = []

            if(type !== 'assemblySheet'){
                let newStockCardList = stockCardList.toJS()

                json.data && json.data.length && json.data.map((v,i) => {
                    const finalIndex = Number(oriIndex) + Number(i)
                    const quantity = newStockCardList[finalIndex].quantity
                    const basicUnitQuantity = newStockCardList[finalIndex].basicUnitQuantity

                    const finallyPrice = basicUnitQuantity ? numberCalculate(basicUnitQuantity,v.price,4,'multiply',4) : v.price
                    const amount = basicUnitQuantity ? numberCalculate(quantity,finallyPrice,4,'multiply') : numberCalculate(quantity,v.price,4,'multiply')


                    if(!stockPriceList[i]['noNeedPrice'] || (stockPriceList[i]['noNeedPrice'] && !stockPriceList[i]['moreUnit'])){
                        newStockCardList[finalIndex].price =  v.price > 0 ? finallyPrice : ''
                        newStockCardList[finalIndex].amount =  v.price > 0 ? amount : ''
                    }

                    newStockCardList[finalIndex].referencePrice =  v.price
                    newStockCardList[finalIndex].referenceQuantity =  v.quantity
                })
                dispatch(changeEditCalculateCommonState(`${temp}Temp`, stockCardListName, fromJS(newStockCardList)))

            }else{
                let amount = 0
                if(stockPriceList.length === 1 && !newitem){
                    assemblySheet.map((item,index) => {
                    let amount = 0
                    item.get('materialList').map((itemM,mIndex) => {
                        const quantity = itemM.get('quantity')
                        const basicUnitQuantity = itemM.get('basicUnitQuantity')
                        let positiveAmount = itemM.get('amount')
                        stockPriceList.length && stockPriceList.map((v,i) => {
                            if(itemM.get('materialUuid') === v.cardUuid && v.index === index && v.materialIndex === mIndex){
                                const finallyPrice = basicUnitQuantity ? numberCalculate(basicUnitQuantity,json.data[i].price,4,'multiply',4) : json.data[i].price
                                const positivePrice = finallyPrice > 0 ? finallyPrice : ''
                                const materialAmount = basicUnitQuantity ? numberCalculate(quantity,finallyPrice,4,'multiply') : numberCalculate(quantity,json.data[i].price,4,'multiply')
                                positiveAmount = finallyPrice > 0 ? materialAmount : ''
                                dispatch(changeEditCalculateCommonString(temp, ['assemblySheet',index,'materialList',mIndex,'price'],positivePrice ))
                                dispatch(changeEditCalculateCommonString(temp, ['assemblySheet',index,'materialList',mIndex,'amount'],positiveAmount))
                                dispatch(changeEditCalculateCommonString(temp, ['assemblySheet',index,'materialList',mIndex,'referencePrice'],json.data[i].price ))
                                dispatch(changeEditCalculateCommonString(temp, ['assemblySheet',index,'materialList',mIndex,'referenceQuantity'],json.data[i].quantity))
                            }
                        })
                        amount = numberCalculate(amount,positiveAmount)
                    })
                    dispatch(changeEditCalculateCommonString(temp, ['assemblySheet',index,'amount'], amount))
                    dispatch(changeEditCalculateCommonString(temp, ['assemblySheet',index,'price'], numberCalculate(amount,item.get('curQuantity'),4,'divide',4)))
                })

                }else{
                    let indexMap = new Map()
                    stockPriceList.length && stockPriceList.map((v,i) => {
                        if(!indexMap.has(v.parentIndex)){
                            indexMap.set(v.parentIndex,v)
                            newitem[v.parentIndex].amount = 0
                        }
                        const quantity = v.quantity
                        const basicUnitQuantity = v.basicUnitQuantity
                        let positiveAmount = v.amount
                        v.price = json.data[i].price
                        const finallyPrice = basicUnitQuantity ? numberCalculate(basicUnitQuantity,json.data[i].price,4,'multiply',4) : json.data[i].price
                        const positivePrice = finallyPrice > 0 ? finallyPrice : ''
                        const materialAmount = basicUnitQuantity ? numberCalculate(quantity,finallyPrice,4,'multiply') : numberCalculate(quantity,json.data[i].price,4,'multiply')
                        positiveAmount = finallyPrice > 0 ? materialAmount : ''

                        v.price = positivePrice
                        v.amount = positiveAmount
                        v.referencePrice = json.data[i].price
                        v.referenceQuantity = json.data[i].quantity
                        if(warehouseCards){
                            const { warehouseCardUuid, warehouseCardCode, warehouseCardName } = warehouseCards
                            v.warehouseCardUuid = warehouseCardUuid
                            v.warehouseCardCode = warehouseCardCode
                            v.warehouseCardName = warehouseCardName
                            newitem[v.parentIndex].warehouseCardUuid = warehouseCardUuid
                            newitem[v.parentIndex].warehouseCardCode = warehouseCardCode
                            newitem[v.parentIndex].warehouseCardName = warehouseCardName
                        }
                        newitem[v.parentIndex].amount = numberCalculate(newitem[v.parentIndex].amount ? newitem[v.parentIndex].amount : 0 ,v.amount)
                        newitem[v.parentIndex].price = numberCalculate(newitem[v.parentIndex].amount,newitem[v.parentIndex].curQuantity,4,'divide',4)
                    })

                    dispatch(changeEditCalculateCommonState('StockBuildUpTemp', 'assemblySheet', fromJS(notConcat ? newitem : assemblySheetToJS.concat(newitem))))

                }




            }


        }
    })
}

export const getStockBuildUpAssembly = (categoryUuid,level,leftNeed, currentPage = 0) => (dispatch,getState) => {
    dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })

    const sobId = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'sobId'])
    if(leftNeed){
        fetchApi('getStockCardList', 'POST', JSON.stringify({
            sobId,
            categoryList: []
        }), json => {
            if (showMessage(json)) {
                dispatch(changeEditCalculateCommonState('commonCardObj', 'memberList', fromJS(json.data.typeList)))

            }
        })
    }

    fetchApi('getStockBuildUpAssembly', 'GET', `listByCategory=${level === '1' ? true : false}&categoryUuid=${categoryUuid}&currentPage=${currentPage}&pageSize=${Limit.MXB_CARD_PAGE_SIZE}`, json => {
        dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
        if (showMessage(json)) {
            const cardPageObj = {
                currentPage: json.data.currentPage ? json.data.currentPage : 1,
                pages: json.data.pages ? json.data.pages : 1,
                total: json.data.total ? json.data.total : 1,
            }
            dispatch(changeEditCalculateCommonState('commonCardObj', 'thingsList', fromJS(json.data.resultList)))
            dispatch(changeEditCalculateCommonState('commonCardObj', 'cardPageObj', fromJS(cardPageObj)))
        }
    })

}

export const getAssemblyListByProduct = (uuidList,assemblyIndex) => (dispatch) => {
    dispatch({
        type: ActionTypes.SWITCH_LOADING_MASK
    })
    fetchApi('getAssemblyListByProduct', 'POST', JSON.stringify({
        uuidList,
    }), json => {
        dispatch({
            type: ActionTypes.SWITCH_LOADING_MASK
        })
        if (showMessage(json)) {
            if(!json.data || !json.data.length || !json.data[0].isAvailable){
                message.info('组装单设置已失效，无法获取物料详情')
                dispatch(changeEditCalculateCommonString('StockBuildUp', 'curItemIsAvailable' , false))
            }else{
                dispatch(changeEditCalculateCommonString('StockBuildUp', 'curItemIsAvailable' , true))
                // dispatch(changeEditCalculateCommonString('StockBuildUp', ['assemblySheet',assemblyIndex], fromJS(json.data[0])))
                dispatch(changeEditCalculateCommonString('StockBuildUp', ['assemblySheet',assemblyIndex,'oriMaterialList'], fromJS(json.data[0].materialList)))
                dispatch(changeEditCalculateCommonString('StockBuildUp', ['assemblySheet',assemblyIndex,'quantity'], fromJS(json.data[0].quantity)))
            }
        }
    })
}

// 项目结转
export const getProjectCarryoverList = (oriDate,projectUuid,oriUuid = '',projectProperty) => (dispatch,getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    fetchApi('getProjectCarryoverList', 'GET', `oriDate=${oriDate}&projectUuid=${projectUuid}&oriUuid=${oriUuid}`, json => {
        dispatch({
            type: ActionTypes.SWITCH_LOADING_MASK
        })
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.XMJZ_GET_CARRYOVER_LIST,
                receivedData: json.data,
                projectProperty
            })
        }
    })
}

// 盘点
// 获取仓库树
export const getWarehouseCardTree = (treeObject) => (dispatch) => {
    const haveQuantity = treeObject.haveQuantity
    const inventoryUuid = treeObject.inventoryUuid
    const oriDate = treeObject.oriDate
    const tempName = treeObject.tempName
    const isNeedHaveQuantity = treeObject.isNeedHaveQuantity
    const data = isNeedHaveQuantity ?
    {
        haveQuantity,
        inventoryUuid,
        oriDate
    } :
    {
        haveQuantity,
        inventoryUuid
    }
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('warehouseCardTree', 'POST', JSON.stringify(data), json => {
        dispatch({
            type: ActionTypes.SWITCH_LOADING_MASK
        })
        if (showMessage(json)) {
            let warehouseList = []
            const selectLoop = (data) => data && data.map(item => {
                if(item.childList && item.childList.length){
                    selectLoop(item.childList)
                }else{
                    warehouseList.push(item)
                }
            })
            selectLoop(json.data.cardList)
            const initChooseWareHouseCard = {
                cardUuid: json.data.cardList[0].uuid,
                name: '全部',
                isOpenedQuantity: false,
                isUniformPrice: false,
            }
            dispatch(changeEditCalculateCommonState('views', 'warehouseTreeList', fromJS(json.data.cardList)))
            dispatch(innerCalculateActions.changeEditCalculateCommonString(tempName, 'countWarehouseList', fromJS(warehouseList)))
            dispatch(innerCalculateActions.changeEditCalculateCommonString(tempName, 'chooseWareHouseCard',fromJS(initChooseWareHouseCard) ))
        }
    })

}
// 成本结转盘点-获取存货列表 /jr/manage/carryover/check/list
export const getCarryoverCheckStockList = (oriDate,oriState,categoryUuid,storeUuidList,cardUuidList) => (dispatch) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getCarryoverCheckStockList', 'POST', JSON.stringify({
        oriDate,
        oriState,
        categoryUuid,
        storeUuidList,
        cardUuidList
    }), json => {
        dispatch({
            type: ActionTypes.SWITCH_LOADING_MASK
        })
        if (showMessage(json)) {
            const cardList = json.data.cardList
            let countStockCardList = []
            cardList && cardList.length && cardList.map(v => {
                countStockCardList.push({
                    ...v,
                    unitName: v.unit.name,
                    unitUuid: v.unit.uuid
                })
            })
            dispatch(changeEditCalculateCommonState('CostTransferTemp', 'countStockCardList', fromJS(countStockCardList)))
        }
    })

}
// 获取仓库树  jr/manage/carryover/warehouse
export const getCarryoverWhareHouseTreeList = (oriDate,oriState,categoryUuid,cardUuidList,isCheck = false) => (dispatch) => {
    dispatch({
        type: ActionTypes.SWITCH_LOADING_MASK
    })
    fetchApi('getCarryoverWarehouse', 'POST', JSON.stringify({
        oriDate,
        oriState,
        categoryUuid,
        cardUuidList,
        isCheck
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_CARRYOVER_WAREHOUSE,
                receivedData: json.data,
            })
            if(isCheck){
                dispatch(changeEditCalculateCommonState('views', 'warehouseTreeList', fromJS(json.data.warehouseList[0].childList)))
            }
        }
        dispatch({
            type: ActionTypes.SWITCH_LOADING_MASK
        })
    })
}
export const saveAdjustmentEnclosure = (list,oriDate,pdfInsertFirst,cantSave = false,cantSaveCallback,oriState) => (dispatch,getState) => {
    const cardDetailList = []
    let totalAmount = 0
    list.forEach(item => {
        let {unit,...newItem} = item.toJS()
        let data = {
            ...(item.toJS()),
            warehouseCardUuid: item.get('warehouseCardUuid') === 'all' ? '' : item.get('warehouseCardUuid')
        }
        let childList = []
        if(item.get('childList') && item.get('childList').size){
            data.price = item.get('price'),
            data.amount = item.get('amount'),
            item.get('childList').forEach(v => {
                childList.push({
                    price: item.get('price'),
                    referencePrice: v.get('price'),
                    warehouseCardCode: v.get('warehouseCode'),
                    warehouseCardName: v.get('warehouseName'),
                    warehouseCardUuid: v.get('warehouseUuid') === 'all' ? '' : v.get('warehouseUuid'),
                    quantity:  v.get('quantity'),
                    amount:  v.get('amount'),
                })
                totalAmount = numberCalculate(totalAmount,v.get('amount'))

            })
            data.cardDetailList = childList
        }
        cardDetailList.push(data)
    })
    dispatch({
        type: ActionTypes.SWITCH_LOADING_MASK
    })
    fetchApi('saveAdjustmentEnclosure', 'POST', JSON.stringify({
        cardDetailList,
        oriDate,
        jrState: oriState === "STATE_CHYE_CH" ? oriState : '',
        amount: oriState === "STATE_CHYE_CH" ? totalAmount : undefined
    }), json => {
        if (showMessage(json)) {
            if(!cantSave){
                dispatch({
                    type: ActionTypes.CHANGE_ENCLOSURElIST_FILE,
                    value: json.data.enclosureList,
                    pdfInsertFirst
                })
            }else{
                cantSaveCallback(json.data.enclosureList[0].signedUrl)

            }
            dispatch(changeEditCalculateCommonState('views', 'singleUrl', fromJS(json.data.enclosureList[0].signedUrl)))
        }
        dispatch({
            type: ActionTypes.SWITCH_LOADING_MASK
        })
    })
}
export const getWarehouseLastStage = (inventoryUuidList,oriDate,stockPriceList,temp,selectIndex,fromSingle = false) => (dispatch,getState) => {
    let postStockList = []
    stockPriceList && stockPriceList.map(item => {
        postStockList.push(
            {
                ...item,
                assistList: item.assistList ? item.assistList : [],
                batchUuid: item.batchUuid ? item.batchUuid : ''
            }
        )
    })

    dispatch({
        type: ActionTypes.SWITCH_LOADING_MASK
    })
    let newCardList = []
    fetchApi('getWarehouseLastStage', 'POST', JSON.stringify({
        inventoryUuidList,
        oriDate,
    }), json => {
        if (showMessage(json)) {
            fetchApi('getCarryoverStockPrice', 'POST', JSON.stringify({
                oriDate,
                stockPriceList: postStockList,
                canNegate: true
            }), jsonPrice => {
                if (showMessage(jsonPrice)) {
                    newCardList = json.data.cardList
                    json.data.cardList.map((item,index) => {
                        jsonPrice.data && jsonPrice.data.length && jsonPrice.data.map((v,i) => {
                            if(item.inventoryUuid === v.cardUuid){
                                newCardList[index].price = v.price
                                item.childList && item.childList.map((k,j) => {
                                    newCardList[index]['childList'][j].oldAmount = k.amount
                                    const newAmount = numberCalculate(numberCalculate(v.price,k.quantity,2,'multiply'),k.amount,2,'subtract')
                                    newCardList[index]['childList'][j].amount = newAmount
                                })
                            }
                        })

                    })
                    dispatch({
                        type: ActionTypes.GET_CANUSE_WAREHOUSE_CARD_CHILD_LIST_FROM_UNIT,
                        receivedData: newCardList,
                        stockCardTemp: 'countStockCardList',
                        temp,
                    })
                }
            })


        }
        dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
    })
}
// 盘点结束

// 结转结转损益筛选
export const changeJzFilterModalCheck = (checked,uuid,allList,isAll) => ({
    type: ActionTypes.JZJZSY_CHANGE_FILTER_MODAL_CHECKED,
    checked,
    uuid,
    allList,
    isAll,
})
