import fetchApi from 'app/constants/fetch.account.js'
import * as ActionTypes from './ActionTypes.js'
import { jsonifyDate, showMessage } from 'app/utils'

export const getYllsBusinessData = (item,callBack) => dispatch => {
	const uuid = item.get('parentUuid')?item.get('parentUuid'):item.get('uuid')
	uuid &&dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	uuid && fetchApi('getRunningBusiness', 'GET', `uuid=${uuid}`, json => {
		if (showMessage(json)) {
			dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
			dispatch({
				type: ActionTypes.GET_YLLS_BUSINESS_DATA,
				item: json.data.result,
				curItem:item
			})
			callBack && callBack()
		} else {
			dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
		}
	})
}

export const cancelYllsVisible = () => dispatch => {
	dispatch({
		type: ActionTypes.CANCEL_YLLS_VISIBLE
	})
}
