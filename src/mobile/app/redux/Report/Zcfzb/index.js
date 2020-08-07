import { fromJS }	from 'immutable'
import { combineReducers }	from 'redux'
import { message } from 'app/components'
import { showMessage } from 'app/utils'
import * as ActionTypes from './ActionTypes.js'

//生产环境应当设置为空
const zcfzbState = fromJS({
	issuedate: '',
	showedBalanceLineBlockIdxList: [], //[1, 2, 3, 4, 5],
	balancesheet: [{
		closingbalance: '',
		hashname: '',
		line:''
	}],
	issues:[]
})

export default function handleZcfzb(state = zcfzbState, action) {
	return ({
		[ActionTypes.INIT_ZCFZB]					: () => zcfzbState,
		[ActionTypes.GET_BALANCE_SHEET_FETCH]		: () => {
			if (action.issues) {
				state = state.set('issues', fromJS(action.issues))
			}
			return state.set('issuedate', action.issuedate).set('balancesheet', fromJS(action.receivedData.data))
		},
		[ActionTypes.TOGGLE_BALANCE_LINE_DISPLAY]	: () => {
			const showedBalanceLineBlockIdxList = state.get('showedBalanceLineBlockIdxList')
			if (!action.blockIdx)
				return state.update('showedBalanceLineBlockIdxList', v => v.size ? v.clear() : zcfzbState.get('showedBalanceLineBlockIdxList'))
			else if (showedBalanceLineBlockIdxList.indexOf(action.blockIdx) > -1)
				return state.update('showedBalanceLineBlockIdxList', v => v.map(w => w === action.blockIdx ? -1 : w).filter(w => w !== -1))
			else
				return state.update('showedBalanceLineBlockIdxList', v => v.push(action.blockIdx))
		}
	}[action.type] || (() => state))()
}
