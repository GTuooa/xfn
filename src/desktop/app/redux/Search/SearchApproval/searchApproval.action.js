import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.account.js'
import { toJS, fromJS } from 'immutable'

import { showMessage, jsonifyDate } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import { message } from 'antd'
import * as Limit from 'app/constants/Limit.js'
import { formatDate } from 'app/utils'
import {
    DateLib,
    numberCalculate
} from 'app/utils'
import { hideCategoryCanSelect } from 'app/containers/Config/Approval/components/common.js'
import { getCategorynameByType, receiptList } from 'app/containers/Edit/EditRunning/common/common.js'

import * as allActions from 'app/redux/Home/All/all.action'
import * as homeActions from 'app/redux/Home/home.action.js'
//附件
import { searchRunningAllActions } from 'app/redux/Search/SearchRunning/searchRunningAll.js'

// approalCalculateState
export const changeSearchRunningCalculateCommonString = (place, value) => dispatch => {
    if (typeof place === 'string') {
        dispatch({
            type: ActionTypes.CHANGE_SEARCH_RUNNING_CALCULATE_COMMON_STRING,
            place,
            value
        })
    } else {
        dispatch({
            type: ActionTypes.CHANGE_SEARCH_RUNNING_CALCULATE_COMMON_STRING,
            placeArr: place,
            value
        })
    }
}

export const getApprovalProcessList = (param, currentPage, pageSize) => (dispatch, getState) => { // 无参数表示按原有状态查询

    dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })

    const searchApprovalState = getState().searchApprovalState
    if (param.refresh === true) {
        param.searchType = searchApprovalState.getIn(['views', 'searchType'])
        param.searchContent = searchApprovalState.getIn(['views', 'searchContent'])
        param.dateType = searchApprovalState.getIn(['views', 'dateType'])
        param.beginDate = searchApprovalState.getIn(['views', 'beginDate'])
        param.endDate = searchApprovalState.getIn(['views', 'endDate'])
        param.accountingType = searchApprovalState.getIn(['views', 'accountingType'])
        param.orderField = searchApprovalState.getIn(['views', 'orderField'])
    }
    delete param.refresh

    let isAscFlag = ''
    switch (param.orderField) {
        case 'ORDER_DATE_START':
            isAscFlag = searchApprovalState.getIn(['views', 'sortByBeginDate'])
            break
        case 'ORDER_DATE_END':
            isAscFlag = searchApprovalState.getIn(['views', 'sortByEndDate'])
            break
        case 'ORDER_DEAl_TYPE':
            isAscFlag = searchApprovalState.getIn(['views', 'sortByDealtype'])
            break
        default:
    }
    param.isAsc = param.isAsc === '' || param.isAsc === undefined ? isAscFlag : param.isAsc

    fetchApi('getApprovalProcessList', 'POST', JSON.stringify({
        currentPage: currentPage || searchApprovalState.get('currentPage'),
        // pageSize: Limit.SEARCH_APPROVAL_PAGE,
        pageSize: pageSize || searchApprovalState.get('pageSize'),
        ...param
    }), json => {
        dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.AFTER_GET_APPROVAL_PROCESSLIST,
                receivedData: json.data,
                param
            })
            json.data.pageSize > 50 ? processListSum(json.data.processList, json.data.pageSize) : ''
        }
    })
}

//审批明细总长
export function processListSum(processList, pageSize) {
    let mxListsum = 0
    // let mxListLength = 0
    processList.map(v => {
        mxListsum = mxListsum + v.detailList.length
    })
    if (mxListsum > 5000) {
        thirdParty.Alert(`本次加载数据量过大，请调整每页显示数据量 (当前:${pageSize}条/页)`)
    }
}
export const getApprovalProcessDetailInfo = (id, callback, type) => (dispatch, getState) => {

    dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })

    fetchApi('getapprovalprocessdetailinfo', 'GET', `detailInfoId=${id}`, json => {

        if (showMessage(json)) {
            fetchApi('getApprovalCategoryList', 'GET', `uuid=${json.data.jrCategoryUuid}`, category => {

                dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })

                let datailList = []
                if (type !== 'switch') { // switch 表示是切换上下条，不需要更新 datailList
                    getState().searchApprovalState.get('approvalList').forEach(v => v.get('detailList').forEach(v => datailList.push(v)))
                }

                const categoryData = category.data

                if (category.code === 70001) { // 类别不存在

                    // json.data.jrCategoryType = ''
                    json.data.jrCategoryUuid = ''
                    json.data.categoryName = ''
                    json.data.beContact = false
                    json.data.beProject = false
                    json.data.contactList = []
                    json.data.projectList = []

                    // 拼接所需要的假类别数据
                    let categoryDataNew = {
                        propertyCostList: [],
                        beProject: false,
                        allProjectRange: [],
                    }
                    
                    const { categoryTypeObj } = json.data.jrCategoryType ? getCategorynameByType(json.data.jrCategoryType) : {categoryTypeObj: ''}
                    categoryDataNew[categoryTypeObj] = {
                        allContactsRange: [],
                        canManagement: false,
                        allStockRange: [],
                        stockRange: [],
                        contactsManagement: false,
                        contactsRange: []
                    }

                    dispatch({
                        type: ActionTypes.GET_APPROVAL_PROCESS_DETAIL_INFO,
                        receivedData: json.data,
                        categoryData: categoryDataNew,
                        datailList
                    })
                    callback && callback()
                    thirdParty.Alert("原关联流水类别已被删除，请重新选择类别")
                } else if (category.code === 0) {
                    if (hideCategoryCanSelect.indexOf(categoryData.categoryType) > -1) { // 内部核算的类别

                        if (categoryData.categoryType === 'LB_CHDB') {
                           
                            dispatch(getApprovalStockCardList([], 'hidecategory')) 

                            let stockPriceList = [],stockOtherPrice = [],dbWarehouseUuid=''
                            // if(categoryData.categoryType === 'LB_CHDB'){
                            //     dbWarehouseUuid = json.data.outputDepot.uuid
                            //     // json.data.jrOri.warehouseCardList.map(v => {
                            //     //     if(v.warehouseStatus === 'WAREHOUSE_STATUS_FROM'){
                            //     //         dbWarehouseUuid = v.cardUuid
                            //     //     }
                            //     // })
                            // }
                            if(json.data.stockList && json.data.stockList.length){
                                json.data.stockList.map((item,index) => {
                                    // if(categoryData.categoryType!== 'STATE_CHZZ_ZZD' && !item.childCardList){
                                        stockPriceList.push({
                                            cardUuid: item.stockUuid,
                                            // storeUuid: categoryData.categoryType !== 'LB_CHDB' ? item.warehouseCardUuid : dbWarehouseUuid
                                            storeUuid: item.depotUuid
                                        })
                                    // }
                                    // else{
                                    //     item.childCardList.map((childItem,childIndex) => {
                                    //         stockPriceList.push({
                                    //             cardUuid: childItem.cardUuid,
                                    //             storeUuid: childItem.warehouseCardUuid,
                                    //             materialIndex: childIndex,
                                    //             productIndex: index
                                    //         })
                                    //     })
                                    // }
                                })
                            }
                            // if(json.data.jrOri.stockCardOtherList && json.data.jrOri.stockCardOtherList.length){
                            //     json.data.jrOri.stockCardOtherList.map((item,index) => {
                            //         stockOtherPrice.push({
                            //             cardUuid: item.cardUuid,
                            //             storeUuid: item.warehouseCardUuid,
                            //         })
                            //     })
                            // }
                            dispatch(getSearchApprovalModifyStockPrice(json.data.jrDate, fromJS(json.data.stockList), stockPriceList)) 
                        }

                        dispatch({
                            type: ActionTypes.GET_APPROVAL_PROCESS_DETAIL_INFO,
                            receivedData: json.data,
                            categoryData,
                            datailList
                        })

                        callback && callback()
                    } else {
                         // json.data.carryoverCardList = [{}]
                        const { categoryTypeObj } = json.data.jrCategoryType ? getCategorynameByType(json.data.jrCategoryType) : {categoryTypeObj: ''}

                        if ((json.data.detailType === '预付账款' || json.data.detailType === '预收账款') && categoryData.propertyList.indexOf('GXZT_DJGL') === -1) {
                            json.data.jrCategoryUuid = ''
                            json.data.categoryName = ''
                            message.info("关联的流水类别已停用预收/付")
                        }

                        dispatch({
                            type: ActionTypes.GET_APPROVAL_PROCESS_DETAIL_INFO,
                            receivedData: json.data,
                            categoryData,
                            datailList
                        })

                        if (categoryData.beProject) {
                            const projectRange = categoryData.projectRange
                            dispatch(getApprovalProjectCardList(projectRange))
                        }
                        if (categoryData[categoryTypeObj].contactsManagement) {
                            const contactsRange = categoryData[categoryTypeObj].contactsRange
                            dispatch(getApprovalRelativeCardList(contactsRange))
                        }
                        // 存货
                        if ((categoryData.propertyCarryover === 'SX_HW' || categoryData.propertyCarryover === 'SX_HW_FW') && (json.data.detailType === '销售存货套件' || json.data.detailType === '采购存货套件')) {
                            const stockRange = categoryData[categoryTypeObj].stockRange
                            dispatch(getApprovalStockCardList(stockRange))
                        }

                        callback && callback()

                        if (categoryData.canUse === false) {
                            message.info("关联的流水类别已被停用")
                        }
                    }
                } else {
                    showMessage(json)
                }
            })
        } else {
            dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })

        }
    })
}

export const modifyApprovalProcessDetailInfo = (editRunningModalTemp, callback) => (dispatch, getState) => {

    if (editRunningModalTemp.get('jrCategoryUuid') === '') {
        return message.info('流水类别必选')
    }
    if (editRunningModalTemp.get('jrAmount') === '') {
        return message.info('金额必填')
    } else {
        if (['LB_ZZ'].indexOf(editRunningModalTemp.get('jrCategoryType')) > -1 && editRunningModalTemp.get('jrAmount') < 0) {
            return message.info('金额仅支持输入正数')
        }
    }
    if (editRunningModalTemp.getIn(['billList', 0, 'billType']) !== 'bill_other' && editRunningModalTemp.getIn(['billList', 0, 'tax']) == '') {
        return message.info('税额必填')
    }

    editRunningModalTemp = editRunningModalTemp.update('stockList', v => v.filter(w => w.get('stockUuid')))
    const stockList = editRunningModalTemp.get('stockList')
    const enableWarehouse = getState().homeState.getIn(['data', 'userInfo','sobInfo','moduleInfo']).indexOf('WAREHOUSE') > -1
    if (enableWarehouse && stockList.some(v => !v.get('depotUuid')) && editRunningModalTemp.get('jrCategoryType') !== 'LB_CHDB') {
        return message.info('仓库必选')
    }
    if (hideCategoryCanSelect.indexOf(editRunningModalTemp.get('jrCategoryType')) > -1 && stockList.some(v => !v.get('amount'))) {
        return message.info('存货金额必填')
    }
    if (stockList.some(v => v.get('unitPrice') < 0)) {
        return message.info('单价不可为负数')
    }

    if (editRunningModalTemp.get('beProject') == false) {
        editRunningModalTemp = editRunningModalTemp.set('projectList', fromJS([]))
    }

    if (editRunningModalTemp.get('beContact') == false) {
        editRunningModalTemp = editRunningModalTemp.set('contactList', fromJS([]))
    }

    if (editRunningModalTemp.get('jrCategoryType') === 'LB_CHDB') {
        let totalAmount = 0
        editRunningModalTemp.get('stockList').forEach((v, i) =>{
            totalAmount = numberCalculate(totalAmount, v.get('amount'))
        })
        editRunningModalTemp = editRunningModalTemp.set('jrAmount', totalAmount)
    }

    dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })

    fetchApi('modifyapprovalprocessdetailinfo', 'POST', JSON.stringify(editRunningModalTemp), json => {
        dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
        if (showMessage(json)) {
            dispatch(getApprovalProcessList({ refresh: true }))
            callback()
        }
    })
}

// 选择 或 切换 类别
export const changeApprovalProcessDetailInfoCategory = (categoryUuid, categoryType, categoryName, editRunningModalTemp) => (dispatch, getState) => {

    dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })

    fetchApi('getApprovalCategoryList', 'GET', `uuid=${categoryUuid}`, json => {
        dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
        if (showMessage(json)) {

            // 调整相关的数据
            const categoryData = json.data
            const { categoryTypeObj } = getCategorynameByType(categoryType)
            // 填入类别数据
            editRunningModalTemp = editRunningModalTemp.set('jrCategoryUuid', categoryUuid)
                .set('jrCategoryType', categoryType)
                .set('categoryName', categoryName)

            // 费用性质
            const propertyCostList = categoryData.propertyCostList
            if (editRunningModalTemp.get('jrCostType') === 'XSFY' || editRunningModalTemp.get('jrCostType') === 'GLFY' || editRunningModalTemp.get('jrCostType') === 'CWFY' || editRunningModalTemp.get('jrCostType') === '') { 
                if (propertyCostList.length > 0) { // 有费用性质
                    if (propertyCostList.length === 1) { // 一个费用性质
                        if (propertyCostList[0] === 'XZ_MANAGE') {
                            editRunningModalTemp = editRunningModalTemp.set('jrCostType', 'GLFY')
                        } else if (propertyCostList[0] === 'XZ_SALE') {
                            editRunningModalTemp = editRunningModalTemp.set('jrCostType', 'XSFY')
                        } else if (propertyCostList[0] === 'XZ_FINANCE') {
                            editRunningModalTemp = editRunningModalTemp.set('jrCostType', 'CWFY')
                        }
                    } else if (propertyCostList.length === 2 && editRunningModalTemp.get('jrCostType') === 'CWFY') { // 类别切换，原来是财务费用的，后来是多个的，要填一个默认值
                        editRunningModalTemp = editRunningModalTemp.set('jrCostType', 'XSFY')
                    }
                } else { // 没有费用性质
                    editRunningModalTemp = editRunningModalTemp.set('jrCostType', '')
                }
            }

            // 往来单位 
            if (categoryData[categoryTypeObj].contactsManagement) {
                const contactsRange = categoryData[categoryTypeObj].contactsRange
                dispatch(getApprovalRelativeCardList(contactsRange))
                // editRunningModalTemp = editRunningModalTemp.set('contactList', fromJS([]))
            } else {
                editRunningModalTemp = editRunningModalTemp.set('beContact', false)
                    .set('contactList', fromJS([]))
            }

            // 项目
            if (categoryData.beProject) {
                const projectRange = categoryData.projectRange
                dispatch(getApprovalProjectCardList(projectRange))
                // editRunningModalTemp = editRunningModalTemp.set('projectList', fromJS([]))
            } else {
                editRunningModalTemp = editRunningModalTemp.set('beProject', false)
                    .set('projectList', fromJS([]))

                // 如果是特殊的项目处理
                if (editRunningModalTemp.get('jrCostType') !== 'XSFY' && editRunningModalTemp.get('jrCostType') !== 'GLFY' && editRunningModalTemp.get('jrCostType') !== 'CWFY' && editRunningModalTemp.get('jrCostType') !== '') {
                    if (propertyCostList.length > 0) { // 有费用性质
                        if (propertyCostList.length === 1) { // 一个费用性质
                            if (propertyCostList[0] === 'XZ_MANAGE') {
                                editRunningModalTemp = editRunningModalTemp.set('jrCostType', 'GLFY')
                            } else if (propertyCostList[0] === 'XZ_SALE') {
                                editRunningModalTemp = editRunningModalTemp.set('jrCostType', 'XSFY')
                            } else if (propertyCostList[0] === 'XZ_FINANCE') {
                                editRunningModalTemp = editRunningModalTemp.set('jrCostType', 'CWFY')
                            }
                        } else if (propertyCostList.length === 2 && editRunningModalTemp.get('jrCostType') === 'CWFY') { // 类别切换，原来是财务费用的，后来是多个的，要填一个默认值
                            editRunningModalTemp = editRunningModalTemp.set('jrCostType', 'XSFY')
                        }
                    } else { // 没有费用性质
                        editRunningModalTemp = editRunningModalTemp.set('jrCostType', '')
                    }
                }
            }

            // 存货
            // if (categoryData.propertyCarryover === 'SX_HW') {
            if ((categoryData.propertyCarryover === 'SX_HW' || categoryData.propertyCarryover === 'SX_HW_FW') && (editRunningModalTemp.get('detailType') === '销售存货套件' || editRunningModalTemp.get('detailType') === '采购存货套件')) {
                const stockRange = categoryData[categoryTypeObj].stockRange
                dispatch(getApprovalStockCardList(stockRange))
                // editRunningModalTemp = editRunningModalTemp.set('stockList', fromJS([{}]))
            } else {
                editRunningModalTemp = editRunningModalTemp.set('stockList', fromJS([]))
            }

            dispatch({
                type: ActionTypes.CHANGE_APPROVAL_PROCESS_DETAIL_INFO_CATEGORY,
                editRunningModalTemp,
                categoryData
            })
        }
    })
}
export const changeSearchApprovalCommonString = (place, value) => ({
    type: ActionTypes.CHANGE_SEARCH_APPROVAL_COMMON_STRING,
    place,
    value
})
export const changeApprovalProcessDetailInfoCommonString = (place, value) => ({
    type: ActionTypes.CHANGE_APPROVAL_PROCESS_DETAIL_INFO_COMMON_STRING,
    place,
    value
})
export const changeApprovalProcessDetailInfoBillCommonString = (place, value) => ({
    type: ActionTypes.CHANGE_APPROVAL_PROCESS_DETAIL_INFO_BILL_COMMON_STRING,
    place,
    value
})


export const searchApprovalChangeRunningTaxRate = (value, amount) => ({
    type: ActionTypes.SEARCH_APPROVAL_CHANGE_RUNNING_TAX_RATE,
    value,
    amount
})

export const getApprovalProjectCardList = (projectRange) => (dispatch, getState) => {
    const sobId = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'sobId'])

    if (!projectRange) { // 新增时没有传入
        projectRange = getState().editRunningModalState.getIn(['categoryData', 'projectRange'])
    }

    fetchApi('getProjectCardList', 'POST', JSON.stringify({
        sobId,
        categoryList: projectRange,
        needCommonCard: true,
        needAssist:true,
        needMake:true,
        needIndirect:true,
        needMechanical:true
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.SEARCH_APPROVAL_GET_APPROVAL_PROJECT_CARD_LIST,
                receivedData: json.data.result
            })
        }
    })
}

export const getApprovalRelativeCardList = (contactsRange) => (dispatch, getState) => {

    const sobId = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'sobId'])

    if (!contactsRange) { // 新增时没有传入
        const categoryType = getState().editRunningModalState.getIn(['categoryData', 'categoryType'])
        const { categoryTypeObj } = getCategorynameByType(categoryType)
        contactsRange = getState().editRunningModalState.getIn(['categoryData', categoryTypeObj, 'contactsRange'])
    }

    fetchApi('getContactsCategoryList', 'POST', JSON.stringify({
        sobId,
        categoryList: contactsRange,
        property: 'NEEDPAY'
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.SEARCH_APPROVAL_GET_APPROVAL_CONTACT_CARD_LIST,
                receivedData: json.data.result
            })
        }
    })
}


export const getApprovalStockCardList = (stockRange, pageType) => (dispatch, getState) => {

    const sobId = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'sobId'])

    if (!stockRange) { // 新增时没有传入
        const categoryType = getState().editRunningModalState.getIn(['categoryData', 'categoryType'])
        const { categoryTypeObj } = getCategorynameByType(categoryType)
        stockRange = getState().editRunningModalState.getIn(['categoryData', categoryTypeObj, 'stockRange'])
    }

    const para = pageType == 'hidecategory' ? {
        sobId,
        isUniform: null,
        openQuantity: false,
        property: "0",
        categoryList: []
    } : {
        sobId,
        categoryList: stockRange,
        property: '5'
    }

    fetchApi('getStockCategoryList', 'POST', JSON.stringify(para), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.SEARCH_APPROVAL_GET_APPROVAL_STOCK_CARD_LIST,
                receivedData: json.data.result
            })
        }
    })

    const enableWarehouse = getState().homeState.getIn(['data', 'userInfo','sobInfo','moduleInfo']).indexOf('WAREHOUSE') > -1
    if (enableWarehouse) {
        fetchApi(`canUseWarehouseCardTree`, 'GET', '', json => {
            if (showMessage(json)) {
                dispatch({
                    type: ActionTypes.SEARCH_APPROVAL_GET_APPROVAL_WAREHOUSE_CARD_LIST,
                    receivedData: json.data.cardList
                })
            }
        })
    }
}

// 挂账
export const accountingApprovalProcessDetailInfo = (idList, accountDate, beCarryoverOut, carryoverCategoryItem, carryoverProjectCardList, propertyCost, callBack) => (dispatch, getState) => {

    if (!idList.length) {
        return message.info('请选择流水')
    }
    // if (!accountDate) {
    //     return message.info('请选择挂账日期')
    // }

    // if (beCarryoverOut && !(carryoverCategoryItem && carryoverCategoryItem.size && carryoverCategoryItem.getIn([0, 'relationCategoryUuid']))) {
    //     return message.info('请选择处理类别')
    // }
    // if (propertyCostList.size && !propertyCost) {
    //     return message.info('请选择费用性质')
    // }
    // if (usedCarryoverProject && !(carryoverProjectCardList && carryoverProjectCardList.size && carryoverProjectCardList.getIn([0, 'cardUuid']))) {
    //     return message.info('请选择项目')
    // }

    dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
    fetchApi('accountingapprovalprocessdetailinfo', 'POST', JSON.stringify({
        detailList: idList,
        date: accountDate,
        beCarryover: beCarryoverOut,
        propertyCost: propertyCost,
        relationCategoryUuid: beCarryoverOut ? carryoverCategoryItem.getIn([0, 'relationCategoryUuid']) : '',
        carryoverProjectCardList: carryoverProjectCardList,
    }), json => {
        dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
        if (showMessage(json)) {
            if (json.data.length) {
                message.info(json.data.join(';'))
            }else {
                message.success('操作成功')
            }
            callBack()
            dispatch(getApprovalProcessList({ refresh: true }))
        }
    })
}

// 支付
export const payingApprovalProcessDetailInfo = (idList, account, payData, beCarryoverOut, carryoverCategoryItem, carryoverProjectCardList, propertyCost, callback) => (dispatch, getState) => {

    if (!idList.length) {
        return message.info('请选择流水')
    }
    // if (!(account && account.get('accountUuid'))) {
    //     return message.info('请选择账户')
    // }
    // if (!payData) {
    //     return message.info('请选择付款日期')
    // }

    // if (beCarryoverOut && !(carryoverCategoryItem && carryoverCategoryItem.size && carryoverCategoryItem.getIn([0, 'relationCategoryUuid']))) {
    //     return message.info('请选择处理类别')
    // }
    // if (propertyCostList.size && !propertyCost) {
    //     return message.info('请选择费用性质')
    // }
    // if (usedCarryoverProject && !(carryoverProjectCardList && carryoverProjectCardList.size && carryoverProjectCardList.getIn([0, 'cardUuid']))) {
    //     return message.info('请选择项目')
    // }

    dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
    fetchApi('payingapprovalprocessdetailinfo', 'POST', JSON.stringify({
        account,
        detailList: idList,
        date: payData,
        beCarryover: beCarryoverOut,
        propertyCost: propertyCost,
        relationCategoryUuid: beCarryoverOut ? carryoverCategoryItem.getIn([0, 'relationCategoryUuid']) : '',
        carryoverProjectCardList: carryoverProjectCardList,
    }), json => {
        dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
        if (showMessage(json)) {
            if (json.data.length) {
                message.info(json.data.join(';'))
            } else {
                message.success('操作成功')
            }
            dispatch(getApprovalProcessList({ refresh: true }))
            callback()
        }
    })
}

// 收款
export const receiveApprovalProcessDetailInfo = (idList, payData, setAccount, needPoundage, account, receiveTotalMoney,  callback) => (dispatch, getState) => {

    if (!idList.length) {
        return message.info('请选择流水')
    }

    // if (!(account && account.get('accountUuid'))) {
    //     return message.info('请选择账户')
    // }
    // if (!payData) {
    //     return message.info('请选择收款日期')
    // }

    const approalCalculateState = getState().approalCalculateState
    const poundageCurrentCardList = approalCalculateState.get('poundageCurrentCardList')
    const poundageProjectCardList = approalCalculateState.get('poundageProjectCardList')

    if (poundageCurrentCardList.size && !poundageCurrentCardList.getIn([0, 'cardUuid'])) {
        return message.info('请选择往来单位')
    }
    if (poundageProjectCardList.size && !poundageProjectCardList.getIn([0, 'cardUuid'])) {
        return message.info('请选择项目')
    }

    dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
    fetchApi('receiveapprovalprocessdetailinfo', 'POST', JSON.stringify({
        account,
        poundageCurrentCardList,
        poundageProjectCardList,
        detailList: idList,
        date: payData,
        beCover: setAccount,
        amount: receiveTotalMoney,
        needUsedPoundage: needPoundage
    }), json => {
        dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
        if (showMessage(json)) {
            if (json.data.length) {
                message.info(json.data.join(';'))
            } else {
                message.success('操作成功')
            }
            dispatch(getApprovalProcessList({ refresh: true }))
            callback()
        }
    })
}

// 核记
export const bookKeepingApprovalProcessDetailInfo = (idList, payData, callback) => (dispatch, getState) => {

    if (!idList.length) {
        return message.info('请选择流水')
    }

    if (!payData) {
        return message.info('请选择收款日期')
    }

    const approalCalculateState = getState().approalCalculateState
    const poundageCurrentCardList = approalCalculateState.get('poundageCurrentCardList')
    const poundageProjectCardList = approalCalculateState.get('poundageProjectCardList')
    const handlingFeeType = approalCalculateState.get('handlingFeeType')
    const needUsedPoundage = approalCalculateState.get('needUsedPoundage')
    const account = approalCalculateState.get('account')

    if (poundageCurrentCardList.size && !poundageCurrentCardList.getIn([0, 'cardUuid'])) {
        return message.info('请选择往来单位')
    }
    if (poundageProjectCardList.size && !poundageProjectCardList.getIn([0, 'cardUuid'])) {
        return message.info('请选择项目')
    }

    dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
    fetchApi('bookkeepingapprovalprocessdetailinfo', 'POST', JSON.stringify({
        account,
        poundageCurrentCardList,
        poundageProjectCardList,
        detailList: idList,
        date: payData,
        needUsedPoundage,
        handlingFeeType,
    }), json => {
        dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
        if (showMessage(json)) {
            if (json.data.length) {
                message.info(json.data.join(';'))
            } else {
                message.success('操作成功')
            }
            dispatch(getApprovalProcessList({ refresh: true }))
            callback()
        }
    })
}

// 作废
export const disuseApprovalProcessDetailInfo = (idList, callback) => (dispatch, getState) => {

    if (!idList.length) {
        return message.info('请选择流水')
    }

    dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
    fetchApi('disuseapprovalprocessdetailinfo', 'POST', JSON.stringify(
        // idList
        {detailList: idList}
    ), json => {
        dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
        if (showMessage(json)) {
            if (json.data.length) {
                message.info(json.data.join(';'))
            } else {
                message.success('操作成功')
            }
            dispatch(getApprovalProcessList({ refresh: true }))
            callback()
        }
    })
}

// 撤销
export const cancelApprovalProcessDetailInfo = (idList, callback) => (dispatch, getState) => {

    if (!idList.length) {
        return message.info('请选择流水')
    }

    dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
    fetchApi('cancelapprovalprocessdetailinfo', 'POST', JSON.stringify(
        // idList
        {detailList: idList}
    ), json => {
        dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
        if (showMessage(json)) {
            if (json.data.length) {
                message.info(json.data.join(';'))
            } else {
                message.success('操作成功')
            }
            dispatch(getApprovalProcessList({ refresh: true }))
            callback()
        }
    })
}


export const getBusinessManagerModal = (item, childItem, callBack, type, actionFrom) => (dispatch, getState) => {

    dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })

    const allState = getState().allState
    const hideCategoryList = allState.get('hideCategoryList')
    if (!hideCategoryList.size) {
        return message.info('设置数据未加载完全，请刷新')
    }
    const categoryUuidOut = hideCategoryList.find(v => v.get('categoryType') === 'LB_SFGL').get('uuid')
    // const jrJvUuid = childItem.get('jrOriUuid')
    const jrJvUuid = childItem.get('jrJvUuid')
    const uuid = childItem.get('jrOriUuid')
    // const jrJvUuid = childItem.get('jrJvUuid')
    // const uuid = item.get('oriUuid')
    const categoryUuid = item.get('jrCategoryUuid')
    const oriDate = childItem.get('oriDate') ? childItem.get('oriDate').substr(0, 10) : ''
    const beOpened = false

    if (!uuid) {
        dispatch(allActions.sendMessageToDeveloper({
            title: '获取单条流水',
            message: 'oriUuid不存在，function:getBusinessManagerModal',
            remark: '单笔流水核销',
        }))
    }
    fetchApi('getJrOri', 'GET', `oriUuid=${uuid}`, json => {
        dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
        if (showMessage(json)) {
            const { notHandleAmount, oriState } = json.data.jrOri
            if (notHandleAmount < 0) {
                type = type === 'debit' ? 'credit' : 'debit'
                if (oriState === 'STATE_YYWSR') {
                    type = 'credit'
                }
            } else {
                type = type === 'credit' && oriState !== 'STATE_YYZC_TG' && oriState !== 'STATE_YYZC_DJ' && oriState !== 'STATE_FY_DJ' && oriState !== 'STATE_SF_YJZZS' ? 'credit' : 'debit'

            }

            let runningFlowTemp = fromJS({ ...json.data.jrOri, ...json.data.category }).set('magenerType', type).set('actionFrom', actionFrom)
            let modalTemp = fromJS({ oriDate: formatDate().substr(0, 10) }).set('pendingManageDto', fromJS({ categoryUuid, pendingManageList: [{ uuid: jrJvUuid, beOpened, oriDate }] }))
                .set('amount', Math.abs(json.data.jrOri.notHandleAmount))
                .set('oriAbstract', '核销账款')
                .set('beOpened', beOpened)
                .set('categoryUuid', categoryUuidOut)
            dispatch({
                type: ActionTypes.BEFORE_INSERT_APPROVAL_CALCULATE,
                runningFlowTemp,
                modalTemp
            })

            callBack()
        }

    })
}

export const getBusinessGrantModal = (item, childItem, callBack) => (dispatch, getState) => {
    dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })

    const uuid = childItem.get('jrOriUuid')

    fetchApi('getJrOri', 'GET', `oriUuid=${uuid}`, json => {
        dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })

        if (showMessage(json)) {
            const data = { ...json.data.jrOri, ...json.data.category }
            const amount = (childItem.get('jrAmount') - (childItem.get('tax') || 0)).toFixed(2)
            const type = data.notHandleAmount < 0 ? 'debit' : 'credit'
            data.magenerType = type

            let runningFlowTemp = fromJS(data)
            let modalTemp = fromJS({
                oriDate: formatDate().substr(0, 10),
                oriState: 'STATE_XC_FF',
                categoryUuid: data.categoryUuid,
                oriAbstract: { SX_GZXJ: '发放工资薪金', SX_FLF: `支付${data.categoryName}`, SX_QTXC: `发放${data.categoryName}` }[data.propertyPay],
                amount: Math.abs(data.notHandleAmount),
                payment: {
                    actualAmount: Math.abs(data.notHandleAmount)
                },
                pendingStrongList: [{
                    jrJvUuid: childItem.get('jrJvUuid'),
                    jrIndex: data.jrIndex,
                    oriDate: item.get('oriDate'),
                    beSelect: true,
                    amount
                }]
            })

            const toDay = formatDate().substr(0,10)
            if (data.oriDate > toDay) {
                modalTemp = modalTemp.set('oriDate', data.oriDate)
                // dispatch(changeCxAccountCommonOutString(['modalTemp','oriDate'],data.oriDate))
            }

            dispatch({
                type: ActionTypes.BEFORE_INSERT_APPROVAL_CALCULATE,
                runningFlowTemp,
                modalTemp
            })

            callBack()
        }
    })
}

export const getBusinessTakeBackModal = (item,childItem,callBack,type, actionFrom) => (dispatch,getState) => {

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const uuid = childItem.get('jrOriUuid')

    fetchApi('getJrOri', 'GET', `oriUuid=${uuid}`, json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {

            const data = {...json.data.jrOri,...json.data.category}
            const amount = (childItem.get('jrAmount') - (childItem.get('tax') || 0)).toFixed(2)

            let runningFlowTemp = fromJS(data).set('magenerType', type).set('actionFrom', actionFrom)
            let modalTemp = fromJS({
                oriDate: formatDate().substr(0, 10),
                oriState: 'STATE_ZF_SH',
                categoryUuid: data.categoryUuid,
                oriAbstract: '暂付款收回',
                amount: data.notHandleAmount,
                pendingStrongList: [{
                    jrJvUuid:childItem.get('jrJvUuid'),
                    jrIndex:data.jrIndex,
                    oriDate:item.get('oriDate'),
                    beSelect:true,
                    amount
                }]
            })

            const toDay = formatDate().substr(0,10)
            if (data.oriDate > toDay) {
                modalTemp = modalTemp.set('oriDate', data.oriDate)
            }

            dispatch({
                type: ActionTypes.BEFORE_INSERT_APPROVAL_CALCULATE,
                runningFlowTemp,
                modalTemp
            })

            callBack()
        }
    })
}

export const getBusinessBackModal = (item,childItem,callBack,type, actionFrom) => (dispatch,getState) => {

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const uuid = childItem.get('jrOriUuid')

    fetchApi('getJrOri', 'GET', `oriUuid=${uuid}`, json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            const data = {...json.data.jrOri,...json.data.category}
            const amount = (childItem.get('jrAmount') - (childItem.get('tax') || 0)).toFixed(2)

            let runningFlowTemp = fromJS(data).set('magenerType', type).set('actionFrom', actionFrom)
            let modalTemp = fromJS({
                oriDate: formatDate().substr(0, 10),
                oriState: 'STATE_ZS_TH',
                categoryUuid: data.categoryUuid,
                oriAbstract: '暂收款退还',
                amount: data.notHandleAmount,
                pendingStrongList: [{
                    jrJvUuid:childItem.get('jrJvUuid'),
                    jrIndex:data.jrIndex,
                    oriDate:item.get('oriDate'),
                    beSelect:true,
                    amount
                }]
            })

            const toDay = formatDate().substr(0,10)
            if (data.oriDate > toDay) {
                modalTemp = modalTemp.set('oriDate', data.oriDate)
            }

            dispatch({
                type: ActionTypes.BEFORE_INSERT_APPROVAL_CALCULATE,
                runningFlowTemp,
                modalTemp
            })
            
            callBack()
        }
    })
}

export const insertRunningManagerModal = (callBack, categoryTypeObj, fromcalCultion) => (dispatch, getState) => {
    const approalCalculateState = getState().approalCalculateState
    const runningFlowTemp = approalCalculateState.get('runningFlowTemp')
    const modalTemp = approalCalculateState.get('modalTemp')
    const oriDate = modalTemp.get('oriDate')
    const oriAbstract = modalTemp.get('oriAbstract')
    const accounts = modalTemp.get('accounts')
    const amount = modalTemp.get('amount')
    const categoryUuid = modalTemp.get('categoryUuid')
    const pendingManageDto = modalTemp.get('pendingManageDto').toJS()
    const poundageCurrentCardList = modalTemp.get('poundageCurrentCardList') || fromJS([])
    const poundageProjectCardList = modalTemp.get('poundageProjectCardList') || fromJS([])
    const needUsedPoundage = modalTemp.get('needUsedPoundage')
    const currentCardList = runningFlowTemp.get('currentCardList').toJS()
    // 附件
    const enclosureList = getState().searchRunningAllState.get('enclosureList')

    if (oriAbstract.length>45) {
        message.info('摘要不得大于45个字')
        return
    }

    dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
    // 判断是收入，支出，收入退 还是 支出退
    const magenerType = runningFlowTemp.get('magenerType')
    const actionFrom = runningFlowTemp.get('actionFrom')
    let fromPageType = ''
    if (magenerType === 'debit') {
        if (actionFrom === 'shouldReturn') {
            fromPageType = 'QUERY_PROCESS-QUICK_OPERATION-PAYMENT_REFUND'
        } else {
            fromPageType = 'QUERY_PROCESS-QUICK_OPERATION-COLLECTION'
        }
    } else if (magenerType === 'credit') {
        if (actionFrom === 'shouldReturn') {
            fromPageType = 'QUERY_PROCESS-QUICK_OPERATION-INCOME_REFUND'
        } else {
            fromPageType = 'QUERY_PROCESS-QUICK_OPERATION-PAYMENT'
        } 
    }

    fetchApi('insertPaymentManage', 'POST', JSON.stringify({
        oriDate,
        oriAbstract,
        accounts,
        amount,
        pendingManageDto,
        categoryUuid,
        currentCardList,
        moedAmount: '',
        enclosureList,
        needUsedPoundage,
        poundageCurrentCardList,
        poundageProjectCardList,
        action: fromPageType,
    }), json => {
        dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
        if (showMessage(json, 'show')) {
            callBack()
            dispatch(changeSearchRunningCalculateCommonString('modalTemp', fromJS({ oriDate: formatDate().substr(0, 10) })))
            dispatch(searchRunningAllActions.clearEnclosureList())
            dispatch(getApprovalProcessList({ refresh: true }))
        }
    })
}

export const insertCommonModal = (callBack,categoryTypeObj,fromcalCultion,url) => (dispatch,getState) => {
    const searchRunningState = getState().approalCalculateState
    const runningFlowTemp = searchRunningState.get('runningFlowTemp')
    const modalTemp = searchRunningState.get('modalTemp').toJS()
    if (modalTemp.oriAbstract.length>45) {
        message.info('摘要不得大于45个字')
        return
    }
    // 附件
    const enclosureList = getState().searchRunningAllState.get('enclosureList')
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi(url, 'POST', JSON.stringify({
        ...modalTemp,
        enclosureList
    }),json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            if(showMessage(json,'show')) {
                callBack()
                dispatch(changeSearchRunningCalculateCommonString('modalTemp', fromJS({ oriDate: formatDate().substr(0, 10) })))
                dispatch(searchRunningAllActions.clearEnclosureList())
                dispatch(getApprovalProcessList({ refresh: true }))
          }
  })
}

export const searchApproalBillchange = (billState) => (dispatch, getState) => {
    const editRunningModalState = getState().editRunningModalState
    const allState = getState().allState
    const taxRateTemp = allState.get('taxRate')
    const outputRate = taxRateTemp.get('outputRate')
    const payableRate = taxRateTemp.get('payableRate')
    const scale = taxRateTemp.get('scale')
    const amount = editRunningModalState.getIn(['editRunningModalTemp', 'jrAmount']) || 0
    let taxRate
    if (scale === 'general') {
        taxRate = outputRate
    } else {
        taxRate = payableRate
    }
    let tax = (Number(amount) / (1 + Number(taxRate) / 100) * Number(taxRate) / 100).toFixed(2)
    dispatch({
        type: ActionTypes.CHANGE_SEARCH_APPROAL_EDIT_BILL_STATES,
        billState,
        taxRate,
        tax
    })
}

export const clearSearchApprovalTemp = () => ({
    type: ActionTypes.CLEAR_SEARCH_APPROVAL_TEMP,
})

export const changeSearchApprovalString = (tab, place, value) => (dispatch) => {
    let placeArr = typeof place === 'string'?[`${tab}`,place]:[`${tab}`, ...place]
    if (place[0] === 'flags') {placeArr = place}
    dispatch({
        type: ActionTypes.CHANGE_SEARCH_APPROVAL_STRING,
        tab,
        placeArr,
        value
    })
}

export const autoCalculateStockAmount = () => (dispatch,getState) => {
    const stockList = getState().editRunningModalState.getIn(['editRunningModalTemp','stockList'])
    let amount = stockList.reduce((total,cur) => {
        const amount = cur.get('amount') && cur.get('amount')!=='.' ? Number(cur.get('amount')) : 0
        return  (total * 100 + amount * 100) / 100
    },0)
    dispatch(changeSearchApprovalString('editRunningModalTemp','jrAmount', amount.toFixed(2)))
}

export const deleteSearchApprovalStock = (stockCardList, index, taxRate) => dispatch => {
    let stockCardListJ = stockCardList.toJS()
    stockCardListJ.splice(index,1)
    dispatch(changeSearchApprovalString('editRunningModalTemp','stockList', fromJS(stockCardListJ)))
    dispatch(autoCalculateStockAmount())
    taxRate && dispatch(searchApprovalChangeRunningTaxRate(taxRate))
}

export const deleteSearchApprovalCarrayover = (carryoverCardList, index) => dispatch => {
    let carryoverCardListJ = carryoverCardList.toJS()
    carryoverCardListJ.splice(index,1)
    dispatch(changeSearchApprovalString('editRunningModalTemp','carryoverCardList', fromJS(carryoverCardListJ)))
}

export const addSearchApprovalStock = (stockCardList,index) => dispatch => {
    let stockCardListJ = stockCardList.toJS()
    stockCardListJ.splice(index+1,0,{amount:'',stockUuid:''})
    dispatch(changeSearchApprovalString('editRunningModalTemp','stockList',  fromJS(stockCardListJ)))
}
export const addSearchApprovalCarrayover = (carryoverCardList,index) => dispatch => {
    let carryoverCardListJ = carryoverCardList.toJS()
    carryoverCardListJ.push({amount:'',stockUuid:'',index})
    dispatch(changeSearchApprovalString('editRunningModalTemp','carryoverCardList',  fromJS(carryoverCardListJ)))
}

// 获取存货的选择里的类别和卡片
export const getInventoryAllCardList = (categoryList, pageType, leftNotNeed) => (dispatch,getState) => {

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])

    if(!leftNotNeed) {
        fetchApi('getStockCardList', 'POST', JSON.stringify({
            sobId,
            categoryList,
        }),json => {
            if (showMessage(json)) {
                dispatch(changeSearchRunningCalculateCommonString('MemberList', fromJS(json.data.typeList)))
            }
        })
    }

    const para = pageType == 'hidecategory' ? {
        sobId,
        isUniform: null,
        openQuantity: false,
        property: "0",
        categoryList: []
    } : {
        sobId,
        categoryList,
        property: '5'
    }
    
    fetchApi('getStockCategoryList', 'POST', JSON.stringify(para),json => {
        if (showMessage(json)) {

            dispatch(changeSearchRunningCalculateCommonString('selectThingsList', fromJS(json.data.result)))
            dispatch(changeSearchRunningCalculateCommonString('thingsList', fromJS(json.data.result)))

            dispatch(changeSearchRunningCalculateCommonString(['views', 'showStockModal'], true))
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}


// 存货选择框里选择类别下的卡片
export const getInventorySomeCardList = (uuid,level) =>  (dispatch,getState) => {
    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])

    if (level == 1) {
        fetchApi('getRunningStockMemberList','POST', JSON.stringify({
            sobId,
            categoryUuid: uuid,
            listByCategory: true,
            subordinateUuid: '',
            property: '5'
        }), json => {
            if (showMessage(json)) {
                dispatch(changeSearchRunningCalculateCommonString('thingsList', fromJS(json.data.resultList)))
                dispatch(changeSearchRunningCalculateCommonString('selectThingsList', fromJS(json.data.resultList)))
            }
        })
    } else {
        fetchApi('getRunningStockMemberList', 'POST', JSON.stringify({
            sobId,
            subordinateUuid: uuid,
            listByCategory: false,
            categoryUuid: '',
            property: '5',
        }),json => {
            if (showMessage(json)) {
                dispatch(changeSearchRunningCalculateCommonString('thingsList', fromJS(json.data.resultList)))
                dispatch(changeSearchRunningCalculateCommonString('selectThingsList', fromJS(json.data.resultList)))
            }
        })
    }
}

export const chargeSearchApprovalItemCheckboxCheck = (checked,uuid,code,name,isOpenQuantity,unitPriceList=[],unit={unitList:[]}) => ({
    type: ActionTypes.CHARGE_SEARCH_APPROVAL_ITEM_CHECKBOX_CHECK,
    checked,
    uuid,
    name,
    code,
    isOpenQuantity,
    unitPriceList,
    unit
})

export const chargeSearchApprovalItemCheckboxCheckAll =  (checked,allList,thingsList) => dispatch => {
    allList.map(v => {
        const item = thingsList.find(w => w.get('uuid') === v.uuid).toJS()
        const { uuid, code, name, isOpenQuantity, unitPriceList, unit } = item
        dispatch(chargeSearchApprovalItemCheckboxCheck(checked,uuid, code, name, isOpenQuantity, unitPriceList, unit))
    })
}

export const changeSearchApprovalCommonChargeInvnetory = (oldInventoryCardList, selectItem) => (dispatch, getState) => {
    let newSelectItem = selectItem.toJS()
    
     newSelectItem = newSelectItem.map((item,i) => {
        item.stockUuid = item.uuid
        item.stockCode = item.code
        item.stockName = item.name
        if (item.unitPriceList && item.unitPriceList.length) {
            let unitUuid = '', unitName = ''
            if (item.unit.uuid === item.unitPriceList[0].unitUuid) {
                unitName = item.unit.name
                unitUuid = item.unit.uuid
            } else {
                item.unit.unitList.map(v => {
                    if (v.uuid === item.unitPriceList[0].unitUuid) {
                        unitName = v.name
                        unitUuid = v.uuid
                    }
                })
            }
            Object.assign(item,{
                    unitPrice:item.unitPriceList[0].defaultPrice,
                    unitUuid:unitUuid,
                    unitName:unitName
                })
        } else if (item.unit && !item.unit.unitList.length) {
            Object.assign(item,{
                unitUuid:item.unit.uuid,
                unitName:item.unit.name
            })
        }
        return item
    })
    
    dispatch(changeSearchApprovalString('editRunningModalTemp', 'stockList', oldInventoryCardList.concat(fromJS(newSelectItem))))
    // dispatch(changeLrAccountCommonString('editRunningModalTemp', 'carryoverCardList', fromJS(oldInventoryCardList.concat(fromJS(newSelectItem)))))
}
export const getSearchApprovalAccountRunningCate = (uuid) => (dispatch,getState) => {
    fetchApi('getRunningDetail','GET','uuid='+uuid, json => {
        if (showMessage(json)) {
            const accountProjectRange = json.data.result.projectRange
            const accountContactsRange = json.data.result.acCost.contactsRange
            
            dispatch(changeSearchRunningCalculateCommonString(['views', 'accountProjectRange'] ,fromJS(accountProjectRange)))
            dispatch(changeSearchRunningCalculateCommonString(['views', 'accountContactsRange'], fromJS(accountContactsRange)))
        }
    })
}

export const getSearchApprovalCarryoverCategory = (oriDate) => (dispatch, getState) => {
    dispatch({
        type: ActionTypes.SWITCH_LOADING_MASK
    })
    
    fetchApi('getCarryoverCategory', 'POST', JSON.stringify({
        oriDate,
        oriState:'STATE_YYSR_ZJ',
    }), json => {
        if (showMessage(json)) {
            dispatch(changeSearchRunningCalculateCommonString('carryoverCategoryList', fromJS(json.data.categoryList)))
            // dispatch(changeLrAccountCommonString('',['flags','carryoverCategoryList'], fromJS(json.data.categoryList)))
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

export const getSearchApprovalCarrayProjectCardList = (projectRange, callBack) => (dispatch,getState) => {
    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getProjectCardList','POST',JSON.stringify({
        sobId,
        categoryList: projectRange,
        needCommonCard: true,
        needAssist: true,
        needMake: true,
        needIndirect: true,
        needMechanical: true
    }), json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            const projectList = getState().editRunningModalState.getIn(['editRunningModalTemp', 'projectList'])

            // if (projectList.size > 0 && json.data.result.some(v => v.uuid === projectList.getIn([0,'uuid']))) {             
            if (projectList.size > 0) { 
                const projectItem = json.data.result.find(v => v.uuid === projectList.getIn([0,'uuid']))
                if (projectItem) {

                    if (projectItem.projectProperty === 'XZ_CONSTRUCTION') {
                        if (projectItem.code === 'INDIRECT') {
                            dispatch(changeSearchRunningCalculateCommonString('propertyCost', 'XZ_JJFY'))
                        } else if (projectItem.code === 'MECHANICAL') {
                            dispatch(changeSearchRunningCalculateCommonString('propertyCost', 'XZ_JXZY'))
                        } else {
                            dispatch(changeSearchRunningCalculateCommonString('propertyCost', 'XZ_HTCB'))
                        }
                    } else if (projectItem.projectProperty === 'XZ_PRODUCE') {
                        if (projectItem.code === 'ASSIST') {
                            dispatch(changeSearchRunningCalculateCommonString('propertyCost', 'XZ_FZSCCB'))
                        } else if (projectItem.code === 'MAKE') {
                            dispatch(changeSearchRunningCalculateCommonString('propertyCost', 'XZ_ZZFY'))
                        } else {
                            dispatch(changeSearchRunningCalculateCommonString('propertyCost', 'XZ_SCCB'))
                        }
                    } 
                    const cardUuid = projectList.getIn([0,'uuid'])
                    const name = projectList.getIn([0,'name'])
                    const code = projectList.getIn([0,'code'])
                    dispatch(changeSearchRunningCalculateCommonString('carryoverProjectCardList', fromJS([{ cardUuid, name, code}])))
                    dispatch(changeSearchRunningCalculateCommonString('usedCarryoverProject', true))
                }
            } else {
                dispatch(changeSearchRunningCalculateCommonString('usedCarryoverProject', false))
                dispatch(changeSearchRunningCalculateCommonString('carryoverProjectCardList', fromJS([{}])))
            }
            
            // dispatch(changeSearchRunningCalculateCommonString('usedCarryoverProject', false))
            dispatch(changeSearchRunningCalculateCommonString('carryoverProjectList', fromJS(json.data.result)))
        }
    })
}

export const getApprovalProcessCanDeleteList = (idList, callBack) => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('processlistdeletedinstance','POST',JSON.stringify(
        idList
    ), json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_APPROVAL_PROCESS_CAN_DELETE_LIST,
                receivedData: json.data
            })
            callBack()
        }
    })
}

export const deleteApprovalProcess = (idList, callBack) => (dispatch, getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('deleteprocesslist', 'POST', JSON.stringify(idList), json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            if (json.data && json.data.length) {
                message.info(json.data.join(';'))
            }
            dispatch(getApprovalProcessList({ refresh: true }))
            callBack()
        }
    })
}

// 存货组装拆卸
export const getApprovalStockBuildUpPrice = (oriDate, stockPriceList, oriIndex='', temp='StockBuildUp', type) => (dispatch,getState) => {

    const editRunningModalState = getState().editRunningModalState
    const stockCardList = editRunningModalState.getIn(['editRunningModalTemp', 'stockList'])
    const stockCardListName = 'stockCardList'
    // const stockCardList =  type === 'count' ? editRunningModalState.getIn([`${temp}Temp`,'countStockCardList']) : (type === 'notFinish' ? editCalculateState.getIn([`${temp}Temp`,'stockCardList']) : editCalculateState.getIn([`${temp}Temp`,'stockCardOtherList']))
    // const stockCardListName = type === 'count' ? 'countStockCardList' : (type === 'notFinish' ? 'stockCardList': 'stockCardOtherList')
    // const oriState = getState().editCalculateState.getIn([`${temp}Temp`,'oriState'])

    // const assemblySheet = getState().editCalculateState.getIn([`StockBuildUpTemp`,'assemblySheet'])
    let hasCardUuid = false
    stockPriceList && stockPriceList.map(item => {
        if(item.cardUuid){
            hasCardUuid = true
        }
    })

    hasCardUuid && dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    hasCardUuid && fetchApi('getCarryoverStockPrice', 'POST', JSON.stringify({
        oriDate,
        stockPriceList,
        canNegate: true,
    }), json => {
        dispatch({
            type: ActionTypes.SWITCH_LOADING_MASK
        })
        if (showMessage(json)) {
            let stockNameList = []

            if(type !== 'assemblySheet'){
                stockCardList.map((item,index) => {

                    const quantity = item.get('number')
                    const basicUnitQuantity = item.get('basicUnitQuantity')

                    json.data && json.data.length && json.data.map((v,i) => {
                        if(item.get('stockUuid') === v.cardUuid && oriIndex + i === index){

                            const finallyPrice = basicUnitQuantity ? numberCalculate(basicUnitQuantity,v.price,4,'multiply',4) : v.price
                            const amount = basicUnitQuantity ? numberCalculate(quantity,finallyPrice,4,'multiply') : numberCalculate(quantity,v.price,4,'multiply')

                            if(!stockPriceList[i]['noNeedPrice'] || (stockPriceList[i]['noNeedPrice'] && !stockPriceList[i]['moreUnit'])){
                                dispatch(changeSearchApprovalString('editRunningModalTemp', ['stockList',index,'unitPrice'], v.price > 0 ? finallyPrice : ''))
                                dispatch(changeSearchApprovalString('editRunningModalTemp', ['stockList',index,'amount'], v.price > 0 ? amount : ''))
                            }
                            dispatch(changeSearchApprovalString('editRunningModalTemp', ['stockList',index,'referencePrice'], v.price))
                            dispatch(changeSearchApprovalString('editRunningModalTemp', ['stockList',index,'referenceQuantity'], v.quantity))

                        }
                    })

                })
            }else{
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
            }


        }
    })
}

export const changeSearchApprovalhideCategoryItemCheckboxCheck = (checked,item, isAssembly = false, index) => ({
    type: ActionTypes.CHANGE_SEARCH_APPROVAL_HIDE_CATEGORY_ITEM_CHECKBOX_CHECK,
    checked,
    item,
    isAssembly,
    index
})

export const changeSearchApprovalhideCategoryItemCheckboxCheckAll = (checked, allList, thingsList, isAssembly = false, isCardUuid = false) => dispatch => {
    // const uuidName = isAssembly ? 'productUuid' : isCardUuid ? 'cardUuid' : 'uuid'
    // allList.map((v,index) => {
    //     const item = thingsList.find(w => w.get(uuidName) === v[uuidName]).toJS()
    //     dispatch(changeItemCheckboxCheck(checked,item,isAssembly,index))
    // })
    dispatch({
        type: ActionTypes.CHANGE_SEARCH_APPROVAL_HIDE_CATEGORY_ITEM_CHECKBOX_CHECK_ALL,
        checked,
        allList,
        thingsList,
        isAssembly,
        isCardUuid
    })
}

export const changeSelectStock = (oldProjectCardList, temp = 'stock', stockTemplate = 'stockCardList',justNeedBefore =  false) => (dispatch, getState) => {

    let newStockCardList = []
    const editRunningModalState = getState().editRunningModalState
    // const stockCardList = editRunningModalState.getIn(['editRunningModalTemp', 'stockList'])
    // const oriState = editCalculateState.getIn([`${temp}Temp`, 'oriState'])
    // const wareHouseNoChild = editCalculateState.getIn([`${temp}Temp`, 'wareHouseNoChild'])
    // const chooseWareHouseCard = editCalculateState.getIn([`${temp}Temp`, 'chooseWareHouseCard'])

    // const warehouseCardUuid = chooseWareHouseCard ? chooseWareHouseCard.get('cardUuid') : ''
    // const warehouseCardName = chooseWareHouseCard ? chooseWareHouseCard.get('name') : ''

    oldProjectCardList.size && oldProjectCardList.map(item => {
        const amount = item.get('amount') ? item.get('amount') : 0
        const number = item.get('number') ? item.get('number') : ''
        const unitPrice = item.get('unitPrice') ? item.get('unitPrice') : 0

        // const beforeQuantity = item.get('beforeQuantity') ? item.get('beforeQuantity') : 0
        // const beforePrice = item.get('beforePrice') ? item.get('beforePrice') : 0
        // const beforeAmount = item.get('beforeAmount') ? item.get('beforeAmount') : 0

        // const afterQuantity = justNeedBefore ? item.get('afterQuantity') ?item.get('afterQuantity') : '' :  numberCalculate(quantity,beforeQuantity,4,'add',4)
        // const afterAmount = numberCalculate(amount,beforeAmount)
        // const afterPrice = numberCalculate(afterAmount,afterQuantity,4,'divide',4)
        // const needUnitName = stockTemplate === 'countStockCardList' ? true : false

        // const isFromCount = (oriState === 'STATE_YYSR_ZJ' || oriState === 'STATE_CHYE_CK') && wareHouseNoChild
        const isFromCount = false


        newStockCardList.push({
            ...(item.toJS()),
            stockUuid: item.get('stockUuid') ? item.get('stockUuid') : item.get('uuid'),
            stockCode: item.get('stockCode') ? item.get('stockCode') : item.get('code'),
            stockName: item.get('stockName') ? item.get('stockName') : item.get('name'),
            amount,
            number,
            unitPrice,
            isOpenedQuantity: item.get('isOpenedQuantity'),
            isUniformPrice: item.get('isUniformPrice'),
            // allUnit:item.get('allUnit'),
            // unit:item.get('unit'),
            // referencePrice: item.get('referencePrice') ? item.get('referencePrice') : '',
            // referenceQuantity: item.get('referenceQuantity') ? item.get('referenceQuantity') : '',
            // beforeQuantity,
            // beforePrice,
            // beforeAmount,
            // afterQuantity,
            // afterPrice,
            // afterAmount,
            // basicUnitQuantity: item.get('basicUnitQuantity') ? item.get('basicUnitQuantity') : '',
            // warehouseCardCode: (item.get('warehouseCardCode') ? item.get('warehouseCardCode') : ''),
            // warehouseCardName: isFromCount ? warehouseCardName : (item.get('warehouseCardName') ? item.get('warehouseCardName') : ''),
            // warehouseCardUuid: isFromCount ? warehouseCardUuid : (item.get('warehouseCardUuid') ? item.get('warehouseCardUuid') : ''),
            // uniformUuid: item.get('uniformUuid') ? item.get('uniformUuid') : '',
            // unitCardName: item.get('unitCardName') ? item.get('unitCardName') : item.get('allUnit') ? item.getIn(['allUnit','name']) : '',
            unitName: item.get('unitName') ? item.get('unitName') : item.get('allUnit') ? item.getIn(['allUnit','name']) : '',
            unitUuid: item.get('unitUuid') ? item.get('unitUuid') : item.get('allUnit') ? item.getIn(['allUnit','uuid']) : '',
        })
    })
    // dispatch(changeEditCalculateCommonString(temp, stockTemplate, fromJS(newStockCardList)))
    dispatch(changeApprovalProcessDetailInfoCommonString('stockList', fromJS(newStockCardList)))
}

export const getSearchApprovalCostTransferPrice = (oriDate,stockPriceList,oriIndex='',temp='CostTransfer',stockTemp = 'stockCardList') => (dispatch,getState) => {

    const editRunningModalState = getState().editRunningModalState
    const stockCardList = editRunningModalState.getIn(['editRunningModalTemp', 'stockList'])

    // const oriState = getState().editCalculateState.getIn([`${temp}Temp`,'oriState'])
    let hasCardUuid = false
    stockPriceList && stockPriceList.map(item => {
        if(item.cardUuid){
            hasCardUuid = true
        }
    })
    const uuidName = temp === 'Balance' ? 'uuid' : 'cardUuid'
    hasCardUuid && dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    hasCardUuid && fetchApi('getCarryoverStockPrice', 'POST', JSON.stringify({
        oriDate,
        stockPriceList,
        canNegate: true
    }), json => {
        dispatch({
            type: ActionTypes.SWITCH_LOADING_MASK
        })
        if (showMessage(json)) {
            let stockNameList = []

            stockCardList.map((item,index) => {
                const quantity = item.get('number')
                const basicUnitQuantity = item.get('basicUnitQuantity')
                json.data && json.data.length && json.data.map((v,i) => {
                    if(stockPriceList[i].isUniformPrice){
                        if (v.price < 0 || numberCalculate(v.amount, v.quantity, 2, 'divide') < 0) {
                            stockNameList.push(`${item.get('code')} ${item.get('cardName')}`)
                        }
                    }
                    if(stockNameList.length > 0){
                        stockNameList.map(value => {
                            return Modal.error({
                                title: `【${value}】的单价异常，请调整单价后再录入`,
                                content: '',
                                onOk() {},
                            })
                        })


                    }
                    if(stockTemp === 'selectStockItem'){
                        // if(item.get(uuidName) === v.cardUuid && oriIndex + i === index){
                        //     v.price > 0 && dispatch(changeEditCalculateCommonString(temp, [stockTemp,index,'price'], v.price))
                        //     v.price > 0 && dispatch(changeEditCalculateCommonString(temp, [stockTemp,index,'amount'], numberCalculate(v.price,quantity,2,'multiply')))
                        //     dispatch(changeEditCalculateCommonString(temp, [stockTemp,index,'referencePrice'], v.price))
                        //     dispatch(changeEditCalculateCommonString(temp, [stockTemp,index,'referenceQuantity'], v.quantity))

                        // }
                    } else {
                        if(item.get('stockUuid') === v.cardUuid && oriIndex + i === index){
                            const finallyPrice = basicUnitQuantity ? numberCalculate(basicUnitQuantity,v.price,4,'multiply',4) : v.price
                            const amount = basicUnitQuantity ? numberCalculate(quantity,finallyPrice,4,'multiply') : numberCalculate(quantity,v.price,4,'multiply')
                            dispatch(changeSearchApprovalString('editRunningModalTemp', ['stockList',index,'price'], v.price > 0 ? finallyPrice : ''))
                            dispatch(changeSearchApprovalString('editRunningModalTemp', ['stockList',index,'amount'], v.price > 0 ? amount : ''))
                            dispatch(changeSearchApprovalString('editRunningModalTemp', ['stockList',index,'referencePrice'], v.price))
                            dispatch(changeSearchApprovalString('editRunningModalTemp', ['stockList',index,'referenceQuantity'], v.quantity))

                        }
                    }
                })
            })
        }
    })
}

// 存货调拨
// 获取仓库卡片
// export const getCanUseWarehouseCardList = (cardObj) => (dispatch) => {
//     dispatch({
//         type: ActionTypes.SWITCH_LOADING_MASK
//     })
//     const {
//         temp = 'StockTemp',
//         isUniform = false,
//         inventoryUuid = '',
//         uniformUuid = '',
//         oriDate = '',
//         conditionType = '',
//         canUse = true,
//         cardFrom = '',
//         selectIndex = 0,
//         stockCardTemp = 'countStockCardList',
//     } = cardObj
//     fetchApi('getCanUseCardList', 'GET', `isUniform=${isUniform}&inventoryUuid=${inventoryUuid}&uniformUuid=${uniformUuid}&oriDate=${oriDate}&conditionType=${conditionType}&canUse=${canUse}`, json => {
//         dispatch({
//             type: ActionTypes.SWITCH_LOADING_MASK
//         })
//         if (showMessage(json)) {
//             if(cardFrom === 'count' && !isUniform){
//                 dispatch({
//                     type: ActionTypes.GET_CANUSE_WAREHOUSE_CARD_CHILD_LIST,
//                     receivedData: json.data.cardList,
//                     selectIndex,
//                     stockCardTemp: 'countStockCardList',
//                     temp
//                 })
//             }else{
//                 dispatch({
//                     type: ActionTypes.GET_CANUSE_WAREHOUSE_CARD_LIST,
//                     receivedData: json.data.cardList,
//                     canUseWarehouse: json.data.enableWarehouse,
//                     temp,
//                 })
//             }

//         }
//     })

// }

export const getSearchApprovalModifyStockPrice = (oriDate, stockCardList, stockPriceList,temp='',stockTemp = 'stockCardList',isAssembly = 'Assembly') => (dispatch,getState) => {

    // const stockCardList = getState().editCalculateState.getIn([`${temp}Temp`,stockTemp])

    // const stockCardOtherList = getState().editCalculateState.getIn([`${temp}Temp`,'stockCardOtherList'])
    // const stockCardListSize = stockCardList.size
    // const assemblySheet = getState().editCalculateState.getIn(['StockBuildUpTemp','assemblySheet'])

    let hasCardUuid = false
    stockPriceList && stockPriceList.map(item => {
        if(item.cardUuid){
            hasCardUuid = true
        }
    })
    hasCardUuid && dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    hasCardUuid && fetchApi('getCarryoverStockPrice', 'POST', JSON.stringify({
        oriDate,
        stockPriceList,
        canNegate: true
    }), json => {
        dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
        if (showMessage(json)) {
            // if(isAssembly === 'Assembly'){
            //     assemblySheet.map((item,index) => {
            //         let amount = 0
            //         item.get('materialList').map((itemM,mIndex) => {
            //             stockPriceList.length && stockPriceList.map((v,i) => {
            //                 if(itemM.get('materialUuid') === v.cardUuid && v.productIndex === index && v.materialIndex === mIndex){
            //                     dispatch(changeEditCalculateCommonString(temp, ['assemblySheet',index,'materialList',mIndex,'referencePrice'], json.data[i].price))
            //                     dispatch(changeEditCalculateCommonString(temp, ['assemblySheet',index,'materialList',mIndex,'referenceQuantity'], json.data[i].quantity))
            //                 }
            //             })

            //         })
            //     })
            // }  else if(isAssembly === 'stock'){
            //     stockCardList.map((item,index) => {
            //         dispatch(changeEditCalculateCommonString(temp, [stockTemp,index,'referencePrice'], json.data[index].price))
            //         dispatch(changeEditCalculateCommonString(temp, [stockTemp,index,'referenceQuantity'], json.data[index].quantity))
            //     })
            //     stockCardOtherList.map((item,index) => {
            //         dispatch(changeEditCalculateCommonString(temp, ['stockCardOtherList',index,'referencePrice'], json.data[index+stockCardListSize].price))
            //         dispatch(changeEditCalculateCommonString(temp, ['stockCardOtherList',index,'referenceQuantity'], json.data[index+stockCardListSize].quantity))
            //     })

            // }
            // else{
                stockCardList.map((item,index) => {
                    // dispatch(changeEditCalculateCommonString(temp, [stockTemp,index,'referencePrice'], json.data[index].price))
                    // dispatch(changeEditCalculateCommonString(temp, [stockTemp,index,'referenceQuantity'], json.data[index].quantity))
                    dispatch(changeSearchApprovalString('editRunningModalTemp', ['stockList',index,'referencePrice'], json.data[index].price))
                    dispatch(changeSearchApprovalString('editRunningModalTemp', ['stockList',index,'referenceQuantity'], json.data[index].quantity))
                })
            // }


        }
    })
}