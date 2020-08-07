import { fromJS }	from 'immutable'
import * as ActionTypes	from './ActionTypes.js'

//生产环境应当设置为空
const jrBossState = fromJS({
	issuedate: '',
	expenditure: '',
	income: '',
	loaded:false,
	bosssheet: [
	/*{
		acname: '',
		yearbeginbalance: '',
		acid: '',
		direction: '',
		debit: 0,
		openingbalance: 0,
		credit: 0,
		closingbalance: 0
	}*/
	],
	bossSelectAssIndex: '0',
	bossAssList: []
})

export default function handleLrb(state = jrBossState, action) {
	return ({
		[ActionTypes.INIT_BOSS]				      		: () => jrBossState,
		[ActionTypes.CHANGE_BOSS_ISSUEDATE]				: () => state.set('issuedate', action.issuedate),
		[ActionTypes.CHANGE_BOSS_SELECT_ASSINDEX] 		: () => state.set('bossSelectAssIndex', action.bossSelectAssIndex),
		[ActionTypes.CHANGE_BOSS_ASSLIST] 				: () => state.set('bossAssList', fromJS(action.bossAssList)),
		[ActionTypes.GET_JR_BOSS_SHEET_FETCH]				: () => {
			return state.set('bosssheet', fromJS(action.receivedData))
			.set('issuedate', action.issuedate)
			.set('loaded', true)
		}
																	// .set('income', action.income)

	}[action.type] || (() => state))()
}
