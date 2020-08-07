import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.constant.js'
import { showMessage } from 'app/utils'
import { fromJS, toJS }	from 'immutable'
import * as Limit from 'app/constants/Limit.js'
import * as thirdParty from 'app/thirdParty'

export const getAcBalanceFetch = (closedyear) => dispatch => {
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('getbainitlist', 'GET', '', json => {
		if (showMessage(json)) {
			thirdParty.toast.hide()
			dispatch({
				type: ActionTypes.GET_BA_INIT_LIST_FETCH,
				receivedData: json.data
			})
			if (closedyear) {
				thirdParty.Alert('该账期已结账，反结账后即可修改期初值')
			}
			dispatch(chengeQcyeIsModified(false))
		}
	})
}

// export const setAcBalanceFetch = () => (dispatch, getState) => {
// 	const state = getState().qcyeState
//
// 	const acbalist = state.get('acbalist').filter(v => v.get('amount') !== '')
//
// 	fetchApi('initba', 'POST', JSON.stringify({
// 		balanceaclist: acbalist
// 	}), json => {
// 		showMessage(json, 'show')
// 		dispatch(chengeQcyeIsModified(false))
// 	})
// }

export const setAcBalanceFetch = (isClean) => (dispatch, getState) => {

	let acbalist
	if (isClean === 'clean') {
		acbalist = []
	} else {
		const state = getState().qcyeState
		acbalist = state.get('acbalist').filter(v => v.get('amount') !== '')
	}
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('initba', 'POST', JSON.stringify({
		balanceaclist: acbalist
	}), json => {
		if (showMessage(json, 'show')) {
			if (isClean === 'clean') {
				dispatch({
					type: ActionTypes.GET_BA_INIT_LIST_FETCH,
					receivedData: []
				})
			}
		}

		dispatch(chengeQcyeIsModified(false))
	})
}

export const changeTabIndexQcconfig = (idx) => ({
	type: ActionTypes.CHANGE_TAB_INDEX_QCCONFIG,
	idx
})

export const toggleLowerQc = (acid) => ({
	type: ActionTypes.TOGGLE_LOWER_QC,
	acid
})

export const changeBaAmount = (ac, amount, acbaidx) => ({
	type: ActionTypes.CHANGE_AC_BA_AMOUNT,
	ac,
	amount,
	acbaidx
})

export const insertAcBalance = (idx, ac) => ({
	type: ActionTypes.INSERT_AC_BA,
	idx,
	ac
})

export const deleteAcBalance = idx => ({
	type: ActionTypes.DELETE_AC_BA,
	idx
})

export const deleteAcBalanceAll = () => ({
	type: ActionTypes.DELETE_AC_BA_ALL
})

export const reverseAcBalanceList = () => ({
	type: ActionTypes.REVERSE_AC_BA_LIST
})

export const getTrailBalanceFetch = () => dispatch => {
	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('gettrailbalance', 'GET', '', json => {
		if (showMessage(json)) {
			thirdParty.toast.hide()
			thirdParty.Alert(json.message)
		}
	})
}

export const chengeQcyeIsModified = (bool) => ({
	type: ActionTypes.CHENGE_QCYE_ISMODIFIED,
	bool
})

// 数量
export const changeAcBalanceCount = (ac, count, acbaidx, unitDecimalCount) => ({
	type: ActionTypes.CHANGE_AC_BALANCE_COUNT,
	ac,
	count,
	acbaidx,
	unitDecimalCount
})
