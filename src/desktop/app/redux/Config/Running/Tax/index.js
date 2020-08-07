import { fromJS }	from 'immutable'
import * as ActionTypes	from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'

//生产环境应当设置为空
const taxConfState = fromJS({
	views: {
		isTaxQuery: true,
		insertOrModify: 'insert'
	},

})

export default function handleTaxConf(state = taxConfState, action) {
	return ({
		[ActionTypes.INIT_TAX_CONF]						: () => taxConfState,
		[ActionTypes.CHANGE_TAX_CONF_QUERY]						: () => {
			return state = state.setIn(['views', 'isTaxQuery'], action.isTaxQuery)
		},


	}[action.type] || (() => state))()
}
