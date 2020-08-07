import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.account.js'
import { showMessage } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import { message } from 'antd'
import * as Limit from 'app/constants/Limit.js'

import * as allRunningActions from 'app/redux/Home/All/allRunning.action'

// 从余额表跳明细表
export const getRunningTypeMxbListFromRunningTypeYeb = (issuedate, endissuedate, currentTypeUuid) => dispatch => {

    if (!issuedate) {
        return message.info('账期异常，请刷新再试', 2)
    }
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
    dispatch(getRunningTypeDetailCategory(issuedate, endissuedate))

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getRunningTypeMxbReport', 'POST', JSON.stringify({
        begin,
        end,
        acId: currentTypeUuid,
        jrAbstract:'',
        pageNum: 1,
        pageSize: Limit.MXB_PAGE_SIZE,
        needPeriod: 'true',
    }), json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(json))
            dispatch({
                type: ActionTypes.GET_RUNNING_TYPE_MXB_LIST_FROM_RUNNING_TYPEYEB,
                receivedData: json.data,
                issuedate: issuedate,
                endissuedate: endissuedate,
                currentTypeUuid,
                jrAbstract: '',
                currentPage: 1,
            })
        }
    })
}
export const getPeriodAndRunningTypeMxbListFromDate = (issuedate, endissuedate,currentTypeUuid = '',jrAbstract = '') => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
    dispatch(getRunningTypeDetailCategory(issuedate, endissuedate))
    fetchApi('getRunningTypeMxbReport', 'POST', JSON.stringify({
        begin,
        end,
        acId: currentTypeUuid,
        jrAbstract: jrAbstract,
        pageNum: 1,
        pageSize: Limit.MXB_PAGE_SIZE,
        needPeriod: 'true',
    }), result => {
        if (showMessage(result)) {
            const openedissuedate = issuedate ? issuedate : dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(result))
            dispatch({
                type: ActionTypes.GET_RUNNING_TYPE_MXB_LIST_FROM_RUNNING_TYPEYEB,
                receivedData: result.data,
                issuedate: openedissuedate,
                endissuedate: endissuedate,
                currentTypeUuid: '',
                acName: '全部',
                jrAbstract,
                currentPage: 1,
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })

}
export const getPeriodAndRunningTypeMxbListFromReflash = (issuedate, endissuedate,typeUuid,jrAbstract) => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
    fetchApi('getRunningTypeMxbCategory', 'POST', JSON.stringify({
        begin,
        end,
        needPeriod: 'true',
    }), json => {
        if (showMessage(json)) {
            dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(json))
            const openedissuedate = issuedate ? issuedate : dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(json))
            dispatch({
                type: ActionTypes.GET_RUNNING_TYPE_MXB_CATEGORY,
                receivedData: json.data.tree,
            })
            let currentTypeUuid = typeUuid
            let currentacName = '',currentOriName = ''
            let hasTypeItem = false
            if(json.data.tree.childList.length > 0){
                const loop = (data) => data.map(item => {
                    if(item.acId == typeUuid){
                        hasTypeItem = true
                        currentacName = item.acName,
                        currentOriName = item.mergeName
                    }
                    if(item.childList.length > 0){
                        loop(item.childList)
                    }
                })
                loop(json.data.tree.childList)
                if(!hasTypeItem){
                    currentTypeUuid = json.data.tree.childList[0].acId
                    currentacName = json.data.tree.childList[0].acName
                    currentOriName = json.data.tree.childList[0].mergeName
                }
                fetchApi('getRunningTypeMxbReport', 'POST', JSON.stringify({
                    begin,
                    end,
                    acId: currentTypeUuid,
                    jrAbstract: jrAbstract,
                    pageNum: 1,
                    pageSize: Limit.MXB_PAGE_SIZE,
                    needPeriod: 'true',
                }), result => {
                    if (showMessage(result)) {
                        dispatch({
                            type: ActionTypes.GET_RUNNING_TYPE_MXB_LIST_FROM_RUNNING_TYPEYEB,
                            receivedData: result.data,
                            issuedate: openedissuedate,
                            endissuedate: endissuedate,
                            currentTypeUuid,
                            acName: currentOriName,
                            oriName: currentacName,
                            jrAbstract,
                            currentPage: 1,
                        })
                    }
                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                })
            }else{
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                dispatch({
                    type: ActionTypes.GET_RUNNING_TYPE_MXB_LIST_NO_TYPE_TREE,
                    issuedate: openedissuedate,
                    endissuedate: endissuedate,
                    jrAbstract
                })
            }
        }else{
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        }
    })

}
export const getPeriodAndRunningTypeMxbList = (issuedate, endissuedate,currentCategoryUuid = '',jrAbstract = '') => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
    fetchApi('getRunningTypeMxbCategory', 'POST', JSON.stringify({
        begin,
        end,
        needPeriod: 'true',
    }), json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(json))
            if(json.data.tree.childList[0]){
                dispatch({
                    type: ActionTypes.GET_RUNNING_TYPE_MXB_CATEGORY,
                    receivedData: json.data.tree,
                })
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                fetchApi('getRunningTypeMxbReport', 'POST', JSON.stringify({
                    begin,
                    end,
                    acId: json.data.tree.childList[0].acId || '',
                    jrAbstract: jrAbstract,
                    pageNum: 1,
                    pageSize: Limit.MXB_PAGE_SIZE,
                    needPeriod: 'true',
                }), result => {
                    if (showMessage(result)) {
                        const openedissuedate = issuedate ? issuedate : dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(result))
                        dispatch({
                            type: ActionTypes.GET_RUNNING_TYPE_MXB_LIST_FROM_RUNNING_TYPEYEB,
                            receivedData: result.data,
                            issuedate: openedissuedate,
                            endissuedate: endissuedate,
                            currentTypeUuid: json.data.tree.childList[0].acId,
                            acName: json.data.tree.childList[0].mergeName,
                            oriName: json.data.tree.childList[0].acName,
                            jrAbstract,
                            currentPage: 1,
                        })
                    }
                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                })
            }else{
                const openedissuedate = issuedate ? issuedate : dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(json))
                dispatch({
                    type: ActionTypes.GET_RUNNING_TYPE_MXB_LIST_NO_TYPE_TREE,
                    issuedate: openedissuedate,
                    endissuedate: endissuedate,
                    jrAbstract
                })
            }

        }
    })

}

export const getRunningTypeMxbBalanceListPages = (issuedate, endissuedate,currentTypeUuid = '',jrAbstract = '',currentPage = 1) => (dispatch, getState) => {
    if (!issuedate) {
        return message.info('账期异常，请刷新再试', 2)
    }
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
    fetchApi('getRunningTypeMxbReport', 'POST', JSON.stringify({
        begin,
        end,
        acId: currentTypeUuid,
        jrAbstract,
        pageSize: Limit.MXB_PAGE_SIZE,
        needPeriod: 'true',
        pageNum: currentPage,
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_RUNNING_TYPE_MXB_LIST_FROM_RUNNING_TYPEYEB,
                receivedData: json.data,
                issuedate: issuedate,
                endissuedate: endissuedate,
                currentTypeUuid,
                jrAbstract,
                currentPage,
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}
export const getRunningTypeDetailCategory = (issuedate, endissuedate) => dispatch => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
    fetchApi('getRunningTypeMxbCategory', 'POST', JSON.stringify({
        begin,
        end,
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_RUNNING_TYPE_MXB_CATEGORY,
                receivedData: json.data.tree,
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

export const changeRunningTypeMxbChooseValue = (chooseValue) => ({
    type: ActionTypes.CHANGE_RUNNING_TYPE_MXB_CHOOSE_VALUE,
    chooseValue
})

export const changeRunningTypeMxbSearchContent = (value) => ({
    type: ActionTypes.CHANGE_RUNNING_TYPE_MXB_SEARCH_CONTENT,
    value
})

export const changeRunningTypeMxbCommonState = (parent, position, value) => ({type: ActionTypes.CHANGE_RUNNING_TYPE_MXB_COMMON_STATE, parent, position, value})
