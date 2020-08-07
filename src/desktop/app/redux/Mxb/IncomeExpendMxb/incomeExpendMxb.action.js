import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.account.js'
import { showMessage } from 'app/utils'
import thirdParty from 'app/thirdParty'
import { message } from 'antd'
import * as Limit from 'app/constants/Limit.js'

import * as allRunningActions from 'app/redux/Home/All/allRunning.action'

// 从余额表跳明细表
export const getIncomeExpendMxbListFromIncomeExpendYeb = (issuedate, endissuedate, currentCategoryUuid) => dispatch => {

    if (!issuedate) {
        return message.info('账期异常，请刷新再试', 2)
    }
    dispatch(getIncomeExpendDetailCategory(issuedate, endissuedate))
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getIncomeExpendMxbReport', 'POST', JSON.stringify({
        begin,
        end,
        jrCategoryUuid: currentCategoryUuid,
        jrAbstract:'',
        currentPage: 1,
        pageSize: Limit.MXB_PAGE_SIZE,
        needPeriod: 'true',
    }), json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(json))
            dispatch({
                type: ActionTypes.GET_INCOME_EXPEND_MXB_LIST_FROM_INCOME_EXPENDYEB,
                receivedData: json.data,
                issuedate: issuedate,
                endissuedate: endissuedate,
                currentCategoryUuid,
                jrAbstract: '',
                currentPage: 1,
            })
        }
    })
}
export const getPeriodAndIncomeExpendMxbList = (issuedate, endissuedate,currentCategoryUuid = '',jrAbstract = '') => (dispatch,getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const incomeExpendMxbState = getState().incomeExpendMxbState
    const categoryUuid = incomeExpendMxbState.getIn(['views','categoryUuid'])
    const categoryName = incomeExpendMxbState.getIn(['views','categoryName'])
    const oriName = incomeExpendMxbState.getIn(['views','oriName'])
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
    fetchApi('getIncomeExpendMxbCategory', 'POST', JSON.stringify({
        begin,
        end,
        needPeriod: 'true',
    }), json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(json))
            if(json.data.result[0]){
                dispatch({
                    type: ActionTypes.GET_INCOME_EXPEND_MXB_CATEGORY,
                    receivedData: json.data.result,
                })
                let hasCategoryItem = false
                let newCategoryUuid = categoryUuid
                let newCategoryName = categoryName
                let newOriName = oriName
                const loop = (data) => data.map(item => {
                    if(item.jrCategoryUuid === categoryUuid){
                        hasCategoryItem = true
                    }
                    if(item.childList.length > 0){
                        loop(item.childList)
                    }
                })
                loop(json.data.result)
                if(!hasCategoryItem){
                    newCategoryUuid = json.data.result[0].jrCategoryUuid
                    newCategoryName = json.data.result[0].jrCategoryCompleteName
                    newOriName = json.data.result[0].jrCategoryName
                }

                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                fetchApi('getIncomeExpendMxbReport', 'POST', JSON.stringify({
                    begin,
                    end,
                    jrCategoryUuid: newCategoryUuid,
                    jrAbstract: jrAbstract,
                    currentPage: 1,
                    pageSize: Limit.MXB_PAGE_SIZE,
                    needPeriod: 'true',
                }), result => {
                    if (showMessage(result)) {
                        const openedissuedate = issuedate ? issuedate : dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(result))
                        dispatch({
                            type: ActionTypes.GET_INCOME_EXPEND_MXB_LIST_FROM_INCOME_EXPENDYEB,
                            receivedData: result.data,
                            issuedate: openedissuedate,
                            endissuedate: endissuedate,
                            currentCategoryUuid: newCategoryUuid,
                            categoryName: newCategoryName,
                            oriName: newOriName,
                            jrAbstract,

                            currentPage: 1,
                        })
                    }
                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                })
            }else{
                const openedissuedate = issuedate ? issuedate : dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(json))
                dispatch({
                    type: ActionTypes.GET_INCOME_EXPEND_MXB_NO_CATEGORY,
                    issuedate: openedissuedate,
                })
            }

        }
    })

}

export const getPeriodAndIncomeExpendMxbListRefalsh = (issuedate, endissuedate,currentCategoryUuid = '',jrAbstract = '') => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
    fetchApi('getIncomeExpendMxbCategory', 'POST', JSON.stringify({
        begin,
        end,
        needPeriod: 'true',
    }), json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(json))
            if(json.data.result[0]){
                dispatch({
                    type: ActionTypes.GET_INCOME_EXPEND_MXB_CATEGORY,
                    receivedData: json.data.result,
                })
                let hasCategory = false
                let categoryUuid = currentCategoryUuid
                let jrCategoryName = '', jrCategoryCompleteName = ''
                const loop = (data) => data.map(item => {
                    if(item.jrCategoryUuid == currentCategoryUuid){
                        hasCategory = true
                        jrCategoryName = item.jrCategoryName,
                        jrCategoryCompleteName = item.jrCategoryCompleteName
                    }
                    if(item.childList.length > 0){
                        loop(item.childList)
                    }
                })
                loop(json.data.result)
                if(!hasCategory){
                    categoryUuid = ''
                }
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                fetchApi('getIncomeExpendMxbReport', 'POST', JSON.stringify({
                    begin,
                    end,
                    jrCategoryUuid: categoryUuid,
                    jrAbstract: jrAbstract,
                    currentPage: 1,
                    pageSize: Limit.MXB_PAGE_SIZE,
                    needPeriod: 'true',
                }), result => {
                    if (showMessage(result)) {
                        const openedissuedate = issuedate ? issuedate : dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(result))
                        dispatch({
                            type: ActionTypes.GET_INCOME_EXPEND_MXB_LIST_FROM_INCOME_EXPENDYEB,
                            receivedData: result.data,
                            issuedate: openedissuedate,
                            endissuedate: endissuedate,
                            currentCategoryUuid: categoryUuid,
                            categoryName: jrCategoryCompleteName,
                            oriName: jrCategoryName,
                            jrAbstract,
                            currentPage: 1,
                        })
                    }
                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                })
            }else{
                const openedissuedate = issuedate ? issuedate : dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(json))
                dispatch({
                    type: ActionTypes.GET_INCOME_EXPEND_MXB_NO_CATEGORY,
                    issuedate: openedissuedate,
                })
            }

        }
    })

}
// 切换账期获取列表
export const getIncomeExpendMxbBalanceList = (issuedate, endissuedate) => (dispatch, getState) => {
    if (!issuedate) {
        return message.info('账期异常，请刷新再试', 2)
    }
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getIncomeExpendMxbReport', 'POST', JSON.stringify({
        begin,
        end,
        jrCategoryUuid: '',
        jrAbstract: '',
        currentPage: 1,
        pageSize: Limit.MXB_PAGE_SIZE,
        needPeriod: 'true',
    }), json => {
        if (showMessage(json)) {
            dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(json))
            dispatch({
                type: ActionTypes.GET_INCOME_EXPEND_MXB_LIST_FROM_INCOME_EXPENDYEB,
                receivedData: json.data,
                issuedate: issuedate,
                endissuedate: endissuedate,
                currentCategoryUuid: '',
                jrAbstract: '',
                currentPage: 1,
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}
export const getIncomeExpendMxbBalanceListPages = (issuedate, endissuedate,currentCategoryUuid = '',jrAbstract = '',currentPage = 1) => (dispatch, getState) => {
    if (!issuedate) {
        return message.info('账期异常，请刷新再试', 2)
    }
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    fetchApi('getIncomeExpendMxbReport', 'POST', JSON.stringify({
        begin,
        end,
        jrCategoryUuid: currentCategoryUuid,
        jrAbstract,
        currentPage,
        pageSize: Limit.MXB_PAGE_SIZE,
        needPeriod: 'true',
    }), json => {
        if (showMessage(json)) {
            dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(json))
            dispatch({
                type: ActionTypes.GET_INCOME_EXPEND_MXB_LIST_FROM_INCOME_EXPENDYEB,
                receivedData: json.data,
                issuedate: issuedate,
                endissuedate: endissuedate,
                currentCategoryUuid,
                jrAbstract,
                currentPage
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}
export const getIncomeExpendDetailCategory = (issuedate, endissuedate) => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
    fetchApi('getIncomeExpendMxbCategory', 'POST', JSON.stringify({
        begin,
        end,
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_INCOME_EXPEND_MXB_CATEGORY,
                receivedData: json.data.result,
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

export const changeIncomeExpendMxbChooseValue = (chooseValue) => ({
    type: ActionTypes.CHANGE_INCOME_EXPEND_MXB_CHOOSE_VALUE,
    chooseValue
})

export const changeIncomeExpendMxbSearchContent = (value) => ({
    type: ActionTypes.CHANGE_INCOME_EXPEND_MXB_SEARCH_CONTENT,
    value
})

export const changeIncomeExpendMxbCommonState = (parent, position, value) => ({type: ActionTypes.CHANGE_INCOME_EXPEND_MXB_COMMON_STATE, parent, position, value})
