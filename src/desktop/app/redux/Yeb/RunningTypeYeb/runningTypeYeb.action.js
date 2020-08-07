import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.account.js'
import { showMessage } from 'app/utils'
import thirdParty from 'app/thirdParty'
import { message } from 'antd'
import * as Limit from 'app/constants/Limit.js'

import * as allRunningActions from 'app/redux/Home/All/allRunning.action'

// 首次以及刷新获取列表
export const getPeriodAndRunningTypeYebBalanceList = (issuedate, endissuedate) => (dispatch,getState) => {
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	fetchApi('getRunningTypeYebReport', 'POST', JSON.stringify({
        begin,
        end,
        needPeriod: 'true',
    }), json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
			const openedissuedate = dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(json))
            dispatch({
                type: ActionTypes.AFTER_GET_PERIOD_AND_RUNNING_TYPE_YEB_BALANCE_LIST,
                receivedData: json.data,
                issuedate: issuedate ? issuedate : openedissuedate,
                endissuedate: endissuedate ? endissuedate : openedissuedate,
            })
        }
	})
}
export const getRunningTypeYebBalanceList = (issuedate, endissuedate) => (dispatch,getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
	fetchApi('getRunningTypeYebReport', 'POST', JSON.stringify({
        begin,
        end,
        needPeriod: '',
    }), json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.AFTER_GET_PERIOD_AND_RUNNING_TYPE_YEB_BALANCE_LIST,
                receivedData: json.data,
                issuedate: issuedate,
                endissuedate: endissuedate,
            })
        }
	})
}
export const getRunningTypeMxbListFromPage = (issuedate, endissuedate, currentPage) => (dispatch,getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
	fetchApi('getRunningTypeYebReport', 'POST', JSON.stringify({
        begin,
        end,
        needPeriod: '',
    }), json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.AFTER_GET_PERIOD_AND_RUNNING_TYPE_YEB_BALANCE_LIST,
                receivedData: json.data,
                issuedate: issuedate,
                endissuedate: endissuedate,
            })
        }
	})
}

export const changeRunningTypeYebChildItemShow = (showChild, uuid) => ({
    type: ActionTypes.RUNNING_TYPE_BALANCE_TRIANGLE_SWITCH,
    showChild,
    uuid
})
export const changeRunningTypeYebChildItemAllShow = (isShowAll) => ({
    type: ActionTypes.RUNNING_TYPE_BALANCE_TRIANGLE_SWITCH_ALL,
    isShowAll
})
export const changeRunningTypeYebChooseValue = (chooseValue) => ({
    type: ActionTypes.CHANGE_RUNNING_TYPE_YEB_CHOOSE_VALUE,
    chooseValue
})
