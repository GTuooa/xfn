import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.account.js'
import { toJS, fromJS } from 'immutable'

import { showMessage, jsonifyDate } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import { message } from 'antd'

import * as allRunningActions from 'app/redux/Home/All/allRunning.action'

// 首次以及刷新获取列表
export const getPeriodAndAccountYebBalanceList = (issuedate, endissuedate) => (dispatch,getState) => {

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
	fetchApi('getAccountYebReport', 'POST', JSON.stringify({
        begin,
        end,
        needPeriod: 'true',
    }), json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
			const openedissuedate = dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(json))
            dispatch({
                type: ActionTypes.AFTER_GET_PERIOD_AND_ACCOUNT_YEB_BALANCE_LIST,
                receivedData: json.data,
                issuedate: issuedate ? issuedate : openedissuedate,
                endissuedate: endissuedate ? endissuedate : openedissuedate,
            })
        }
	})
}

// 切换账期获取列表
export const getAccountYebBalanceList = (issuedate, endissuedate) => (dispatch, getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''

    fetchApi('getAccountYebReport', 'POST', JSON.stringify({
        begin,
        end,
    }), json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.AFTER_GET_PERIOD_AND_ACCOUNT_YEB_BALANCE_LIST,
                receivedData: json.data,
                issuedate: issuedate,
                endissuedate: endissuedate,
            })
        }
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    })
}

export const changeAccountYebChooseValue = (chooseValue) => ({
    type: ActionTypes.CHANGE_ACCOUNT_YEB_CHOOSE_VALUE,
    chooseValue
})
