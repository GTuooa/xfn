import { fromJS }	from 'immutable'
import { showMessage } from 'app/utils'
import * as ActionTypes from './ActionTypes.js'

//生产环境应当设置为空
const kmmxbState = fromJS({
	views: {
		chooseValue: 'MONTH',
		currentAcId: '',
		currentAssId: '',
		currentAssCategory: '',

		showMutilColumnAccountTable: false
	},
	issuedate: '',
	endissuedate: '',
	aclist: [], //mxb另获取的aclist
	cascadeDisplay: false,
	currentPage: 1,
	pageCount: 0,
	ledger: {
		acId: "",
		acFullName: "",
		allBalanceAmount: 0,
		allCreditAmount: 0,
		allDebitAmount: 0,
		assCategory: '',
		assId: '',
		assName: '',
		count: 0,
		detailList: [/*{
			vcindex: 0,
			vcdate: '',
			jvabstract: '',
			jvamount: 0,
			jvdirection: '',
			balance: 0
		}*/],
		direction: "debit",
	},
	// showMutilColumnAccount:false,
	// showMutilColumnAccountTable:false,
	// mutilColumnAccountTableAcDetails:[],
	// mutilColumnAccountTableAcList:[],
	// mutilColumnAccountTableBalanceSumList:[],
	// mutilColumnAccountTableOpeningBalanceList:[],
	// mutilColumnAccountTableDirection:"",
	// showMoreColumn:false,
	// maxColumnCount:10,
	// mutilColumnAccountTableCurrentPage:1,
	// mutilColumnAccountTablePageCount:0
	mutilColumnData: {},
})

export default function handleMxb(state = kmmxbState, action) {
	return ({
		[ActionTypes.INIT_MXB]							 : () => kmmxbState.set('issuedate', action.issuedate ? action.issuedate : '').set('endissuedate', action.endissuedate ? action.endissuedate : ''),

		// 修改是否多选账期修改
		[ActionTypes.CHANGE_AC_MXB_CHOOSE_VALUE] 	 : () => {

			console.log('reduce', action.chooseValue);
			
			return state.setIn(['views', 'chooseValue'], action.chooseValue)
		},

		[ActionTypes.AFTER_GET_SUBSIDIARY_LEDGER_FETCH]  : () => {
			const ledger = fromJS(action.receivedData)
			return state.set('issuedate', action.param.issuedate)
						.set('endissuedate', action.param.endissuedate)
						.set('ledger', ledger)
						.setIn(['views', 'currentAcId'], action.param.acId)
						.setIn(['views', 'currentAssId'], action.param.assId)
						.setIn(['views', 'currentAssCategory'], action.param.assCategory)
						.set('currentPage', action.receivedData.pageNum)
						.set('pageCount', action.receivedData.pageCount)
		},
		// 没有aclist时清空一下
		[ActionTypes.AFTER_GET_SUBSIDIARY_LEDGER_FETCH_NOAC] : () => {
			return state.set('issuedate', action.param.issuedate)
						.set('endissuedate', action.param.endissuedate)
						.set('ledger', kmmxbState.get('ledger'))
						.setIn(['views', 'currentAcId'], action.param.acId)
						.setIn(['views', 'currentAssId'], action.param.assId)
						.setIn(['views', 'currentAssCategory'], action.param.assCategory)
						.set('currentPage', 1)
						.set('pageCount', 0)
		},
		// [ActionTypes.GET_MXB_ACLIST]					 : () => showMessage(action.receivedData) ? state.set('aclist', fromJS(action.receivedData.data)) : kmmxbState,
		[ActionTypes.GET_MXB_ACLIST]					 : () => state.set('aclist', fromJS(action.receivedData)),
		[ActionTypes.CHANGE_MXB_CHOOSE_MORE_PERIODS] 	 : () => {
			if (action.chooseperiods) {
				return state.set('chooseperiods', true)
			} else {
				return state.update('chooseperiods', v => !v)
			}
		},
		[ActionTypes.SHOW_MULTI_COLUMN_ACCOUNT]:()=> state.set('showMutilColumnAccount',action.show),

		[ActionTypes.SHOW_MULTI_COLUMN_ACCOUNT_TABLE]:()=> state.setIn(['views', 'showMutilColumnAccountTable'], action.ifShow),

		[ActionTypes.SET_MULTI_COLUMN_ACCOUNT_TABLE_DATA] : () => {
			return state.set('issuedate', action.issuedate). set('endissuedate', action.endissuedate)
						.set('mutilColumnData', fromJS(action.receivedData))
						// .set('mutilColumnAccountTableAcDetails',action.mutilColumnAccountTableAcDetails)
						// .set('mutilColumnAccountTableAcList',action.mutilColumnAccountTableAcList)
						// .set('mutilColumnAccountTableBalanceSumList',action.mutilColumnAccountTableBalanceSumList)
						// .set('mutilColumnAccountTableDirection',action.mutilColumnAccountTableDirection)
						// .set('mutilColumnAccountTableOpeningBalanceList',action.mutilColumnAccountTableOpeningBalanceList)
						.set('mutilColumnCurrentPage', action.receivedData.pageNum)
						.set('mutilColumnPageCount', action.receivedData.pageCount)
		},
		[ActionTypes.SHOW_MORE_COLUMN]:()=>state.set('showMoreColumn', action.show)
	}[action.type] || (() => state))()
}
