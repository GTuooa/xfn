import { showMessage } from 'app/utils'
import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.constant.js'
import * as thirdParty from 'app/thirdParty'
import { homeActions } from 'app/redux/Home/home.js'
import * as Limit from 'app/constants/Limit.js'

export const getSecurityPermissionList = () => dispatch => {

	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	fetchApi('getSecurityCenter', 'GET', '', json => {
		if (showMessage(json)) {
			thirdParty.toast.hide()
			dispatch({
				type: ActionTypes.GET_SECURITY_PERMISSION_LIST,
				receivedData: json.data
			})
		}
	})
}

export const deleteSecurityPermissionEmpl = (listName, index) => dispatch => {
	dispatch({
		type: ActionTypes.DELETE_SECURITY_PERMISSION_EMPL,
		listName,
		index
	})
}

export const changeSecurityPermissionList = (listName, list) => dispatch => {
	dispatch({
		type: ActionTypes.CHANGE_SECURITY_PERMISSION_LIST,
		listName,
		list
	})
}

export const saveSecurityPermissionList = (fresh, successCallBack, history) => (dispatch, getState) => {

	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
	const setting = getState().securityState.get('setting')

	fetchApi('saveSecurityCenter', 'POST', JSON.stringify(setting), json => {
		if (showMessage(json, 'show')) {

			if (fresh) {
				dispatch(homeActions.getDbListFetch('', history))
			} else {
				successCallBack()
			}
		}
	})
}

export const setLockSecret = (secret, lockTime, callback) => (dispatch, getState) => {

	thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)

	fetchApi('setlocksecret', 'POST', JSON.stringify({
		secret: secret ? secret : '',
		lockTime
	}), json => {
		if (showMessage(json, 'show')) {
			dispatch({
				type: ActionTypes.AFTER_CHANGE_LOCK_SECRET,
				secret: secret ? secret : '',
				lockTime,
			})
			callback && callback()
		}
		thirdParty.toast.hide()
	})
}