import { fromJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'

//生产环境应当设置为空
const incomeExpendMxbState = fromJS({
	views: {
		chooseValue: 'MONTH',
		categoryUuid: '',
		searchAbstract: '',
		categoryName: '',
		oriName: ''
	},
	issuedate: '',
	endissuedate: '',
	incomeExpendDetailList:[],
	runningCategoryList:[{
		childList: []
	}],
	openDetail:{},
	totalAmountList:{},
	currentPage: 1,
	pageCount: 1,

})


export default function handleRelativeMxb(state = incomeExpendMxbState, action) {
	return ({
		[ActionTypes.INIT_INCOME_EXPEND_MXB]							 : () => incomeExpendMxbState,
		[ActionTypes.GET_INCOME_EXPEND_MXB_LIST_FROM_INCOME_EXPENDYEB]							 : () => {
			const initResult = {
				detailList:[],
				openDetail: {},
				pages: 1,
				currentPage: 1,
			}
			const receiveResult = action.receivedData.result ? action.receivedData.result : initResult
			const { incomeAmount = '', expenseAmount = '', realIncomeAmount = '', realExpenseAmount = '', closeARBalance = '', closeAPBalance = '', direction = '' } = receiveResult
			const totalAmountList = {incomeAmount, expenseAmount, realIncomeAmount, realExpenseAmount, closeARBalance, closeAPBalance, direction }
			state = state.set('incomeExpendDetailList',fromJS(receiveResult.detailList))
						.set('openDetail',receiveResult.openDetail ? fromJS(receiveResult.openDetail) : fromJS({}))
						.set('totalAmountList',fromJS(totalAmountList))
						.set('issuedate',action.issuedate)
						.set('endissuedate',action.endissuedate)
						.set('pageCount',receiveResult.pages)
						.set('currentPage',receiveResult.currentPage)
						.setIn(['views','categoryUuid'],action.currentCategoryUuid)
						.setIn(['views','searchAbstract'],action.jrAbstract)
			if(action.endissuedate && action.endissuedate !== action.issuedate){
				state = state.setIn(['views', 'chooseperiods'], true)
			}else{
				state = state.setIn(['views', 'chooseperiods'], false)
			}
			if(!action.currentCategoryUuid){
				state = state.setIn(['views','categoryName'],'')
			}
			if(action.categoryName){
				state = state.setIn(['views','categoryName'],action.categoryName)
			}
			if(action.oriName){
				state = state.setIn(['views','oriName'],action.oriName)
			}
			return state
		},
		[ActionTypes.GET_INCOME_EXPEND_MXB_NO_CATEGORY]							 : () => {
			const totalAmountList = {incomeAmount: '', expenseAmount: '', realIncomeAmount: '', realExpenseAmount: '', closeARBalance: '', closeAPBalance: '' }
			return state = state.set('issuedate',action.issuedate)
						.set('incomeExpendDetailList',fromJS([]))
						.set('runningCategoryList',fromJS([{childList: []}]))
						.set('openDetail',fromJS({}))
						.set('totalAmountList',fromJS(totalAmountList))
						.set('endissuedate','')
						.set('pageCount',1)
						.set('currentPage',1)
		},
		[ActionTypes.GET_INCOME_EXPEND_MXB_CATEGORY]							 : () => {
			return state = state.set('runningCategoryList',fromJS(action.receivedData))
		},
		[ActionTypes.CHANGE_INCOME_EXPEND_MXB_CHOOSE_VALUE]           : () => {
			return state.setIn(['views', 'chooseValue'], action.chooseValue)
		},
		[ActionTypes.CHANGE_INCOME_EXPEND_MXB_SEARCH_CONTENT]               : () => {
			return state.setIn(['views', 'searchAbstract'], action.value)
		},
		[ActionTypes.CHANGE_INCOME_EXPEND_MXB_COMMON_STATE]               : () => {
			return state.setIn([action.parent, action.position], action.value)
		},

	}[action.type] || (() => state))()
}
