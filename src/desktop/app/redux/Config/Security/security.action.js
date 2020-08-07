import { showMessage } from 'app/utils'
import * as ActionTypes from './ActionTypes.js'
import fetchApi from 'app/constants/fetch.constant.js'
import * as thirdParty from 'app/thirdParty'
import * as homeActions from 'app/redux/Home/home.action.js'
import * as allActions from 'app/redux/Home/All/all.action'

export const getSecurityPermissionList = () => dispatch => {

	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	fetchApi('getSecurityCenter', 'GET', '', json => {
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.GET_SECURITY_PERMISSION_LIST,
				receivedData: json.data
			})
		}
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
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

export const saveSecurityPermissionList = (callback) => (dispatch, getState) => {

	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	const emplID = getState().homeState.getIn(['data', 'userInfo', 'emplID'])
	const setting = getState().securityState.get('setting')

	fetchApi('saveSecurityCenter', 'POST', JSON.stringify(setting), json => {
		if (showMessage(json, 'show')) {
			if (callback) {
				callback()
			} else {
				dispatch(homeActions.getDbListFetch())
			}
		}
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	})
}


export const setLockSecret = (secret, lockTime, callback) => (dispatch, getState) => {

	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

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
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	})
}


