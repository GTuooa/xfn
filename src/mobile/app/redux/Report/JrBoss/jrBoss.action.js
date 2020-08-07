import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.constant.js'
import * as allActions from 'app/redux/Home/All/other.action'
import { showMessage, jsonifyDate } from 'app/utils'
import * as Limit from 'app/constants/Limit.js'
import thirdParty from 'app/thirdParty'

export const getPeriodAndJrBossSheetFetch = (issuedate) => dispatch => {
	// allActions.getPeriodFetch('', dispatch, (issuedate) => dispatch(getBossSheetFetch(issuedate)))

	dispatch(AllGetJrBossListFetch(issuedate, 'true'))
}

export const getJrBossSheetFetch = (issuedate) => (dispatch, getState) => {
	dispatch(AllGetJrBossListFetch(issuedate,false))
}

const AllGetJrBossListFetch = (issuedate, needPeriod) => (dispatch, getState) => {
	let url = 'getJrBossSheet'
	let options = {
		begin: issuedate ? issuedate.substr(0,4) + '-' + issuedate.substr(5,2): '',
		end: issuedate ? issuedate.substr(0,4) + '-' + issuedate.substr(5,2): '',
		needPeriod
	}
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi(url, 'POST', JSON.stringify(options), json => {
		thirdParty.toast.hide()
		if (showMessage(json)) {
			thirdParty.toast.hide()
			let issuedateNew = ''
			if (needPeriod == 'true') {
				const openedissuedate = dispatch(allActions.reportGetIssuedateAndFreshPeriod(json))
				issuedateNew = issuedate ? issuedate : openedissuedate
			} else {
				issuedateNew = issuedate
			}
			// dispatch({
			// 	type: ActionTypes.CHANGE_BOSS_ISSUEDATE,
			// 	issuedate: issuedateNew
			// })
			//
			dispatch({
				type: ActionTypes.GET_JR_BOSS_SHEET_FETCH,
				receivedData: json.data.result,
				issuedate:issuedateNew,
				needPeriod
			})
			//
			// if (bossSelectAssIndex === '0') {
			// 	let bossAssList = json.data.assList
			// 	if (json.data.assList.length) {
			// 		bossAssList.unshift({assid: 0, assname: '全部', asscategory: 'asscategory'})
			// 	}
			// 	dispatch({
			// 		type: ActionTypes.CHANGE_BOSS_ASSLIST,
			// 		bossAssList
			// 	})
			// }
		}
	})


}
