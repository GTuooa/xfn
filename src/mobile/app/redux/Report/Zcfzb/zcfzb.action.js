import { showMessage, jsonifyDate } from 'app/utils'
import fetchApi from 'app/constants/fetch.constant'
import * as allActions from 'app/redux/Home/All/other.action'
import * as ActionTypes from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'
import * as thirdParty from 'app/thirdParty'

export const getPeriodAndBalanceSheetFetch = (issuedate) => (dispatch,getState) => {
	// allActions.getPeriodFetch('', dispatch, (issuedate) => dispatch(getBalanceSheetFetch(issuedate)))
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	const userInfo = getState().homeState.getIn(['data', 'userInfo'])
    const sobInfo = userInfo.get('sobInfo')
	const newJr = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'newJr'])
	const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1 && newJr : false
	let options = {}
	if (isRunning) {
		options = {
			needPeriod: 'true',
			begin:issuedate?`${issuedate.substr(0, 4)}-${issuedate.substr(5, 2)}`:'',
			end:issuedate?`${issuedate.substr(0, 4)}-${issuedate.substr(5, 2)}`:'',
		}
	} else if (!issuedate) {
		// 进入页面发送的参数
		options = {
			getPeriod: 'true',
			year: '',
			month: ''
		}
	} else {
		// 刷新时获得的参数
		const jsonDate = jsonifyDate(issuedate)
		options = {
			...jsonDate,
			getPeriod: 'true'
		}
	}
	fetchApi(isRunning? 'getJrbalancesheet' :'getbalancesheet', 'POST', JSON.stringify(options), json => {
		if (showMessage(json)) {
			thirdParty.toast.hide()
            const openedissuedate = isRunning ? dispatch(allActions.reportGetIssuedateAndFreshPeriod(json)) : dispatch(allActions.everyTableGetPeriod(json))
			const issuedateNew = issuedate ? issuedate : openedissuedate
			const balancesheet = {data: json.data.jsonArray}
            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : ''
			dispatch(freshZcfzb(balancesheet, issuedateNew,issues))
		}
	})
}

export const getBalanceSheetFetch = (issuedate) => (dispatch,getState) => {
	const userInfo = getState().homeState.getIn(['data', 'userInfo'])
    const sobInfo = userInfo.get('sobInfo')
	const newJr = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'newJr'])
    const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1 && newJr : false
	let options = {}
	if (isRunning) {
		options = {
			begin:issuedate?`${issuedate.substr(0, 4)}-${issuedate.substr(5, 2)}`:'',
			end:issuedate?`${issuedate.substr(0, 4)}-${issuedate.substr(5, 2)}`:'',
		}
	} else {
		// 刷新时获得的参数
		const jsonDate = jsonifyDate(issuedate)
		options = {
			...jsonDate,
		}
	}
	fetchApi(isRunning? 'getJrbalancesheet' :'getbalancesheet', 'POST', JSON.stringify(options), json => showMessage(json) && dispatch(freshZcfzb(json, issuedate)))
}

const freshZcfzb = (json, issuedate,issues) => ({
	type: ActionTypes.GET_BALANCE_SHEET_FETCH,
	receivedData: json,
	issuedate,
	issues
})

export const toggleBalanceLineDisplay = (blockIdx) => ({
	type: ActionTypes.TOGGLE_BALANCE_LINE_DISPLAY,
	blockIdx
})
