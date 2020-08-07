import { fromJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'

//生产环境应当设置为空
const kmmxbState = fromJS({
	views: {
		currentAcId: '',
		currentAssId: '',
		currentAssCategory: '',
		chooseValue: 'ISSUE',
	},
	issuedate: '',
	endissuedate: '',
	currentAcid: '',
	currentAss: '',
	mxbAclist: [/*{
		acid: '',
		acname: '',
		asslist: [{
			assid: '',
			asscategory: '',
			assname: ''
		}],
		direction: '',
		upperid:''
	}*/],
	ledger: {
		"acId": "", //科目id
		"acName": "", //科目名
		"direction": "", //方向
		"assCategory": "", //辅助核算类别
		"assId": "", //辅助核算id
		"assName": "", //辅助核算名
		"allDebitAmount": 0, //借方金额总计
		"allCreditAmount": 0, //贷方金额总
		"allBalanceAmount": 0, //余额
		"detailList": [],
	}
})

export default function handleMxb(state = kmmxbState, action) {
	return ({
		[ActionTypes.INIT_MXB]						: () => kmmxbState,
		[ActionTypes.GET_MXB_ACLIST]				: () => state.set('mxbAclist', fromJS(action.receivedData)),
		[ActionTypes.GET_SUBSIDIARY_LEDGER_FETCH]	: () => {
			return state.set('issuedate', action.param.issuedate)
						.set('endissuedate', action.param.endissuedate)
						.set('ledger', fromJS(action.receivedData))
						.setIn(['views', 'currentAcId'], action.param.acId)
						.setIn(['views', 'currentAssId'], action.param.assId)
						.setIn(['views', 'currentAssCategory'], action.param.assCategory)
		},
		[ActionTypes.REVERSE_LEDGER_JV_LIST]		: () => state.updateIn(['ledger', 'jvlist'], v => v.reverse()),
		[ActionTypes.CHANGE_MXB_BEGIN_DATE]			: () => {
			if(action.bool){
				state = state.set('endissuedate', action.begin)
				return state
			}
			state = state.set('issuedate', action.begin)
			return state
		},
		[ActionTypes.CHANGE_AC_MXB_CHOOSE_VALUE]          : () => {
			return state = state.setIn(['views','chooseValue'],action.value)
		},
	}[action.type] || (() => state))()
}
