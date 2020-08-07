import { showMessage, jsonifyDate } from 'app/utils'
import fetchApi from 'app/constants/fetch.constant'
import * as allActions from 'app/redux/Home/All/other.action'
import * as ActionTypes from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'
import * as thirdParty from 'app/thirdParty'

export const getPeriodAndBalistFetch = (issuedate, endissuedate) => dispatch => {
	dispatch(getBaListFetch(issuedate, endissuedate, 'true'))

}

export const getBaListFetch = (issuedate, endissuedate, getPeriod) => dispatch => {
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('getreportacbalance', 'POST', JSON.stringify({
		begin: issuedate ? issuedate : '',
		end: endissuedate ? endissuedate : '',
		getPeriod
	}), json => {
		if (showMessage(json)) {
			thirdParty.toast.hide()
			if (getPeriod) {//第一次进来
				const openedissuedate = dispatch(allActions.everyTableGetPeriod(json))
				const issuedateNew = issuedate ? issuedate : openedissuedate
				dispatch(freshKmyeb(json.data.balance, issuedateNew, issuedateNew))
			} else {//多账期的返回
				dispatch(freshKmyeb(json.data.balance, issuedate, endissuedate))
			}
		}
	})
}

const freshKmyeb = (json, issuedate, endissuedate) => dispatch => {
	dispatch({
		type: ActionTypes.GET_AC_BA_LIST_FETCH,
		receivedData: json,
		issuedate,
		endissuedate
	})
}

export const toggleLowerBa = (acid) => ({
	type: ActionTypes.TOGGLE_LOWER_BA,
	acid
})

export const changeAcYebChooseValue = (value) => ({
	type: ActionTypes.CHANGE_AC_YEB_CHOOSE_VALUE,
	value,
})