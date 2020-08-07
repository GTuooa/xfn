import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.constant.js'
import * as allActions from 'app/redux/Home/All/other.action'
import { showMessage, jsonifyDate } from 'app/utils'
import * as Limit from 'app/constants/Limit.js'
import thirdParty from 'app/thirdParty'

export const getPeriodAndBossSheetFetch = (issuedate, bossSelectAssIndex = '0') => dispatch => {
	// allActions.getPeriodFetch('', dispatch, (issuedate) => dispatch(getBossSheetFetch(issuedate)))

	dispatch(AllGetBossListFetch(issuedate, bossSelectAssIndex, 'true'))
}

export const getBossSheetFetch = (issuedate, bossSelectAssIndex = '0') => (dispatch, getState) => {
	// if (bossSelectAssIndex === '0') {
	// 	fetchApi('getbosssheet', 'POST', JSON.stringify({
	// 		year: issuedate.substr(0,4),
	// 		month: issuedate.substr(5,2)
	// 	}), json => {
	// 		if (showMessage(json)) {
	// 			dispatch({
	// 				type: ActionTypes.CHANGE_BOSS_SELECT_ASSINDEX,
	// 				bossSelectAssIndex
	// 			})
	// 			dispatch({
	// 				type: ActionTypes.CHANGE_BOSS_ISSUEDATE,
	// 				issuedate
	// 			})
	// 			dispatch({
	// 				type: ActionTypes.GET_BOSS_SHEET_FETCH,
	// 				receivedData: json.data.resultList,
	// 				expenditure: json.data.expenditure,
	// 				income: json.data.income
	// 			})
	//
	// 			let bossAssList = json.data.assList
	// 			if (json.data.assList.length) {
	// 				bossAssList.unshift({assid: 0, assname: '全部', asscategory: 'asscategory'})
	// 			}
	// 			dispatch({
	// 				type: ActionTypes.CHANGE_BOSS_ASSLIST,
	// 				bossAssList
	// 			})
	// 		}
	// 	})
	// } else {
	// 	const bossAssItem = getState().bossState.getIn(['bossAssList', bossSelectAssIndex])
	// 	const asscategory = bossAssItem.get('asscategory')
	// 	const assid = bossAssItem.get('assid')
	//
	// 	fetchApi('getbosssheetamb', 'POST', JSON.stringify({
	// 		year: issuedate.substr(0, 4),
	// 		month: issuedate.substr(5, 2),
	// 		asscategory,
	// 		assid
	// 	}), json => {
	// 		if (showMessage(json)) {
	// 			dispatch({
	// 				type: ActionTypes.CHANGE_BOSS_SELECT_ASSINDEX,
	// 				bossSelectAssIndex
	// 			})
	//
	// 			dispatch({
	// 				type: ActionTypes.CHANGE_BOSS_ISSUEDATE,
	// 				issuedate
	// 			})
	//
	// 			dispatch({
	// 				type: ActionTypes.GET_BOSS_SHEET_FETCH,
	// 				receivedData: json.data.resultList,
	// 				expenditure: json.data.expenditure,
	// 				income: json.data.income
	// 			})
	// 		}
	// 	})
	// }
	dispatch(AllGetBossListFetch(issuedate, bossSelectAssIndex))
}

const AllGetBossListFetch = (issuedate, bossSelectAssIndex, getPeriod) => (dispatch, getState) => {
	let options = {}
	let url = ''

	if (bossSelectAssIndex === '0') {
		url = 'getbosssheet'
		options = {
			year: issuedate ? issuedate.substr(0,4) : '',
			month: issuedate ? issuedate.substr(5,2) : '',
			getPeriod
		}
	} else {

		const bossAssItem = getState().bossState.getIn(['bossAssList', bossSelectAssIndex])
		const asscategory = bossAssItem.get('asscategory')
		const assid = bossAssItem.get('assid')

		url = 'getbosssheetamb'
		options = {
			year: issuedate ? issuedate.substr(0,4) : '',
			month: issuedate ? issuedate.substr(5,2) : '',
			asscategory,
			assid
		}
	}
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi(url, 'POST', JSON.stringify(options), json => {

		if (showMessage(json)) {
			thirdParty.toast.hide()
			let issuedateNew = ''
			if (getPeriod == 'true') {
				const openedissuedate = dispatch(allActions.everyTableGetPeriod(json))
				issuedateNew = issuedate ? issuedate : openedissuedate
			} else {
				issuedateNew = issuedate
			}

			dispatch({
				type: ActionTypes.CHANGE_BOSS_SELECT_ASSINDEX,
				bossSelectAssIndex
			})

			dispatch({
				type: ActionTypes.CHANGE_BOSS_ISSUEDATE,
				issuedate: issuedateNew
			})

			dispatch({
				type: ActionTypes.GET_BOSS_SHEET_FETCH,
				receivedData: json.data.resultList,
				expenditure: json.data.expenditure,
				income: json.data.income
			})

			if (bossSelectAssIndex === '0') {
				let bossAssList = json.data.assList
				if (json.data.assList.length) {
					bossAssList.unshift({assid: 0, assname: '全部', asscategory: 'asscategory'})
				}
				dispatch({
					type: ActionTypes.CHANGE_BOSS_ASSLIST,
					bossAssList
				})
			}
		}
	})


}
