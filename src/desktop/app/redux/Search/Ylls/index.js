import { fromJS, toJS }	from 'immutable'
import { message } from 'antd'
import * as ActionTypes from './ActionTypes.js'

const yllsState = fromJS({
	views: {

	},
	lsItemData: {

	},
	curItem:{
		
	}
})

export default function handleYlls(state = yllsState, action) {
	return ({
		[ActionTypes.INIT_YLLS]								 : () => yllsState,
		// [ActionTypes.CANCEL_YLLS_VISIBLE]					 : () => state.setIn(['views', 'yllsVisible'], false),
        [ActionTypes.GET_YLLS_BUSINESS_DATA]                      : () => state.set('lsItemData', fromJS(action.item))
																				.set('curItem', fromJS(action.curItem)),

	}[action.type] || (() => state))();
}
