import * as ActionTypes from './ActionTypes.js'
import { showMessage, jsonifyDate } from 'app/utils'
import * as allActions from 'app/redux/Home/All/all.action'
import * as allRunningActions from 'app/redux/Home/All/allRunning.action'
import * as thirdParty from 'app/thirdParty'
import fetchApi from 'app/constants/fetch.constant.js'
import { toJS } from 'immutable'

// 刷新时，获取账期及balancesheet
export const getPeriodAndBalanceSheetFetch = (issuedate) => (dispatch,getState) => {
	const userInfo = getState().homeState.getIn(['data', 'userInfo'])
    const sobInfo = userInfo.get('sobInfo')
	const newJr = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'newJr'])
    const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1 && newJr : false
	let options = {}
	if (isRunning) {
		options = {
			needPeriod: 'true',
			begin:issuedate?`${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}`:'',
			end:issuedate?`${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}`:'',
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
	dispatch(alertGetPeriodAndBalance(options, issuedate))
	dispatch(showInitZcfzb(false))
}

// 合并获取账期和页面数据
const alertGetPeriodAndBalance = (options, issuedate) => (dispatch,getState) => {
	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	const userInfo = getState().homeState.getIn(['data', 'userInfo'])
    const sobInfo = userInfo.get('sobInfo')
	const newJr = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'newJr'])
    const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1 && newJr : false
	fetchApi(isRunning?'getJrAssets':'getbalancesheet', 'POST', JSON.stringify(options), json => {
		if (showMessage(json)) {

			// 更新得到的period数据并返回openedyear,openedmonth拼接的issuedate
            const openedissuedate = isRunning ? dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(json)) : dispatch(allActions.everyTableGetPeriod(json))
			const issuedateNew = issuedate ? issuedate : openedissuedate
            const issues = json.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(json.data.periodDtoJson)) : ''
			const balancesheet = {data: json.data.jsonArray}
			dispatch({
				type: ActionTypes.GET_BALANCE_SHEET_FETCH,
				receivedData: balancesheet,
				issuedate: issuedateNew,
				issues
			})
		} else {
			dispatch({type: ActionTypes.INIT_ZCFZB})
		}
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	})
}

// 获取balancesheet，并将数据赋值给state
export const getBalanceSheetFetch = (issuedate) => (dispatch,getState) => {
	// dispatch({type: ActionTypes.BEFORE_GET_BALANCE_SHEET_FETCH})
	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	const userInfo = getState().homeState.getIn(['data', 'userInfo'])
    const sobInfo = userInfo.get('sobInfo')
	const newJr = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'newJr'])
    const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1 && newJr : false
    let options = {}
    if (isRunning) {
    	options = {
    		begin:`${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}`,
			end: `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}`,
			needPeriod:'false'
    	}
	} else {
    		options= jsonifyDate(issuedate)
    }
	fetchApi(isRunning?'getJrAssets':'getbalancesheet', 'POST', JSON.stringify(options), json => {
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.GET_BALANCE_SHEET_FETCH,
				receivedData: json,
				issuedate
			})
		} else {
			dispatch({
				type: ActionTypes.INIT_ZCFZB,
				issuedate
			})
		}
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	})
}

export const getInitBaSheetValue = () => ({
	type: ActionTypes.GET_INIT_BAL_SHEET_VALUE
})
export const changeInitZcfzbAmount = (lineIndex, value) => ({
	type: ActionTypes.CHANGE_INIT_ZCFZB_AMOUNT,
	lineIndex,
	value
})

export const clearInitAmount = () => ({
	type: ActionTypes.CLEAR_INIT_AMOUNT
})

// 年初余额
export const saveInitZcfzbFetch = () => (dispatch, getState) => {
	let initBaSheetList = getState().zcfzbState.get('initBaSheetList')
	const userInfo = getState().homeState.getIn(['data', 'userInfo'])
    const sobInfo = userInfo.get('sobInfo')
	const newJr = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'newJr'])
    const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1 && newJr : false
	if (initBaSheetList.getIn([29, 'amount']) != initBaSheetList.getIn([52, 'amount'])) {
		initBaSheetList = initBaSheetList.filter(v => v.get('amount') !== '' && v.get('amount') != 0)

		thirdParty.Confirm({
			message: "资产总计不等于负债和权益总计，是否保存",
			title: "提示",
			buttonLabels: ['取消', '确定'],
			onSuccess : (result) => {
				if (result.buttonIndex === 1) {
					dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
					initBaSheetFecth(initBaSheetList,isRunning)
				}
			}
		})
	} else {
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
		initBaSheetList = initBaSheetList.filter(v => v.get('amount') !== '' && v.get('amount') != 0)
		initBaSheetFecth(initBaSheetList,isRunning)
	}

	function initBaSheetFecth (initBaSheetList,isRunning){
		fetchApi(isRunning?'assetsBalanceModify':'getInitBaSheet', 'POST', JSON.stringify({
			initBaSheetList
		}), json => {
			showMessage(json, 'show')
			dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
		})
	}

}
export const showInitZcfzb = (value) => ({
	type: ActionTypes.SHOW_INIT_ZCFZB,
	value
})
