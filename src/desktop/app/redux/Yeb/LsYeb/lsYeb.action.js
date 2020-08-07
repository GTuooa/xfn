import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.account.js'
import { toJS, fromJS } from 'immutable'

import { showMessage, jsonifyDate } from 'app/utils'

import * as allActions from 'app/redux/Home/All/all.action'
import * as accountConfActions from 'app/redux/Config/Account/account.action'

export const getPeriodAndBalanceList = (issuedate) => (dispatch,getState) => {

    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	fetchApi('getBusinessBalanceList', 'POST',JSON.stringify({
		year: issuedate ? issuedate.substr(0, 4) : '',
		month: issuedate ? issuedate.substr(6, 2) : '',
        endYear:'',
        endMonth:'',
        getPeriod: "true"
	}),json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
			// if (json.code === 0 && !json.data.vcList.length) {
			// 	message.info('当前月份无任何凭证')
			// }
			const openedissuedate = dispatch(allActions.everyTableGetPeriod(json))
			const issuedateNew = issuedate ? issuedate : openedissuedate
            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : ''
            dispatch({
                type: ActionTypes.GET_BALANCE_LIST,
                receivedData: json.data.result,
                period: json.data.periodDtoJson,
                issuedate: issuedateNew,
                getPeriod: "true",
                issues
            })
        }
	})
  dispatch(accountConfActions.getRunningAccount())


}

export const getBusinessBalanceList = (issuedate,endissuedate) => (dispatch,getState) => {
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    fetchApi('getBusinessBalanceList', 'POST',JSON.stringify({
        year: issuedate ? issuedate.substr(0, 4) : '',
        month: issuedate ? issuedate.substr(6, 2) : '',
        endYear: endissuedate ? endissuedate.substr(0, 4) : '',
        endMonth: endissuedate ? endissuedate.substr(6, 2) : '',
        getPeriod: "true"
    }),json => {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if (showMessage(json)) {
            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : ''
          dispatch({
            type: ActionTypes.GET_BALANCE_LIST,
            receivedData: json.data.result,
            period: json.data.periodDtoJson,
            issuedate,
            issues,
            endissuedate,
            getPeriod: "true"
          })
        }
    })


}

export const accountBalanceTriangleSwitch = (showChild, uuid) => ({
    type: ActionTypes.ACCOUNTCONF_BALANCE_TRIANGLE_SWITCH,
    showChild,
    uuid
})

export const changeLsyeMorePeriods = (chooseperiods) => ({
    type: ActionTypes.CHANGE_LSYE_MORE_PERIODS,
    chooseperiods
})
