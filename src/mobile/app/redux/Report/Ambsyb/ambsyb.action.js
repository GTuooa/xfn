import { showMessage, jsonifyDate } from 'app/utils'
import fetchApi from 'app/constants/fetch.constant.js'
import * as allActions from 'app/redux/Home/All/other.action'
import * as ActionTypes from './ActionTypes.js'
import thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'

export const getPeriodAndAMBIncomeStatementFetch = (issuedate, endissuedate, assId, assCategory) => dispatch => {
	// if (!issuedate) {
	// 	allActions.getPeriodFetch('', dispatch, (issuedate) => dispatch(getAMBIncomeStatementFetch(issuedate)))
	// } else {
	// 	fetchApi('getperiod', 'GET', '', json => {
	// 		if (showMessage(json)) {
	// 			dispatch({
	// 				type: ActionTypes.GET_PERIOD_FETCH,
	// 				receivedData: json
	// 			})
	// 			dispatch(getAMBIncomeStatementFetch(issuedate))
	// 		}
	// 	})
	// }

	// fetchApi('AMBIncomeStatement', 'POST', JSON.stringify({
	// 	begin: issuedate ? `${issuedate.substr(0, 4)}${issuedate.substr(5, 2)}` : '',
	// 	end: issuedate ? `${issuedate.substr(0, 4)}${issuedate.substr(5, 2)}` : '',
	// 	ass: {
	// 		assId: '',
	// 		assCategory: ''
	// 	},
	// 	getPeriod: 'true'
	// }), json => {
	// 	if (json.code === 0) {
	// 		const openedissuedate = dispatch(allActions.everyTableGetPeriod(json))
	// 		const issuedateNew = issuedate ? issuedate : openedissuedate
	//
	// 		dispatch(afterGetAMBIncomeStatement(json, issuedateNew))
	// 	} else {
	// 		dispatch(afterGetAMBIncomeStatement(json, issuedate))
	// 	}
	// })

	dispatch(getAMBIncomeStatementFetch(issuedate, endissuedate, assId, assCategory, 'true'))
}

export const getAMBIncomeStatementFetch = (issuedate, endissuedate, assId, assCategory, getPeriod) => dispatch => {

	// const begin = issuedate.substr(0, 4)+''+issuedate.substr(5, 2)
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('AMBIncomeStatement', 'POST', JSON.stringify({
		begin: issuedate ? `${issuedate.substr(0, 4)}${issuedate.substr(5, 2)}` : '',
		end: endissuedate ? `${endissuedate.substr(0, 4)}${endissuedate.substr(5, 2)}` : (issuedate ? `${issuedate.substr(0, 4)}${issuedate.substr(5, 2)}` : ''),
		ass: {
			assId: assId ? assId : '',
			assCategory: assCategory ? assCategory : ''
		},
		getPeriod
	}), json => {
		if (json.code === 23001) {
			thirdParty.toast.hide()
			thirdParty.Alert(json.message, '收到')

		} else {
			if (showMessage(json)) {
				thirdParty.toast.hide()
				if (getPeriod === 'true') {

					const openedissuedate = dispatch(allActions.everyTableGetPeriod(json))
					const issuedateNew = issuedate ? issuedate : openedissuedate

					dispatch({
						type: ActionTypes.GET_AMB_INCOMESTATEMENT_FETCH,
						// receivedData: json.data.ambIncomeStatementJson,
						receivedData: json.data.mainData,
						issuedate: issuedateNew,
						assId,
						assCategory
					})

				} else {
					dispatch({
						type: ActionTypes.GET_AMB_INCOMESTATEMENT_FETCH,
						// receivedData: json.data,
						receivedData: json.data.mainData,
						issuedate,
						endissuedate,
						assId,
						assCategory
					})
				}

				dispatch(changeCharDidmount(true))
			}
		}
		// dispatch(afterGetAMBIncomeStatement(json, issuedate, assId, assCategory))
	})
}

export const getAmbAssCategoryList = () => dispatch => {
	fetchApi('asslistforamb', 'GET', '', json => {
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.GET_AMB_ASS_CATEGORY_LIST,
				receivedData: json.data,
			})
		}
	})
}

export const switchCharStatus = (nextStatus) => ({
	type: ActionTypes.SWITCH_CHAR_STATUS,
	nextStatus
})

export const changeCharDidmount = (bool) => ({
	type: ActionTypes.CHANGE_CHAR_DIDMOUNT,
	bool
})

export const setAmbAssId = (assId) => ({
	type: ActionTypes.SET_AMB_ASSID,
	assId
})

export const seAmbAsscategory = (assCategory) => ({
	type: ActionTypes.SET_AMB_ASSCATEGORY,
	assCategory
})
//第二个参数代表是否需要把end还原成begin
export const changeAmbBeginDate = (begin, bool) => ({
	type: ActionTypes.CHANGE_AMB_BEGIN_DATE,
	begin,
	bool
})
