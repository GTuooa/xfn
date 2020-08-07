import { showMessage, jsonifyDate } from 'app/utils'
import fetchApi from 'app/constants/fetch.account'

import * as allActions from 'app/redux/Home/All/other.action'

import * as ActionTypes from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'
import thirdParty from 'app/thirdParty'

export const getPeriodAndBalanceList = (issuedate,endissuedate) => (dispatch,getState) => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('getAccountBalanceList', 'POST',JSON.stringify({
		year: issuedate ? issuedate.substr(0, 4) : '',
		month: issuedate ? issuedate.substr(5, 2) : '',
        endYear: endissuedate ? endissuedate.substr(0, 4) : '',
        endMonth: endissuedate ? endissuedate.substr(6, 2) : '',
        getPeriod: "true"
	}),json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
			// if (json.code === 0 && !json.data.vcList.length) {
			// 	message.info('当前月份无任何凭证')
			// }
			const openedissuedate = dispatch(allActions.everyTableGetPeriod(json))
			const issuedateNew = issuedate ? issuedate : openedissuedate
            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : []

            dispatch({
                type: ActionTypes.GET_ZH_BALANCE_LIST,
                receivedData: json.data.result,
                period: json.data.periodDtoJson,
                issuedate: issuedateNew,
                getPeriod: "true",
                issues,
                allBeginAmount: json.data.allBeginAmount,
                allIncomeAmount: json.data.allIncomeAmount,
                allExpenseAmount: json.data.allExpenseAmount,
                allBalanceAmount: json.data.allBalanceAmount
            })
        }
	})
}

const freshZhyeb = (json, issuedate, endissuedate, period,getPeriod) => dispatch => {
    const issues = period? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : []
	dispatch({
		type: ActionTypes.GET_ZH_BALANCE_LIST,
		receivedData: json,
		issuedate,
		endissuedate,
		period,
        issues,
		getPeriod
	})
}
export const getAccountBalanceList = (issuedate,endissuedate='') => (dispatch,getState) => {
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('getAccountBalanceList', 'POST',JSON.stringify({
		year: issuedate ? issuedate.substr(0, 4) : '',
		month: issuedate ? issuedate.substr(5, 2) : '',
		endYear: endissuedate ? endissuedate.substr(0, 4) : '',
		endMonth: endissuedate ? endissuedate.substr(5, 2) : '',
        getPeriod: ""
	}),json => {
        thirdParty.toast.hide()
        if (showMessage(json)) {
            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : []
          dispatch({
            type: ActionTypes.GET_ZH_BALANCE_LIST,
            receivedData: json.data.result,
            period: json.data.periodDtoJson,
            issuedate,
            issues,
            endissuedate,
            getPeriod: "",
            allBeginAmount: json.data.allBeginAmount,
            allIncomeAmount: json.data.allIncomeAmount,
            allExpenseAmount: json.data.allExpenseAmount,
            allBalanceAmount: json.data.allBalanceAmount
          })
        }
	})
}
export const accountBalanceTriangleSwitch = (showChild, uuid) => ({
      type: ActionTypes.ACCOUNTCONF_ZH_BALANCE_TRIANGLE_SWITCH,
      showChild,
      uuid
  })
