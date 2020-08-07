import { fromJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'

//生产环境应当设置为空
const runningTypeMxbState = fromJS({
	views: {
		chooseValue: 'MONTH',
		typeUuid: '',
		searchAbstract: '',
		acName: '',
		oriName:''
	},
	issuedate: '',
	endissuedate: '',
	runningTypeDetailList:[],
	runningCategoryList:{
		childList: []
	},
	openDetail:{},
	totalAmountList:{},
	currentPage: 1,
	pageCount: 1,

})


export default function handleRelativeMxb(state = runningTypeMxbState, action) {
	return ({
		[ActionTypes.INIT_RUNNING_TYPE_MXB]							 : () => runningTypeMxbState,
		[ActionTypes.GET_RUNNING_TYPE_MXB_LIST_FROM_RUNNING_TYPEYEB]							 : () => {
			const { allDebitAmount, allCreditAmount, allBalanceAmount, direction } = action.receivedData.detail
			const totalAmountList = { allDebitAmount, allCreditAmount, allBalanceAmount,direction }
			state = state.set('runningTypeDetailList',fromJS(action.receivedData.detail.childList))
						// .set('openDetail',fromJS(action.receivedData.result.openDetail))
						.set('totalAmountList',fromJS(totalAmountList))
						.set('issuedate',action.issuedate)
						.set('endissuedate',action.endissuedate)
						.set('pageCount',action.receivedData.detail.pages ? action.receivedData.detail.pages : 1)
						.set('currentPage',action.currentPage)
						.setIn(['views','typeUuid'],action.currentTypeUuid)
						.setIn(['views','searchAbstract'],action.jrAbstract)
			if(action.endissuedate && action.endissuedate != action.issuedate){
				state = state.setIn(['views', 'chooseperiods'], true)
			}
			if(!action.currentTypeUuid){
				state = state.setIn(['views','acName'],'')
			}
			if(action.acName){
				state = state.setIn(['views','acName'],action.acName)
			}
			if(action.oriName){
				state = state.setIn(['views','oriName'],action.oriName)
			}
			return state
		},
		[ActionTypes.GET_RUNNING_TYPE_MXB_LIST_NO_TYPE_TREE]							 : () => {
			const totalAmountList = { allDebitAmount: '', allCreditAmount: '', allBalanceAmount: '',direction: '' }
			state = state.set('runningTypeDetailList',fromJS([]))
						.set('runningCategoryList',fromJS([{childList:[]}]))
						// .set('openDetail',fromJS(action.receivedData.result.openDetail))
						.set('totalAmountList',fromJS(totalAmountList))
						.set('issuedate',action.issuedate)
						.set('endissuedate',action.endissuedate)
						.set('pageCount',1)
						.set('currentPage',1)
						.setIn(['views','typeUuid'],'')
						.setIn(['views','acName'],'')
						.setIn(['views','searchAbstract'],action.jrAbstract)
			if(action.endissuedate && action.endissuedate != action.issuedate){
				state = state.setIn(['views', 'chooseperiods'], true)
			}
			if(!action.currentTypeUuid){
				state = state.setIn(['views','acName'],'')
			}
			if(action.acName){
				state = state.setIn(['views','acName'],action.acName)
			}
			return state
		},
		[ActionTypes.GET_RUNNING_TYPE_MXB_CATEGORY]							 : () => {
			return state = state.set('runningCategoryList',fromJS(action.receivedData))
		},
		[ActionTypes.CHANGE_RUNNING_TYPE_MXB_CHOOSE_VALUE]           : () => {
			return state.setIn(['views', 'chooseValue'], action.chooseValue)
		},
		[ActionTypes.CHANGE_RUNNING_TYPE_MXB_SEARCH_CONTENT]               : () => {
			return state.setIn(['views', 'searchAbstract'], action.value)
		},
		[ActionTypes.CHANGE_RUNNING_TYPE_MXB_COMMON_STATE]               : () => {
			return state.setIn([action.parent, action.position], action.value)
		},
		[ActionTypes.GET_RUNNING_TYPE_MXB_NO_CATEGORY]							 : () => {
			return state = state.set('issuedate',action.issuedate)
				.set('endissuedate','')
				.set('runningTypeDetailList',fromJS([]))
				.set('pageCount',1)
				.set('currentPage',1)
				.setIn(['views','searchAbstract'],'')
				.set('totalAmountList',fromJS({}))
		},

	}[action.type] || (() => state))()
}
