import { fromJS, toJS } from 'immutable'
import * as ActionTypes	from './ActionTypes.js'

const sobConfigState = fromJS({
	sobList: []
})

export default function handleConfigSob(state = sobConfigState, action) {
	return ({
		[ActionTypes.INIT_SOB]									 : () => sobConfigState,
		[ActionTypes.GET_SOB_LIST]							     : () => {
			state = state.set('sobList',fromJS(action.list))
			return state
		},
		[ActionTypes.SOB_OPTION_EDIT]							 : () => {
			state = state.set('sobList',fromJS(action.list))
			return state
		},
	}[action.type] || (() => state))()
}
