import fetchApi from 'app/constants/fetch.account.js'
import * as ActionTypes from './ActionTypes.js'

import { toJS } from 'immutable'
import { jsonifyDate, showMessage } from 'app/utils'

import * as allRunningActions from 'app/redux/Home/All/allRunning.action'
import * as homeActions from 'app/redux/Home/home.action.js'

import { allDownloadEnclosure } from 'app/redux/Home/All/all.action.js'

export const previewDownloadEnclosure = (enclosureUrl, fileName) => dispatch => {
	dispatch(allDownloadEnclosure(enclosureUrl, fileName))
}

export const getPreviewRunningBusinessFetch = (item, fromPage, uuidList,refreshList) => dispatch => {
	let uuid = item.get('oriUuid')
	if (uuid) {
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

		fetchApi('getOriPreview', 'GET', `oriUuid=${uuid}`, json => {
			if (showMessage(json)) {
				dispatch({
					type: ActionTypes.GET_PREVIEW_RUNNING_BUSINESS_FETCH,
					receivedData: json.data,
					currentItem: item,
					uuidList,
					fromPage,
					refreshList
				})
				if (fromPage === 'mxb' || fromPage === 'serialFollow') {
					dispatch(allRunningActions.changeMxbRunningPreviewVisibility(true))
				} else {
					dispatch(allRunningActions.changeSearchRunningPreviewVisibility(true))
				}
			}
			dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
		})
	}
}

export const getPreviewNextRunningBusinessFetch = (item, callBack) => dispatch => {
	if (!item) {
		callBack && callBack()
		dispatch(closePreviewRunning(false))
	} else {
		const uuid = item.get('oriUuid')
		if (uuid) {
			fetchApi('getOriPreview', 'GET', `oriUuid=${uuid}`, json => {
				if (showMessage(json)) {
					dispatch({
						type: ActionTypes.GET_PREVIEW_NEXT_RUNNING_BUSINESS_FETCH,
						receivedData: json.data,
						item
					})

					callBack && callBack()
				}
			})
		}
	}
}

export const getPreviewRelatedRunningBusinessFetch = (oriUuid,uuidList, callBack) => dispatch => {

	if (oriUuid) {
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

		fetchApi('getOriPreview', 'GET', `oriUuid=${oriUuid}`, json => {
			if (showMessage(json)) {
				dispatch({
					type: ActionTypes.GET_PREVIEW_RELATED_RUNNING_BUSINESS_FETCH,
					receivedData: json.data,
					uuidList
				})
				callBack && callBack()
			}
			dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
		})
	}
}

export const closePreviewRunning = () => (dispatch, getState) => {
	//
	// const fromPage = getState().runningPreviewState.getIn(['views', 'fromPage'])
	// if (fromPage === 'mxb') {
	dispatch(allRunningActions.changeMxbRunningPreviewVisibility(false))
	// } else {
	dispatch(allRunningActions.changeSearchRunningPreviewVisibility(false))
	// }
	// 明细表序列号跟踪预览
	dispatch(allRunningActions.changeMxbSerialDrawerVisibility(false))
}
