import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.account.js'
import { showMessage } from 'app/utils'
import thirdParty from 'app/thirdParty'
import { message } from 'antd'
import * as Limit from 'app/constants/Limit.js'

import * as allRunningActions from 'app/redux/Home/All/allRunning.action'

// 首次以及刷新获取列表
export const getPeriodAndIncomeExpendYebBalanceList = (issuedate, endissuedate) => (dispatch,getState) => {

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
	fetchApi('getIncomeExpendYebReport', 'POST', JSON.stringify({
        begin,
        end,
        needPeriod: 'true',
    }), json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
			const openedissuedate = dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(json))
            dispatch({
                type: ActionTypes.AFTER_GET_PERIOD_AND_INCOME_EXPEND_YEB_BALANCE_LIST,
                receivedData: json.data,
                issuedate: issuedate ? issuedate : openedissuedate,
                endissuedate: endissuedate ? endissuedate : openedissuedate,
            })
        }
	})
}
export const getIncomeExpendYebBalanceList = (issuedate, endissuedate) => (dispatch,getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
	fetchApi('getIncomeExpendYebReport', 'POST', JSON.stringify({
        begin,
        end,
        needPeriod: '',
    }), json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.AFTER_GET_PERIOD_AND_INCOME_EXPEND_YEB_BALANCE_LIST,
                receivedData: json.data,
                issuedate: issuedate,
                endissuedate: endissuedate,
            })
        }
	})
}
export const getIncomeExpendMxbListFromPage = (issuedate, endissuedate, currentPage) => (dispatch,getState) => {

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
    const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''
	fetchApi('getIncomeExpendYebReport', 'POST', JSON.stringify({
        begin,
        end,
        needPeriod: '',
    }), json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.AFTER_GET_PERIOD_AND_INCOME_EXPEND_YEB_BALANCE_LIST,
                receivedData: json.data,
                issuedate: issuedate,
                endissuedate: endissuedate,
            })
        }
	})
}
export const changeIncomeExpendYebItemShow = (value) => dispatch => {
    dispatch({
        type: ActionTypes.CHANGE_INCOME_EXPEND_YEB_ITEM_SHOW,
        value
    })
}

export const changeIncomeExpendYebChildItemShow = (showChild, uuid) => ({
    type: ActionTypes.INCOME_EXPEND_BALANCE_TRIANGLE_SWITCH,
    showChild,
    uuid
})
export const changeIncomeExpendYebChooseValue = (chooseValue) => ({
    type: ActionTypes.CHANGE_INCOME_EXPEND_YEB_CHOOSE_VALUE,
    chooseValue
})
