import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.running.js'
import { showMessage } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import { message } from 'antd'
import * as Limit from 'app/constants/Limit.js'

import * as allActions from 'app/redux/Home/All/other.action'

// 首次进入
export const getPeriodAndRunningTypeYebBalanceList = (issuedate, endissuedate) => (dispatch,getState) => {

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('getRunningTypeYebReport', 'POST', JSON.stringify({
        begin: issuedate,
        end: endissuedate,
        needPeriod: 'true',
    }), json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            let  issuedateNew = issuedate
            const openedissuedate = dispatch(allActions.reportGetIssuedateAndFreshPeriod(json))
            issuedateNew = issuedate ? issuedate : openedissuedate
            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : []
            dispatch({
                type: ActionTypes.AFTER_GET_PERIOD_AND_RUNNING_TYPE_YEB_BALANCE_LIST,
                receivedData: json.data,
                issuedate: issuedate ? issuedate : issuedateNew,
                endissuedate: endissuedate ? endissuedate : '',
                getPeriod: 'true',
                issues,
            })
        }
	})
}

export const getRunningTypeYebBalanceList = (issuedate, endissuedate) => (dispatch,getState) => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('getRunningTypeYebReport', 'POST', JSON.stringify({
        begin: issuedate,
        end: endissuedate,
        needPeriod: '',
    }), json => {
        thirdParty.toast.hide()
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

export const runningTypeBalanceTriangleSwitch = (showChild, uuid) => ({
      type: ActionTypes.RUNNING_TYPE_YEB_BALANCE_TRIANGLE_SWITCH,
      showChild,
      uuid
})
export const changeRunningTypeYebChooseValue = (value) => ({
      type: ActionTypes.CHANGE_RUNNING_TYPE_YEB_CHOOSE_VALUE,
      value,
})
export const initState = () => ({
      type: ActionTypes.INIT_RUNNING_TYPE_YEB
})
