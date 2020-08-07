import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.account.js'
import { fromJS, toJS } from 'immutable'

import { showMessage, formatDate } from 'app/utils'
import { message } from 'antd'
import thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'

import * as allActions from 'app/redux/Home/All/all.action'
import * as accountConfActions from 'app/redux/Config/Account/account.action'
import * as homeActions from 'app/redux/Home/home.action.js'

export const getPeriodDetailList = (issuedate) => (dispatch, getState) => {

    const amountType = 'DETAIL_AMOUNT_TYPE_BALANCE'
    dispatch(getDetailsListInfo(issuedate, amountType, '', true, ''))
    // dispatch(getCalculateListInfo(issuedate))
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    const lsmxState = getState().lsmxState
    const currentPage = 1
    const curCategory = ''
    const accountUuid = ''
    fetchApi('getBusinessDetailList', 'POST', JSON.stringify({
        year: issuedate ? issuedate.substr(0, 4) : '',
        month: issuedate ? issuedate.substr(6, 2) : '',
        endYear:'',
        endMonth:'',
        getPeriod: "true",
        categoryUuid: curCategory,
        currentPage,
        amountType,
        accountUuid,
        pageSize: Limit.LSMX_LIMIE_LENGTH
    }), json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            // if (json.code === 0 && !json.data.vcList.length) {
            // 	message.info('当前月份无任何凭证')
            // }
            const openedissuedate = dispatch(allActions.everyTableGetPeriod(json))
            const issuedateNew = issuedate ? issuedate : openedissuedate
            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : ''
            dispatch({
                type: ActionTypes.GET_DETAIL_LIST,
                receivedData: json.data.result.detailList,
                period: json.data.periodDtoJson,
                issuedate: issuedateNew,
                issues,
                endissuedate:'',
                getPeriod: "true",
                currentPage,
                amountType,
                allHappenAmount: json.data.result.allHappenAmount,
                allHappenBalanceAmount: json.data.result.allHappenBalanceAmount,
                allIncomeAmount: json.data.result.allIncomeAmount,
                allExpenseAmount: json.data.result.allExpenseAmount,
                allBalanceAmount: json.data.result.allBalanceAmount,
                pageCount: json.data.result.pages,
                property: json.data.result.propertyName
            })
        }
    })
    dispatch(accountConfActions.getRunningAccount())
}

export const getDetailList = (categorValue, issuedate, curPage, amountType, accountUuid, propertyCost='', endissuedate='') => (dispatch, getState) => {

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const lsmxState = getState().lsmxState
    amountType = amountType ? amountType :lsmxState.getIn(['flags', 'amountType'])
    const aUuid = accountUuid ? accountUuid=== '全部' ? '' : accountUuid.split(Limit.TREE_JOIN_STR)[0] : ''

    const currentPage = curPage === '' ? lsmxState.get('currentPage') : curPage
    categorValue = categorValue == '全部' ? '' : categorValue
    const paymentType = lsmxState.getIn(['flags', 'paymentType'])
    const accountType = lsmxState.getIn(['flags', 'accountType'])
    const defaultCategory = lsmxState.getIn(['flags', 'defaultCategory'])
    if(accountType === '全部' && paymentType === 'LB_QB' && amountType === 'DETAIL_AMOUNT_TYPE_HAPPEN' || defaultCategory === 'init' && amountType === 'DETAIL_AMOUNT_TYPE_HAPPEN'){
        fetchApi('getRunningDetailCategory', 'POST', JSON.stringify({
            year: issuedate ? issuedate.substr(0, 4) : '',
            month: issuedate ? issuedate.substr(6, 2) : '',
            endYear: endissuedate ? endissuedate.substr(0, 4) : '',
            endMonth: endissuedate ? endissuedate.substr(6, 2) : '',
            accountUuid: aUuid,
            amountType
        }), result => {
            if (showMessage(result)) {
                dispatch({
                    type: ActionTypes.GET_RUNNING_CATEGORY_DETAIL,
                    receivedData: result.data,
                    accountUuid,
                    defaultCategory: true
                })
                fetchApi('getBusinessDetailList', 'POST', JSON.stringify({
                    year: issuedate ? issuedate.substr(0, 4) : '',
                    month: issuedate ? issuedate.substr(6, 2) : '',
                    endYear: endissuedate ? endissuedate.substr(0, 4) : '',
                    endMonth: endissuedate ? endissuedate.substr(6, 2) : '',
                    getPeriod: "true",
                    accountUuid: aUuid,
                    categoryUuid: result.data.result[0].uuid,
                    amountType,
                    propertyCost: result.data.result[0].propertyCost,
                    currentPage: currentPage,
                    pageSize: Limit.LSMX_LIMIE_LENGTH
                }), json => {
                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                    if (showMessage(json)) {
                        const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : ''
                        dispatch({
                            type: ActionTypes.GET_DETAIL_LIST,
                            receivedData: json.data.result.detailList,
                            period: json.data.periodDtoJson,
                            issuedate,
                            issues,
                            endissuedate,
                            currentPage,
                            categorValue:result.data.result[0].uuid,
                            amountType,
                            accountUuid,
                            accountType:result.data.result[0].name,
                            categoryType:result.data.result[0].categoryType,
                            allHappenAmount: json.data.result.allHappenAmount,
                            allHappenBalanceAmount: json.data.result.allHappenBalanceAmount,
                            allIncomeAmount: json.data.result.allIncomeAmount,
                            allExpenseAmount: json.data.result.allExpenseAmount,
                            allBalanceAmount: json.data.result.allBalanceAmount,
                            pageCount: json.data.result.pages,
                            getPeriod: "true",
                            property: json.data.result.propertyName
                        })
                    }
                })
            }
        })
    }else{
        dispatch(getDetailsListInfo(issuedate,amountType,accountUuid,false,endissuedate))
        fetchApi('getBusinessDetailList', 'POST', JSON.stringify({
            year: issuedate ? issuedate.substr(0, 4) : '',
            month: issuedate ? issuedate.substr(6, 2) : '',
            endYear: endissuedate ? endissuedate.substr(0, 4) : '',
            endMonth: endissuedate ? endissuedate.substr(6, 2) : '',
            getPeriod: "true",
            accountUuid: aUuid,
            categoryUuid: categorValue,
            amountType,
            propertyCost,
            currentPage: currentPage,
            pageSize: Limit.LSMX_LIMIE_LENGTH
        }), json => {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            if (showMessage(json)) {
                const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : ''
                dispatch({
                    type: ActionTypes.GET_DETAIL_LIST,
                    receivedData: json.data.result.detailList,
                    period: json.data.periodDtoJson,
                    issuedate,
                    issues,
                    endissuedate,
                    currentPage,
                    categorValue,
                    amountType,
                    accountUuid,
                    allHappenAmount: json.data.result.allHappenAmount,
                    allHappenBalanceAmount: json.data.result.allHappenBalanceAmount,
                    allIncomeAmount: json.data.result.allIncomeAmount,
                    allExpenseAmount: json.data.result.allExpenseAmount,
                    allBalanceAmount: json.data.result.allBalanceAmount,
                    pageCount: json.data.result.pages,
                    getPeriod: "true",
                    property: json.data.result.propertyName
                })
            }
        })
    }
}

// export const getCalculateListInfo = (issuedate)  => (dispatch, getState) => {
//     const lsmxState = getState().lsmxState
//     const amountType = lsmxState.getIn(['flags', 'amountType'])
//     fetchApi('getRunningSettingInfo', 'GET', '', json => {
//         let hideCategoryList = []
//         if (showMessage(json)) {
//             json.data.hideCategoryList.map(item => {
//                 if (item.categoryType !== 'LB_SFGL')
//                     hideCategoryList.push(item)
//             })
//             dispatch({type: ActionTypes.INIT_DETAIL_ACCOUNT_LIST, hideCategoryList: hideCategoryList})
//         }
//     })
// }

export const getDetailsListInfo = (issuedate, amountType, accountUuid='', defaultCategory = false, endissuedate) => (dispatch, getState) => {
    const lsmxState = getState().lsmxState
    amountType = amountType ? amountType : lsmxState.getIn(['flags', 'amountType'])
    const aUuid = accountUuid ? accountUuid=== '全部' ? '' : accountUuid.split(Limit.TREE_JOIN_STR)[0] : ''
    fetchApi('getRunningDetailCategory', 'POST', JSON.stringify({
        year: issuedate ? issuedate.substr(0, 4) : '',
        month: issuedate ? issuedate.substr(6, 2) : '',
        endYear: endissuedate ? endissuedate.substr(0, 4) : '',
        endMonth: endissuedate ? endissuedate.substr(6, 2) : '',
        accountUuid: aUuid,
        amountType
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_RUNNING_CATEGORY_DETAIL,
                receivedData: json.data,
                accountUuid,
                defaultCategory
            })
        }
    })
}

export const changeDetailAccountCommonString = (tab, place, value) => (dispatch) => {
    let placeArr = typeof place === 'string'
            ? [`${tab}Temp`, place]
            : [`${tab}Temp`, ...place]
    if (place[0] === 'flags') {
        placeArr = place
    }
    dispatch({
        type: ActionTypes.CHANGE_DETAIL_ACCOUNT_COMMON_STRING,
        tab,
        placeArr,
        value
    })
}

export const getBusinessDetail = (item, issuedate,endissuedate='') => (dispatch) => {

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const uuid = item.get('categoryUuid')
    const monthExpenseAmount = item.get('monthExpenseAmount')
    const monthIncomeAmount = item.get('monthIncomeAmount')
    const amountType = monthExpenseAmount == 0 && monthIncomeAmount == 0 ? 'DETAIL_AMOUNT_TYPE_HAPPEN' : 'DETAIL_AMOUNT_TYPE_BALANCE'
    const categoryType = item.get('categoryType')
    const accountType = item.get('categoryName')
    const propertyCost = item.get('propertyCost')

    fetchApi('getBusinessDetailList', 'POST', JSON.stringify({
        year: issuedate ? issuedate.substr(0, 4) : '',
        month: issuedate ? issuedate.substr(6, 2) : '',
        endYear: endissuedate ? endissuedate.substr(0, 4) : '',
        endMonth: endissuedate ? endissuedate.substr(6, 2) : '',
        categoryUuid: uuid,
        currentPage: 1,
        amountType,
        propertyCost,
        pageSize: Limit.LSMX_LIMIE_LENGTH,
        getPeriod: "true"
    }), json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            dispatch(getDetailsListInfo(issuedate,amountType,'',false,endissuedate))
            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : ''
            dispatch({
                type: ActionTypes.GET_DETAIL_LIST,
                receivedData: json.data.result.detailList,
                period: json.data.periodDtoJson,
                issuedate,
                issues,
                endissuedate,
                categoryType,
                accountType,
                currentPage: 1,
                categorValue: uuid,
                amountType,
                allHappenAmount: json.data.result.allHappenAmount,
                allHappenBalanceAmount: json.data.result.allHappenBalanceAmount,
                allIncomeAmount: json.data.result.allIncomeAmount,
                allExpenseAmount: json.data.result.allExpenseAmount,
                allBalanceAmount: json.data.result.allBalanceAmount,
                pageCount: json.data.result.pages,
                getPeriod: "true",
                property: json.data.result.propertyName,
                propertyCost
            })
            // yezi
            // dispatch(homeActions.addTabpane('Lsmx'))
            dispatch(homeActions.addPageTabPane('MxbPanes', '收支明细表', '收支明细表', '收支明细表'))
            dispatch(homeActions.addHomeTabpane('Mxb', '收支明细表'))
        }
    })
}

export const changeLsmxMorePeriods = (chooseperiods) => ({
    type: ActionTypes.CHANGE_LSMX_MORE_PERIODS,
    chooseperiods
})
