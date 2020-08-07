import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.account.js'
import { toJS, fromJS } from 'immutable'

import { showMessage, jsonifyDate } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import { message } from 'antd'
import * as Limit from 'app/constants/Limit.js'

import * as allRunningActions from 'app/redux/Home/All/allRunning.action'

export const getPeriodAndRelativeYebBalanceList = (issuedate, endissuedate) => (dispatch,getState) => {
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	fetchApi('getRelativeYebReport', 'POST', JSON.stringify({
        begin,
        end,
        categoryUuid: '',
        cardCategoryUuid: '',
        jrCategoryUuid: '',
        needPeriod: 'true',
        analysisType: ''
	}),json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

        if (showMessage(json)) {
            const openedissuedate = dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(json))
            dispatch({
                type: ActionTypes.GET_PERIOD_AND_RELATIVE_YEB_BALANCE_LIST,
                receivedData: json.data.result,
                issuedate: issuedate ? issuedate : openedissuedate,
                endissuedate: endissuedate ? endissuedate : openedissuedate
            })
        }
	})
}

// 切换账期
export const getRelativeYebBalanceListFromSwitchPeriod = (issuedate, endissuedate, currentRelativeItem,currentRunningItem) => (dispatch,getState) => {
    if (!issuedate) {
        return message.info('账期异常，请刷新再试', 2)
    }
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
    const relativeYebState = getState().relativeYebState
    const analysisType = relativeYebState.getIn(['views','analysisType'])
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    fetchApi('getRelativeReportCategory', 'POST', JSON.stringify({
        begin,
        end,
        analysisType
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_RELATIVE_YEB_CATEGORY_FETCH,
                cardCategory: json.data.cardCategory,
                runningCategory: json.data.jrCategory,
            })
            let newRelativeItem = currentRelativeItem
            let hasItem = false
            if(json.data.cardCategory.length == 0){
                newRelativeItem = fromJS({
                    uuid: '全部',
                    name: '全部',
                    top: false,
                    value: '全部',
                })
            }else if(json.data.cardCategory.length > 0) {
                const loop = ( data ) => data.map((item, i) => {
                    if (item.childList && item.childList.length) {
                        loop(item.childList)
                    }else{
                        if(newRelativeItem.get('uuid') === item.uuid){
                            hasItem = true
                        }
                    }
                })
                loop(json.data.cardCategory)
            }

            if(!hasItem){
                newRelativeItem = fromJS({
                    uuid: '全部',
                    name: '全部',
                    top: false,
                    value: '全部',
                })
            }
            let newRunningItem = currentRunningItem
            let hasRunningItem = false
            if(json.data.jrCategory.length == 0){
                newRunningItem = fromJS({
                    uuid: '全部',
                    name: '全部',
                    value: '全部',
                })
            }else if(json.data.jrCategory.length > 0) {
                const loop = ( data ) => data.map((item, i) => {
                    if (item.childList && item.childList.length) {
                        loop(item.childList)
                    }else{
                        if(newRunningItem.get('uuid') === item.uuid){
                            hasRunningItem = true
                        }
                    }
                })
                loop(json.data.jrCategory)
            }

            if(!hasRunningItem){
                newRunningItem = fromJS({
                    uuid: '全部',
                    name: '全部',
                    top: false,
                    value: '全部',
                })
            }

            fetchApi('getRelativeYebReport', 'POST', JSON.stringify({
                begin,
                end,
                categoryUuid: newRelativeItem.get('name') === '全部' ? '' : (newRelativeItem.get('top') ? newRelativeItem.get('uuid') : ''),
                cardCategoryUuid: newRelativeItem.get('name') === '全部' ? '' : (newRelativeItem.get('top') ? '' : newRelativeItem.get('uuid')),
                jrCategoryUuid: newRunningItem.get('name') === '全部' ? '' : newRunningItem.get('uuid'),
                analysisType
            }),json => {
                dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

                if (showMessage(json)) {
                    dispatch({
                        type: ActionTypes.GET_RELATIVE_YEB_BALANCE_LIST_FROM_SWITCH_PERIOD_OR_RELATIVE,
                        receivedData: json.data.result,
                        issuedate: issuedate,
                        endissuedate: endissuedate,
                        relativeItem: newRelativeItem,
                        runningItem: newRunningItem
                    })
                }
            })



        }
    })
}

export const getRelativeYebBalanceListFromSwitchPeriodOrRelative = (issuedate, endissuedate, relativeItem,runningItem) => (dispatch,getState) => {

    if (!issuedate) {
        return message.info('账期异常，请刷新再试', 2)
    }
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
    const relativeYebState = getState().relativeYebState
    const analysisType = relativeYebState.getIn(['views','analysisType'])
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	fetchApi('getRelativeYebReport', 'POST', JSON.stringify({
        begin,
        end,
        categoryUuid: relativeItem.get('name') === '全部' ? '' : (relativeItem.get('top') ? relativeItem.get('uuid') : ''),
        cardCategoryUuid: relativeItem.get('name') === '全部' ? '' : (relativeItem.get('top') ? '' : relativeItem.get('uuid')),
        jrCategoryUuid: runningItem.get('name') === '全部' ? '' : runningItem.get('uuid'),
        analysisType,
	}),json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_RELATIVE_YEB_BALANCE_LIST_FROM_SWITCH_PERIOD_OR_RELATIVE,
                receivedData: json.data.result,
                issuedate: issuedate,
                endissuedate: endissuedate,
                relativeItem,
                runningItem
            })
        }
	})
}

export const getRelativeYebBalanceListRefresh = (issuedate, endissuedate, currentRelativeItem,currentRunningItem,orderBy='') => (dispatch,getState) => {

    if (!issuedate) {
        return message.info('账期异常，请刷新再试', 2)
    }
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
    const relativeYebState = getState().relativeYebState
    const analysisType = relativeYebState.getIn(['views','analysisType'])
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	fetchApi('getRelativeYebReport', 'POST', JSON.stringify({
        begin,
        end,
        categoryUuid: currentRelativeItem.get('name') === '全部' ? '' : (currentRelativeItem.get('top') ? currentRelativeItem.get('uuid') : ''),
        cardCategoryUuid: currentRelativeItem.get('name') === '全部' ? '' : (currentRelativeItem.get('top') ? '' : currentRelativeItem.get('uuid')),
        jrCategoryUuid: currentRunningItem.get('name') === '全部' ? '' : currentRunningItem.get('uuid'),
        needPeriod: 'true',
        orderBy,
        analysisType
	}),json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(json))
            dispatch({
                type: ActionTypes.GET_RELATIVE_YEB_BALANCE_LIST_REFRESH,
                receivedData: json.data.result,
                orderBy: orderBy
            })
        }
	})
}

export const getRelativeYebCategoryFetch = (issuedate, endissuedate) => (dispatch,getState) => {
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
    const relativeYebState = getState().relativeYebState
    const analysisType = relativeYebState.getIn(['views','analysisType'])
    fetchApi('getRelativeReportCategory', 'POST', JSON.stringify({
        begin,
        end,
        analysisType,
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.GET_RELATIVE_YEB_CATEGORY_FETCH,
                cardCategory: json.data.cardCategory,
                runningCategory: json.data.jrCategory,
            })
        }
    })
}

export const changeRelativeYebChooseValue = (chooseValue) => ({
    type: ActionTypes.CHANGE_RELATIVE_YEB_CHOOSE_VALUE,
    chooseValue
})

export const changeRelativeYebChildItemShow = (key, parentKey) => (dispatch,getState) => {
    const relativeYebState = getState().relativeYebState
    const balanceList = relativeYebState.getIn(['balanceReport','childList'])
    let totalNumber = 0
    const loop = (data) => data.map(item =>{
        if (item.get('childList') && item.get('childList').size) {
            loop(item.get('childList'))
        }
        totalNumber++
    })
    loop(balanceList)
    dispatch({
        type: ActionTypes.CHANGE_RELATIVE_YEB_CHILD_ITEM_SHOW,
        key,
        parentKey,
        totalNumber,
    })
}

export const changeRelativeYebAnalysisValue = (value) => ({
    type: ActionTypes.CHANGE_RELATIVE_YEB_ANALYSIS_VALUE,
    value
})
