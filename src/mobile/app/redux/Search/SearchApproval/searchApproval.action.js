import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.running.js'
import { toJS, fromJS } from 'immutable'

import { showMessage, jsonifyDate } from 'app/utils'
import thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import { formatDate, decimal } from 'app/utils'
import { getCategorynameByType, hideCategoryCanSelect } from 'app/containers/Config/Approval/components/common.js'

export const initSearchApproval = () => ({
    type: ActionTypes.INIT_SEARCH_APPROVAL
})

// views的值
export const changeSearchApprovalCommonString = (place, value) => ({
    type: ActionTypes.CHANGE_SEARCH_APPROVAL_COMMON_STRING,
    place,
    value
})
// approalAccountState
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

export const changeSearchApprovalString = (tab, place, value) => (dispatch) => {
    // let placeArr = typeof place === 'string'?[`${tab}`,place]:[`${tab}`, ...place]
    // if (place[0] === 'flags') {placeArr = place}

    if (tab) {
        let placeArr = typeof place === 'string'?[`${tab}`,place]:[`${tab}`, ...place]
        dispatch({
            type: ActionTypes.CHANGE_SEARCH_APPROVAL_STRING,
            tab,
            placeArr,
            value
        })
    } else {
        dispatch({
            type: ActionTypes.CHANGE_SEARCH_APPROVAL_STRING,
            tab,
            place,
            value
        })
    }
}

// 编辑专用
export const changeApprovalProcessDetailInfoBillCommonString = (place, value) => ({
    type: ActionTypes.CHANGE_APPROVAL_PROCESS_DETAIL_INFO_BILL_COMMON_STRING,
    place,
    value
})


// 审批列表
export const getApprovalProcessList = (param, currentPage, callBack, freshLoading) => (dispatch, getState) => { // 无参数表示按原有状态查询

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)

    const searchApprovalState = getState().searchApprovalState
    
    if (param.refresh === true) {
        param.searchType = searchApprovalState.getIn(['views', 'searchType'])
        param.searchContent = searchApprovalState.getIn(['views', 'searchContent'])
        param.dateType = searchApprovalState.getIn(['views', 'dateType'])
        param.beginDate = searchApprovalState.getIn(['views', 'beginDate'])
        param.endDate = searchApprovalState.getIn(['views', 'endDate'])
        param.processCode = searchApprovalState.getIn(['views', 'processCode'])
    }
    delete param.refresh

    const newCurrentPage = currentPage || searchApprovalState.getIn(['views', 'currentPage'])

    fetchApi('getApprovalProcessList', 'POST', JSON.stringify({
        // currentPage: currentPage || searchApprovalState.get('currentPage'),
        currentPage: 1,
        pageSize: newCurrentPage*Limit.SEARCH_APPROVAL_PAGE,
        ...param,
        isAsc: false,
        orderField: 'ORDER_DATE_END'
    }), json => {
        thirdParty.toast.hide()

        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.AFTER_GET_APPROVAL_PROCESSLIST,
                receivedData: json.data,
                param,
                currentPage: newCurrentPage
            })
            callBack && callBack()
        }
        freshLoading && freshLoading()
    })
}

// 明细列表
export const getApprovalProcessDetailList = (param, currentPage, callBack, freshLoading) => (dispatch, getState) => { // 无参数表示按原有状态查询

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)

    const searchApprovalState = getState().searchApprovalState
    
    if (param.refresh === true) {
        param.searchType = searchApprovalState.getIn(['views', 'searchType'])
        param.searchContent = searchApprovalState.getIn(['views', 'searchContent'])
        param.dateType = searchApprovalState.getIn(['views', 'dateType'])
        param.beginDate = searchApprovalState.getIn(['views', 'beginDate'])
        param.endDate = searchApprovalState.getIn(['views', 'endDate'])
        param.accountingType = searchApprovalState.getIn(['views', 'accountingType'])
    }
    delete param.refresh

    const newCurrentPage = currentPage || searchApprovalState.getIn(['views', 'currentPage'])

    fetchApi('getapprovalprocessdetaillist', 'POST', JSON.stringify({
        // currentPage: currentPage || searchApprovalState.get('currentPage'),
        currentPage: 1,
        pageSize: newCurrentPage*Limit.SEARCH_APPROVAL_PAGE,
        ...param,
        isAsc: false,
        orderField: 'ORDER_DATE_END'
    }), json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.AFTER_GET_APPROVAL_PROCESSLIST_DETAILLIST,
                receivedData: json.data,
                param,
                currentPage: newCurrentPage
            })
            callBack && callBack()
        }
        freshLoading && freshLoading()
    })
}

// 审批的可筛选列表
export const getApprovalProcessModelList = (param) => (dispatch, getState) => { // 无参数表示按原有状态查询

    const searchApprovalState = getState().searchApprovalState

    fetchApi('getapprovalprocessmodellist', 'POST', JSON.stringify({
        ...param
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.AFTER_GET_APPROVAL_PROCESS_MODEL_LIST,
                receivedData: json.data
            })
        }
    })
}

export const getSearchRunningJrCategoryDate = (uuid, id, callBack) => (dispatch, getState) => {

    fetchApi('getapprovalprocessdetailinfo', 'GET', `detailInfoId=${id}`, json => {

        if (showMessage(json)) {
            fetchApi('getApprovalCategoryList', 'GET', `uuid=${uuid}`, category => {

                if (category.code === 0) {

                    const categoryData = category.data
                    const { categoryTypeObj } = categoryData.categoryType ? getCategorynameByType(categoryData.categoryType) : {categoryTypeObj: ''}
                    const beZeroInventory = categoryTypeObj ? categoryData[categoryTypeObj].beZeroInventory : false

                    dispatch({
                        type: ActionTypes.GET_APPROVAL_PROCESS_DETAIL_INFO,
                        receivedData: json.data,
                        categoryData,
                        datailList: []
                    })

                    if (json.data.jrAmount > 0) {
                        dispatch(changeSearchRunningCalculateCommonString('beZeroInventory', beZeroInventory)) // 修改
                    }
                    callBack && callBack()

                } else if (category.code === 70001) {
                    thirdParty.toast.info("原关联流水类别已被删除")
                } else {
                    showMessage(category)
                }
            })
        }
    })
    // fetchApi('getApprovalCategoryList', 'GET', `uuid=${uuid}`, json => {
    //     if (json.code === 0) {

    //         const categoryData = json.data
    //         const categoryType = categoryData.categoryType
    //         const { categoryTypeObj } = categoryType ? getCategorynameByType(categoryType) : { categoryTypeObj: '' }
    //         const beZeroInventory = categoryTypeObj ? categoryData[categoryTypeObj].beZeroInventory : false
    //         dispatch(changeSearchRunningCalculateCommonString('beZeroInventory', beZeroInventory)) // 修改
    //         callBack && callBack()

    //     } 
    // })
}

// 作废
export const disuseApprovalProcessDetailInfo = (idList, callback) => (dispatch, getState) => {

    if (!idList.length) {
        return thirdParty.toast.info('请选择流水')
    }

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('disuseapprovalprocessdetailinfo', 'POST', JSON.stringify(
        {detailList: idList}
    ), json => {
        // thirdParty.toast.hide()
        if (json.code === 0) {
            if (json.data.length) {
                thirdParty.Alert(json.data.join(';'))
            } else {
                thirdParty.toast.info('操作成功')
            }

            const searchApprovalState = getState().searchApprovalState
            const currentPageType = searchApprovalState.getIn(['views', 'currentPageType'])
            if (currentPageType === 'ApprovalAll') {
                dispatch(getApprovalProcessList({ refresh: true }))
            } else if (currentPageType === 'Detail') {
                dispatch(getApprovalProcessDetailList({ refresh: true }))
            }
            
            callback()
        } else {
            showMessage(json)
        }
    })
}
// 撤销
export const cancelApprovalProcessDetailInfo = (idList, callback) => (dispatch, getState) => {

    if (!idList.length) {
        return thirdParty.toast.info('请选择流水')
    }

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('cancelapprovalprocessdetailinfo', 'POST', JSON.stringify(
        // idList
        {detailList: idList}
    ), json => {
        thirdParty.toast.hide()
        if (json.code === 0) {
            if (json.data.length) {
                thirdParty.Alert(json.data.join(';'))
            } else {
                thirdParty.toast.info('操作成功')
            }

            const searchApprovalState = getState().searchApprovalState
            const currentPageType = searchApprovalState.getIn(['views', 'currentPageType'])
            if (currentPageType === 'ApprovalAll') {
                dispatch(getApprovalProcessList({ refresh: true }))
            } else if (currentPageType === 'Detail') {
                dispatch(getApprovalProcessDetailList({ refresh: true }))
            }
            
            callback()
        } else {
            showMessage(json)
        }
    })
}
// 挂账
export const accountingApprovalProcessDetailInfo = (idList, accountDate, beCarryoverOut, carryoverCategoryItem, carryoverProjectCardList, propertyCost, callBack) => (dispatch, getState) => {

    if (!idList.size) {
        return thirdParty.toast.info('请选择流水')
    }
    if (!accountDate) {
        return thirdParty.toast.info('请选择挂账日期')
    }

    if (beCarryoverOut && !(carryoverCategoryItem && carryoverCategoryItem.size && carryoverCategoryItem.getIn([0, 'relationCategoryUuid']))) {
        return thirdParty.toast.info('请选择处理类别')
    }
    const approalAccountState = getState().approalAccountState
    const propertyCostList = approalAccountState.get('propertyCostList')
    if (propertyCostList.size && !propertyCost) {
        return thirdParty.toast.info('请选择费用性质')
    }
    const usedCarryoverProject = approalAccountState.get('usedCarryoverProject')
    if (usedCarryoverProject && !(carryoverProjectCardList && carryoverProjectCardList.size && carryoverProjectCardList.getIn([0, 'cardUuid']))) {
        return thirdParty.toast.info('请选择项目')
    }

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('accountingapprovalprocessdetailinfo', 'POST', JSON.stringify({
        detailList: idList,
        date: accountDate,
        beCarryover: beCarryoverOut,
        propertyCost: propertyCost,
        relationCategoryUuid: beCarryoverOut ? carryoverCategoryItem.getIn([0, 'relationCategoryUuid']) : '',
        carryoverProjectCardList: carryoverProjectCardList,
    }), json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            if (json.data.length) {
                thirdParty.Alert(json.data.join(';'))
            }
            callBack()

            const searchApprovalState = getState().searchApprovalState
            const currentPageType = searchApprovalState.getIn(['views', 'currentPageType'])
            if (currentPageType === 'ApprovalAll') {
                dispatch(getApprovalProcessList({ refresh: true }))
            } else if (currentPageType === 'Detail') {
                dispatch(getApprovalProcessDetailList({ refresh: true }))
            }
        }
    })
}

// 支付
export const payingApprovalProcessDetailInfo = (idList, account, accountDate, beCarryoverOut, carryoverCategoryItem, carryoverProjectCardList, propertyCost, callback) => (dispatch, getState) => {

    if (!idList.size) {
        return thirdParty.toast.info('请选择流水')
    }
   if (!(account && account.get('accountUuid'))) {
        return thirdParty.toast.info('请选择账户')
    }
    if (!accountDate) {
        return thirdParty.toast.info('请选择付款日期')
    }

    if (beCarryoverOut && !(carryoverCategoryItem && carryoverCategoryItem.size && carryoverCategoryItem.getIn([0, 'relationCategoryUuid']))) {
        return thirdParty.toast.info('请选择处理类别')
    }
    const approalAccountState = getState().approalAccountState
    const propertyCostList = approalAccountState.get('propertyCostList')
    if (propertyCostList.size && !propertyCost) {
        return thirdParty.toast.info('请选择费用性质')
    }
    const usedCarryoverProject = approalAccountState.get('usedCarryoverProject')
    if (usedCarryoverProject && !(carryoverProjectCardList && carryoverProjectCardList.size && carryoverProjectCardList.getIn([0, 'cardUuid']))) {
        return thirdParty.toast.info('请选择项目')
    }

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('payingapprovalprocessdetailinfo', 'POST', JSON.stringify({
        account,
        detailList: idList,
        date: accountDate,
        beCarryover: beCarryoverOut,
        propertyCost: propertyCost,
        relationCategoryUuid: beCarryoverOut ? carryoverCategoryItem.getIn([0, 'relationCategoryUuid']) : '',
        carryoverProjectCardList: carryoverProjectCardList,
    }), json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            if (json.data.length) {
                thirdParty.Alert(json.data.join(';'))
            }
            
            callback()

            const searchApprovalState = getState().searchApprovalState
            const currentPageType = searchApprovalState.getIn(['views', 'currentPageType'])
            if (currentPageType === 'ApprovalAll') {
                dispatch(getApprovalProcessList({ refresh: true }))
            } else if (currentPageType === 'Detail') {
                dispatch(getApprovalProcessDetailList({ refresh: true }))
            }
        }
    })
}

// 收款
export const receiveApprovalProcessDetailInfo = (idList, accountDate, setAccount, needPoundage, account, receiveAmount, callback) => (dispatch, getState) => {

    if (!(account && account.get('accountUuid'))) {
        return thirdParty.toast.info('请选择账户')
    }
    if (!idList.size) {
        return thirdParty.toast.info('请选择流水')
    }
    if (!accountDate) {
        return thirdParty.toast.info('请选择收款日期')
    }

    const approalAccountState = getState().approalAccountState
    const poundageCurrentCardList = approalAccountState.get('poundageCurrentCardList')
    const poundageProjectCardList = approalAccountState.get('poundageProjectCardList')

    if (poundageCurrentCardList.size && !poundageCurrentCardList.getIn([0, 'cardUuid'])) {
        return thirdParty.toast.info('请选择往来单位')
    }
    if (poundageProjectCardList.size && !poundageProjectCardList.getIn([0, 'cardUuid'])) {
        return thirdParty.toast.info('请选择项目')
    }

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('receiveapprovalprocessdetailinfo', 'POST', JSON.stringify({
        account,
        poundageCurrentCardList,
        poundageProjectCardList,
        detailList: idList,
        date: accountDate,
        beCover: setAccount,
        amount: receiveAmount,
        needUsedPoundage: needPoundage
    }), json => {
        thirdParty.toast.hide()
        if (json.code === 0) {
        // if (showMessage(json)) {
            if (json.data.length) {
                thirdParty.Alert(json.data.join(';'))
            }
            
            callback()

            const searchApprovalState = getState().searchApprovalState
            const currentPageType = searchApprovalState.getIn(['views', 'currentPageType'])
            if (currentPageType === 'ApprovalAll') {
                dispatch(getApprovalProcessList({ refresh: true }))
            } else if (currentPageType === 'Detail') {
                dispatch(getApprovalProcessDetailList({ refresh: true }))
            }
        }
    })
}

export const bookKeepingApprovalProcessDetailInfo = (idList, accountDate, callback) => (dispatch, getState) => {
    if (!idList.size) {
        return thirdParty.toast.info('请选择流水')
    }

    if (!accountDate) {
        return thirdParty.toast.info('请选择收款日期')
    }

    const approalAccountState = getState().approalAccountState
    const poundageCurrentCardList = approalAccountState.get('poundageCurrentCardList')
    const poundageProjectCardList = approalAccountState.get('poundageProjectCardList')
    const handlingFeeType = approalAccountState.get('handlingFeeType')
    const needUsedPoundage = approalAccountState.get('needUsedPoundage')
    const account = approalAccountState.get('account')

    if (poundageCurrentCardList.size && !poundageCurrentCardList.getIn([0, 'cardUuid'])) {
        return thirdParty.toast.info('请选择往来单位')
    }
    if (poundageProjectCardList.size && !poundageProjectCardList.getIn([0, 'cardUuid'])) {
        return thirdParty.toast.info('请选择项目')
    }

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('bookkeepingapprovalprocessdetailinfo', 'POST', JSON.stringify({
        account,
        poundageCurrentCardList,
        poundageProjectCardList,
        detailList: idList,
        date: accountDate,
        needUsedPoundage,
        handlingFeeType,
    }), json => {
        thirdParty.toast.hide()
        if (json.code === 0) {
            if (json.data.length) {
                thirdParty.Alert(json.data.join(';'))
            }

            callback()
            
            const searchApprovalState = getState().searchApprovalState
            const currentPageType = searchApprovalState.getIn(['views', 'currentPageType'])
            if (currentPageType === 'ApprovalAll') {
                dispatch(getApprovalProcessList({ refresh: true }))
            } else if (currentPageType === 'Detail') {
                dispatch(getApprovalProcessDetailList({ refresh: true }))
            }
        }
    })
}

// 点击调整时，获取所有的相关数据
export const beforeEditApprovalProcessDetailInfo = (id, callback, type) => (dispatch, getState) => {

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)

    fetchApi('getapprovalprocessdetailinfo', 'GET', `detailInfoId=${id}`, json => {

        if (showMessage(json)) {
            fetchApi('getApprovalCategoryList', 'GET', `uuid=${json.data.jrCategoryUuid}`, category => {

                let datailList = []
                if (category.code === 0) {

                    const categoryData = category.data

                    if ((json.data.detailType === '预付账款' || json.data.detailType === '预收账款') && categoryData.propertyList.indexOf('GXZT_DJGL') === -1) {
                        json.data.jrCategoryUuid = ''
                        json.data.categoryName = ''
                        thirdParty.toast.info("关联的流水类别已停用预收/付")
                    }
           
                    dispatch({
                        type: ActionTypes.GET_APPROVAL_PROCESS_DETAIL_INFO,
                        receivedData: json.data,
                        categoryData,
                        datailList
                    })

                    if (hideCategoryCanSelect.indexOf(json.data.jrCategoryType) > -1) {

                        if (categoryData.categoryType === 'LB_CHDB') {
                            // dispatch(getApprovalStockCardList([], 'hidecategory')) 
                            dispatch(getStockAllCardList([], 'hidecategory', '', () => {}))
                        }

                    } else {
                        const { categoryTypeObj } = json.data.jrCategoryType ? getCategorynameByType(json.data.jrCategoryType) : {categoryTypeObj: ''}
                        if (categoryData.beProject) {
                            const projectRange = categoryData.projectRange
                            dispatch(getProjectAllCardList(projectRange, 'project', '', () => {}))
                        }
                        if (categoryData[categoryTypeObj].contactsManagement) {
                            const contactsRange = categoryData[categoryTypeObj].contactsRange
                            dispatch(getRelativeAllCardList(contactsRange, 'contact', '', () => {}))
                        }
                        // 存货
                        // if (categoryData.propertyCarryover === 'SX_HW') {
                        if ((categoryData.propertyCarryover === 'SX_HW' || categoryData.propertyCarryover === 'SX_HW_FW') && (json.data.detailType === '销售存货套件' || json.data.detailType === '采购存货套件')) {   
                            const stockRange = categoryData[categoryTypeObj].stockRange
                            dispatch(getStockAllCardList(stockRange, 'stock', '', () => {}))
                        }

                        if (categoryData.canUse === false) {
                            thirdParty.toast.info("关联的流水类别已被停用")
                        }
                    }
                    callback && callback()
                } else if (category.code === 70001) { // 类别不存在

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
                    thirdParty.toast.info("原关联流水类别已被删除，请重新选择类别")
                } else {
                    showMessage(json)
                }
                callback && callback ()
            })
        } else {
            thirdParty.toast.hide()
        }
    })
}

// 获取调整的本条数据和类别  点击预览、上下条切换
export const getApprovalProcessDetailInfo = (id, callback, type) => (dispatch, getState) => {

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)

    fetchApi('getapprovalprocessdetailinfo', 'GET', `detailInfoId=${id}`, json => {

        if (showMessage(json)) {
            fetchApi('getApprovalCategoryList', 'GET', `uuid=${json.data.jrCategoryUuid}`, category => {

                let datailList = []
                if (type !== 'switch') { // switch 表示是切换上下条，不需要更新 datailList
                    const searchApprovalState = getState().searchApprovalState
                    const currentPageType = searchApprovalState.getIn(['views', 'currentPageType'])
                    if (currentPageType === 'ApprovalAll') {
                        searchApprovalState.get('approvalList').forEach(v => v.get('detailList').forEach(v => datailList.push(v)))
                    } else if (currentPageType === 'Detail') {
                        datailList = searchApprovalState.get('detailList').toJS()
                    }
                }
                
                if (category.code === 0) {

                    // const categoryData = category.data
                    // const { categoryTypeObj } = categoryData.categoryType ? getCategorynameByType(categoryData.categoryType) : {categoryTypeObj: ''}
                    // json.data.carryoverCardList = [{}]
                    dispatch({
                        type: ActionTypes.GET_APPROVAL_PROCESS_PREVIEW_DETAIL_INFO,
                        receivedData: json.data,
                        categoryData: category.data,
                        datailList
                    })

                    callback()

                    if (json.data.dealState !== "PROCESS_DISUSE" && category.data.canUse === false) {
                        thirdParty.toast.info("关联的流水类别已被停用")
                    }
                } else if (category.code === 70001) { // 类别不存在

                    json.data.jrCategoryType = ''
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
                        type: ActionTypes.GET_APPROVAL_PROCESS_PREVIEW_DETAIL_INFO,
                        receivedData: json.data,
                        categoryData: categoryDataNew,
                        datailList
                    })
                    callback()

                    if (json.data.dealState !== "PROCESS_DISUSE") {
                        thirdParty.toast.info("原关联流水类别已被删除")
                    }
                } else {
                    showMessage(json)
                }
            })
        } else {
            thirdParty.toast.hide()
        }
    })
}



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
        needIndirect: true,
        needMechanical: true,
    }), json => {
        if (showMessage(json)) {
            // if (fromPage === 'Poundage') {
                dispatch(changeSearchRunningCalculateCommonString('poundageProjectList' ,fromJS(json.data.result)))
            // } else {
            //     dispatch({
            //         type: ActionTypes.SEARCH_APPROVAL_GET_APPROVAL_PROJECT_CARD_LIST,
            //         receivedData: json.data.result
            //     })
            // }
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

    fetchApi('getCurrentCardList', 'POST', JSON.stringify({
        sobId,
        categoryList: contactsRange,
        property: 'NEEDPAY'
    }), json => {
        if (showMessage(json)) {
            // if (fromPage === 'Poundage') {
                dispatch(changeSearchRunningCalculateCommonString('poundageCurrentList' ,fromJS(json.data.result)))
            // } else {
            //     dispatch({
            //         type: ActionTypes.SEARCH_APPROVAL_GET_APPROVAL_CONTACT_CARD_LIST,
            //         receivedData: json.data.result
            //     })
            // }
        }
    })
}


// export const getApprovalStockCardList = (stockRange) => (dispatch, getState) => {

//     const sobId = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'sobId'])

//     if (!stockRange) { // 新增时没有传入
//         const categoryType = getState().editRunningModalState.getIn(['categoryData', 'categoryType'])
//         const { categoryTypeObj } = getCategorynameByType(categoryType)
//         stockRange = getState().editRunningModalState.getIn(['categoryData', categoryTypeObj, 'stockRange'])
//     }

//     fetchApi('getStockCategoryList', 'POST', JSON.stringify({
//         sobId,
//         categoryList: stockRange,
//         property: '5'
//     }), json => {
//         if (showMessage(json)) {
//             dispatch({
//                 type: ActionTypes.SEARCH_APPROVAL_GET_APPROVAL_STOCK_CARD_LIST,
//                 receivedData: json.data.result
//             })
//         }
//     })

//     const enableWarehouse = getState().homeState.getIn(['data', 'userInfo','sobInfo','moduleInfo']).indexOf('WAREHOUSE') > -1
//     if (enableWarehouse) {
//         fetchApi(`canUseWarehouseCardTree`, 'GET', '', json => {
//             if (showMessage(json)) {
//                 dispatch({
//                     type: ActionTypes.SEARCH_APPROVAL_GET_APPROVAL_WAREHOUSE_CARD_LIST,
//                     receivedData: json.data.cardList
//                 })
//             }
//         })
//     }
// }

export const getSearchApprovalCarryoverCategory = (oriDate) => (dispatch, getState) => {
    
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)

    fetchApi('getCostCategory', 'POST', JSON.stringify({
        oriDate,
        oriState:'STATE_YYSR_ZJ',
    }), json => {
        if (showMessage(json)) {
            dispatch(changeSearchRunningCalculateCommonString('carryoverCategoryList', fromJS(json.data.categoryList)))
            // dispatch(changeLrAccountCommonString('',['flags','carryoverCategoryList'], fromJS(json.data.categoryList)))
        }
        thirdParty.toast.hide()
    })
}

export const getSearchApprovalCarrayProjectCardList = (projectRange, callBack) => (dispatch,getState) => {
    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])
    
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)

    fetchApi('getProjectCardList','POST', JSON.stringify({
        sobId,
        categoryList: projectRange,
        needCommonCard: true,
        needAssist: true,
        needMake: true,
        needIndirect: true,
        needMechanical: true
    }), json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {

            const projectList = getState().editRunningModalState.getIn(['editRunningModalTemp', 'projectList'])

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
            // callBack && callBack()
            dispatch(changeSearchRunningCalculateCommonString('carryoverProjectList', fromJS(json.data.result)))
        }
    })
}

// 调整切换类别
export const changeApprovalProcessDetailInfoCategory = (categoryUuid, categoryType, categoryName, editRunningModalTemp) => (dispatch, getState) => {

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)

    fetchApi('getApprovalCategoryList', 'GET', `uuid=${categoryUuid}`, json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {

            // 调整相关的数据
            const categoryData = json.data
            const { categoryTypeObj } = getCategorynameByType(categoryType)
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
                // dispatch(getApprovalRelativeCardList(contactsRange))
                dispatch(getRelativeAllCardList(contactsRange, 'contact', '', () => {}))
                // editRunningModalTemp = editRunningModalTemp.set('contactList', fromJS([]))
            } else {
                editRunningModalTemp = editRunningModalTemp.set('beContact', false)
                    .set('contactList', fromJS([]))
            }

            // 项目
            if (categoryData.beProject) {
                const projectRange = categoryData.projectRange
                // dispatch(getApprovalProjectCardList(projectRange))
                dispatch(getProjectAllCardList(projectRange, 'project', '', () => {}))
                // editRunningModalTemp = editRunningModalTemp.set('projectList', fromJS([]))
            } else {
                editRunningModalTemp = editRunningModalTemp.set('beProject', false)
                    .set('projectList', fromJS([]))
                    .set('jrCostType', '')
            }

            // 存货
            // if (categoryData.propertyCarryover === 'SX_HW') {
            if ((categoryData.propertyCarryover === 'SX_HW' || categoryData.propertyCarryover === 'SX_HW_FW') && (editRunningModalTemp.get('detailType') === '销售存货套件' || editRunningModalTemp.get('detailType') === '采购存货套件')) {
                const stockRange = categoryData[categoryTypeObj].stockRange
                // dispatch(getApprovalStockCardList(stockRange))
                dispatch(getStockAllCardList(stockRange, 'stock', '', () => {}))
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


// 获取往来的选择里的类别和
export const getRelativeAllCardList = (categoryList, modalName, leftNotNeed, callBack) => (dispatch,getState) => {

    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])

    if (!categoryList) {
        const editRunningModalTemp = getState().editRunningModalState.get('editRunningModalTemp')
        const categoryData = getState().editRunningModalState.get('categoryData')
        const categoryType = editRunningModalTemp.get('jrCategoryType')
        const { categoryTypeObj } = getCategorynameByType(categoryType)

        categoryList = categoryData.getIn([categoryTypeObj, 'contactsRange'])
    }

    if(!leftNotNeed) {
        fetchApi('getCurrentTree', 'POST', JSON.stringify({
            sobId,
            categoryList,
        }),json => {
            if (showMessage(json)) {
                dispatch(changeSearchApprovalString('', 'contactSourceCategoryList', fromJS(json.data.typeList)))
            }
        })
    }

    let property = 'NEEDPAY'
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('getCurrentCardList','POST', JSON.stringify({
        sobId,
        categoryList,
        property,
    }),json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            dispatch(changeSearchApprovalString('', 'contactSourceCardList', fromJS(json.data.result)))
            dispatch(changeSearchApprovalString('', 'allContactList', fromJS(json.data.result)))
            callBack && callBack()
        }
    })
}

// 往来选择框里选择类别下的卡片
export const getRelativeSomeCardList = (uuid, level) =>  (dispatch,getState) => {
    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])

    const property = 'NEEDPAY'

    if (level == 1) {
        fetchApi('getCurrentListByCategory', 'POST', JSON.stringify({
            sobId,
            categoryUuid: uuid,
            listByCategory: true,
            property,
            subordinateUuid:''
        }), json => {
            if (showMessage(json)) {
                dispatch(changeSearchApprovalString('', 'contactSourceCardList', fromJS(json.data.resultList)))
            }
        })
    } else {
        fetchApi('getCurrentListByCategory', 'POST', JSON.stringify({
            sobId,
            subordinateUuid: uuid,
            property,
            listByCategory: false,
            categoryUuid: ''
        }),json => {
            if (showMessage(json)) {
                dispatch(changeSearchApprovalString('', 'contactSourceCardList', fromJS(json.data.resultList)))
            }
        })
    }
}

// 获取项目的选择里的类别和
export const getProjectAllCardList = (categoryList, page, leftNotNeed, callBack) => (dispatch,getState) => {

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)

    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])

    if (!categoryList) {
        const categoryData = getState().editRunningModalState.get('categoryData')
        categoryList = categoryData.get('projectRange')
    }
    
    if(!leftNotNeed) {
        fetchApi('getProjectTreeList','POST', JSON.stringify({
            sobId,
            categoryList,
        }), json => {
            if (showMessage(json)) {
                dispatch(changeSearchApprovalString('', 'projectSourceCategoryList', fromJS(json.data.typeList)))
            }
        })
    }
    fetchApi('getProjectCardList','POST', JSON.stringify({
        sobId,
        categoryList,
        needCommonCard: true,
        needAssist: true,
        needMake: true,
        needIndirect: true,
        needMechanical: true,
    }),json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            dispatch(changeSearchApprovalString('', 'projectSourceCardList', fromJS(json.data.result)))
            dispatch(changeSearchApprovalString('', 'allProjectList', fromJS(json.data.result)))
            callBack && callBack()
        }
    })
}

// 获取项目的选择里的类别和
export const getProjectSomeCardList = (uuid, level) =>  (dispatch,getState) => {
    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])
    if (level == 1) {
        fetchApi('getProjectSubordinateCardList','POST', JSON.stringify({
            sobId,
            categoryUuid:uuid,
            listByCategory:true,
            subordinateUuid:'',
        }),json => {
            if (showMessage(json)) {
                dispatch(changeSearchApprovalString('', 'projectSourceCardList', fromJS(json.data.resultList)))
            }
        })
    } else {
        fetchApi('getProjectSubordinateCardList','POST', JSON.stringify({
            sobId,
            subordinateUuid:uuid,
            listByCategory:false,
            categoryUuid:uuid,
        }),json => {
            if (showMessage(json)) {
                dispatch(changeSearchApprovalString('', 'projectSourceCardList', fromJS(json.data.resultList)))
            }
        })
    }
}

// 获取存货的选择里的类别和
export const getStockAllCardList = (categoryList, pageType, leftNotNeed, callBack) => (dispatch,getState) => {

    const sobId = getState().homeState.getIn(['data','userInfo', 'sobInfo','sobId'])

    if (!categoryList) {
        const editRunningModalTemp = getState().editRunningModalState.get('editRunningModalTemp')
        const categoryData = getState().editRunningModalState.get('categoryData')
        const categoryType = editRunningModalTemp.get('jrCategoryType')
        const { categoryTypeObj } = getCategorynameByType(categoryType)

        categoryList = categoryData.getIn([categoryTypeObj, 'stockRange'])
    }

    if(!leftNotNeed) {
        fetchApi('getStockCategoryTree', 'POST', JSON.stringify({
            sobId,
            categoryList,
        }),json => {
            if (showMessage(json)) {
                dispatch(changeSearchApprovalString('', 'invetorySourceCategoryList', fromJS(json.data.typeList)))
            }
        })

        const enableWarehouse = getState().homeState.getIn(['data', 'userInfo','sobInfo','moduleInfo']).indexOf('WAREHOUSE') > -1
        if (enableWarehouse) {
            fetchApi(`getWarehouseList`, 'GET', '', json => {
                if (showMessage(json)) {
                    dispatch({
                        type: ActionTypes.SEARCH_APPROVAL_GET_APPROVAL_WAREHOUSE_CARD_LIST,
                        receivedData: json.data.cardList
                    })
                }
            })
        }
    }
    
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)

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

    fetchApi('getStockCardList', 'POST', JSON.stringify(para),json => {
        if (showMessage(json)) {
            dispatch(changeSearchApprovalString('', 'invetorySourceCardList', fromJS(json.data.result)))
            dispatch(changeSearchApprovalString('', 'allInvetoryList', fromJS(json.data.result)))
            callBack && callBack()
        }
        thirdParty.toast.hide()
    })
    
}

// 存货选择框里选择类别下的卡片
export const getStockSomeCardList = (uuid, level) =>  (dispatch,getState) => {

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
                dispatch(changeSearchApprovalString('', 'invetorySourceCardList', fromJS(json.data.resultList)))
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
                dispatch(changeSearchApprovalString('', 'invetorySourceCardList', fromJS(json.data.resultList)))
            }
        })
    }
}

export const modifyApprovalProcessDetailInfo = (editRunningModalTemp, callback) => (dispatch, getState) => {

    if (editRunningModalTemp.get('jrCategoryUuid') === '') {
        return thirdParty.toast.info('流水类别必选')
    }
    if (editRunningModalTemp.get('jrAmount') === '') {
        return thirdParty.toast.info('金额必填')
    } else {
        if (['LB_ZZ'].indexOf(editRunningModalTemp.get('jrCategoryType')) > -1 && editRunningModalTemp.get('jrAmount') < 0) {
            return thirdParty.toast.info('金额仅支持输入正数')
        }
    }
    if (editRunningModalTemp.getIn(['billList', 0, 'billType']) !== 'bill_other' && editRunningModalTemp.getIn(['billList', 0, 'tax']) == '') {
        return thirdParty.toast.info('税额必填')
    }

    editRunningModalTemp = editRunningModalTemp.update('stockList', v => v.filter(w => w.get('stockUuid')))
    const stockList = editRunningModalTemp.get('stockList')
    const enableWarehouse = getState().homeState.getIn(['data', 'userInfo','sobInfo','moduleInfo']).indexOf('WAREHOUSE') > -1
    if (enableWarehouse && stockList.some(v => !v.get('depotUuid')) && editRunningModalTemp.get('jrCategoryType') !== 'LB_CHDB') {
        return thirdParty.toast.info('仓库必选')
    }
    if (hideCategoryCanSelect.indexOf(editRunningModalTemp.get('jrCategoryType')) > -1 && stockList.some(v => !v.get('amount'))) {
        return thirdParty.toast.info('存货金额必填')
    }

    if (editRunningModalTemp.get('beProject') == false) {
        editRunningModalTemp = editRunningModalTemp.set('projectList', fromJS([]))
    }

    if (editRunningModalTemp.get('beContact') == false) {
        editRunningModalTemp = editRunningModalTemp.set('contactList', fromJS([]))
    }

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)

    fetchApi('modifyapprovalprocessdetailinfo', 'POST', JSON.stringify(editRunningModalTemp), json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            dispatch(getApprovalProcessList({ refresh: true }))
            callback()
        }
    })
}





















//附件
// import { searchRunningAllActions } from 'app/redux/Search/SearchRunning/searchRunningAll.js'







export const changeApprovalProcessDetailInfoCommonString = (place, value) => ({
    type: ActionTypes.CHANGE_APPROVAL_PROCESS_DETAIL_INFO_COMMON_STRING,
    place,
    value
})


export const searchApprovalChangeRunningTaxRate = (value, amount) => ({
    type: ActionTypes.SEARCH_APPROVAL_CHANGE_RUNNING_TAX_RATE,
    value,
    amount
})










export const getBusinessManagerModal = (item, childItem, callBack, type) => (dispatch, getState) => {

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

            let runningFlowTemp = fromJS({ ...json.data.jrOri, ...json.data.category }).set('magenerType', type)
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

export const getBusinessGrantModal = (item, childItem, callBack, type) => (dispatch, getState) => {
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

// export const insertRunningManagerModal = (callBack, categoryTypeObj, fromcalCultion) => (dispatch, getState) => {
//     const approalCalculateState = getState().approalCalculateState
//     const runningFlowTemp = approalCalculateState.get('runningFlowTemp')
//     const modalTemp = approalCalculateState.get('modalTemp')
//     const oriDate = modalTemp.get('oriDate')
//     const oriAbstract = modalTemp.get('oriAbstract')
//     const accounts = modalTemp.get('accounts')
//     const amount = modalTemp.get('amount')
//     const categoryUuid = modalTemp.get('categoryUuid')
//     const pendingManageDto = modalTemp.get('pendingManageDto').toJS()
//     const poundageCurrentCardList = modalTemp.get('poundageCurrentCardList') || fromJS([])
//     const poundageProjectCardList = modalTemp.get('poundageProjectCardList') || fromJS([])
//     const needUsedPoundage = modalTemp.get('needUsedPoundage')
//     const currentCardList = runningFlowTemp.get('currentCardList').toJS()
//     // 附件
//     const enclosureList = getState().searchRunningAllState.get('enclosureList')

//     if (oriAbstract.length>45) {
//         message.info('摘要不得大于45个字')
//         return
//     }

//     dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
//     fetchApi('insertPaymentManage', 'POST', JSON.stringify({
//         oriDate,
//         oriAbstract,
//         accounts,
//         amount,
//         pendingManageDto,
//         categoryUuid,
//         currentCardList,
//         moedAmount: '',
//         enclosureList,
//         needUsedPoundage,
//         poundageCurrentCardList,
//         poundageProjectCardList,
//     }), json => {
//         dispatch({ type: ActionTypes.SWITCH_LOADING_MASK })
//         if (showMessage(json, 'show')) {
//             callBack()
//             dispatch(changeSearchRunningCalculateCommonString('modalTemp', fromJS({ oriDate: formatDate().substr(0, 10) })))
//             // dispatch(searchRunningAllActions.clearEnclosureList())
//             dispatch(getApprovalProcessList({ refresh: true }))
//         }
//     })
// }

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
                // dispatch(searchRunningAllActions.clearEnclosureList())
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
export const getInventoryAllCardList = (categoryList, modalName, leftNotNeed) => (dispatch,getState) => {

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
    
    fetchApi('getStockCategoryList', 'POST', JSON.stringify({
        sobId,
        categoryList,
        property: '5'
    }),json => {
        if (showMessage(json)) {

            dispatch(changeSearchRunningCalculateCommonString('selectThingsList', fromJS(json.data.result)))
            dispatch(changeSearchRunningCalculateCommonString('thingsList', fromJS(json.data.result)))

            dispatch(changeSearchRunningCalculateCommonString(['views', modalName], true))
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
    let newSelectItem = selectItem
    
     newSelectItem = newSelectItem.map((item,i) => {
        item.stockUuid = item.uuid
        item.stockCode = item.code
        item.stockName = item.cardName
        // if (item.unitPriceList && item.unitPriceList.length) {
        if (item.unitPriceList && item.unitPriceList.length) {
            let unitUuid = '', unitName = ''
            if (item.unit.uuid === item.unitPriceList[0].unitUuid) {
                unitName = item.unit.name
                unitUuid = item.unit.uuid
            } else {
                item.unit.unitList.map(v => {
                    if (v.uuid === item.unitPriceList[0].unitUuid) {
                        unitName = v.cardName
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
}
export const getSearchApprovalAccountRunningCate = (uuid) => (dispatch,getState) => {
    fetchApi('getRunningDetail','GET','uuid='+uuid, json => {
        if (showMessage(json)) {
            const accountProjectRange = json.data.result.projectRange
            const accountContactsRange = json.data.result.acCost.contactsRange
            
            dispatch(changeSearchRunningCalculateCommonString('accountProjectRange' ,fromJS(accountProjectRange)))
            dispatch(changeSearchRunningCalculateCommonString('accountContactsRange', fromJS(accountContactsRange)))
        }
    })
}

//存货调拨获取参考单价 统一单价
export const getSearchApprovalChdbPrice =  (idx, list) => (dispatch, getState) => {
	const state = getState().editRunningModalState
	const oriDate = state.getIn(['editRunningModalTemp', 'jrDate'])
	const storeUuid = state.getIn(['editRunningModalTemp', 'outputDepot', 'uuid'])

	let stockPriceList = []
	list.forEach((v, i) => {
		let cardUuid = v['uuid']
		stockPriceList.push({cardUuid, storeUuid})
	})

	thirdParty.toast.loading('加载中...', 0)
	fetchApi('getChdbPrice', 'POST', JSON.stringify({
		oriDate,
		stockPriceList
	}), json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			const price = json.data[0].price == 0 ? '' : decimal(json.data[0].price, 4)

			let newStockCardList = state.getIn(['editRunningModalTemp', 'stockList']).toJS()
			const listLength = list.length
			newStockCardList.forEach((v, i) => {
				if (i >= idx && i <= idx+listLength-1) {
					const index = i-idx
					const price = json.data[index].price == 0 ? '' : json.data[index].price
					// v['price'] = price
					v['unitPrice'] = price
					v['amount'] = ''
				}
			})
			dispatch(changeApprovalProcessDetailInfoCommonString('stockList', fromJS(newStockCardList)))
		}
		// if (cardItem.get('isUniformPrice') && json.data.price <= 0) {
		// 	thirdParty.Alert(`[${cardItem.get('code')} ${cardItem.get('name')}]的单价异常，请调整单价后再录入`, '确定')
		// }
	})
}
//存货调拨获取参考单价 统一单价
export const getSearchApprovalChdbPriceAll = (jrDate, storeUuid) => (dispatch, getState) => {
	const state = getState().editRunningModalState
	// const oriDate = state.getIn(['editRunningModalTemp', 'jrDate'])
	// const storeUuid = state.getIn(['editRunningModalTemp', 'outputDepot', 'uuid'])
	const stockCardList = state.getIn(['editRunningModalTemp', 'stockList'])
	if (!storeUuid) {
		return
	}

	let stockPriceList = []
	stockCardList.forEach((v,idx) => {
		if (v.get('isOpenedQuantity') && v.get('stockUuid')) {
			stockPriceList.push({
				storeUuid,
				cardUuid: v.get('stockUuid')
			})
		}
	})

	if (stockPriceList.length==0) {
		return
	}
    thirdParty.toast.loading('加载中...', 0)
	fetchApi('getChdbPrice', 'POST', JSON.stringify({
		oriDate: jrDate,
		stockPriceList
	}), json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			let newStockCardList = stockCardList.toJS()
			newStockCardList.forEach((v,idx) => {
				for (let item of json.data) {
					if (v['cardUuid']==item['cardUuid']) {
						const price = item.price == 0 ? '' : decimal(item.price, 4)
						let amount = ''
						let quantity = v['quantity']

						if (price && quantity) {//计算金额
							amount = decimal(Number(price)*Number(quantity))
						}
						v['price'] = price
						v['unitPrice'] = price
						v['amount'] = amount
						break
					}
				}
			})
            dispatch(changeApprovalProcessDetailInfoCommonString('stockList', fromJS(newStockCardList)))
		}
	})


}