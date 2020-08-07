import { fromJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'

//生产环境应当设置为空
const incomeExpendMxbState = fromJS({
	views: {
		issuedate:'',
		endissuedate: '',
		categoryUuid: '',
		categoryName: '',
		chooseValue: 'ISSUE',
	},
	totalAmountList: {},
	openDetail: {},
	incomeExpendDetailList: [],
	runningCategoryList:[{
		childList: []
	}],
	issues:[],
	pageCount: 1,
	currentPage: 1

})


export default function handleProjectMxb(state = incomeExpendMxbState, action) {
	return ({
		[ActionTypes.INIT_INCOME_EXPEND_MXB]							 : () => incomeExpendMxbState,
		[ActionTypes.GET_INCOME_EXPEND_MXB_LIST_FROM_INCOME_EXPENDYEB]							 : () => {
			const { incomeAmount, expenseAmount, realIncomeAmount, realExpenseAmount, closeARBalance, closeAPBalance, direction } = action.receivedData.result
			const totalAmountList = {incomeAmount, expenseAmount, realIncomeAmount, realExpenseAmount, closeARBalance, closeAPBalance, direction }
			state = state.set('incomeExpendDetailList',fromJS(action.receivedData.result.detailList))
						.set('openDetail',fromJS(action.receivedData.result.openDetail))
						.set('totalAmountList',fromJS(totalAmountList))
						.setIn(['views','issuedate'],action.issuedate)
						.setIn(['views','endissuedate'],action.endissuedate)
						.set('pageCount',action.receivedData.result.pages)
						.set('currentPage',action.receivedData.result.currentPage)
						.setIn(['views','categoryUuid'],action.currentCategoryUuid)

			if(action.needPeriod === 'true'){
				state = state.set('issues',fromJS(action.issues))
			}

			if(!action.currentCategoryUuid){
				state = state.setIn(['views','categoryName'],'')
			}
			if(action.categoryName){
				state = state.setIn(['views','categoryName'],action.categoryName)
			}
			return state
		},
		[ActionTypes.GET_INCOME_EXPEND_MXB_LIST_FROM_PAGE]							 : () => {
			const { incomeAmount, expenseAmount, realIncomeAmount, realExpenseAmount, closeARBalance, closeAPBalance, direction } = action.receivedData.result
			const totalAmountList = {incomeAmount, expenseAmount, realIncomeAmount, realExpenseAmount, closeARBalance, closeAPBalance, direction }
			let newList = []
			if(action.shouldConcat){
				let oldList = state.get('incomeExpendDetailList').toJS()
				newList = oldList.concat(action.receivedData.result.detailList)
			}else{
				newList = action.receivedData.result.detailList
			}
			state = state.set('incomeExpendDetailList',fromJS(newList))
						.set('openDetail',fromJS(action.receivedData.result.openDetail))
						.set('totalAmountList',fromJS(totalAmountList))
						.setIn(['views','issuedate'],action.issuedate)
						.setIn(['views','endissuedate'],action.endissuedate)
						.set('pageCount',action.receivedData.result.pages)
						.set('currentPage',action.receivedData.result.currentPage)
						.setIn(['views','categoryUuid'],action.currentCategoryUuid)

			if(action.needPeriod === 'true'){
				state = state.set('issues',fromJS(action.issues))
			}

			if(!action.currentCategoryUuid){
				state = state.setIn(['views','categoryName'],'')
			}
			if(action.categoryName){
				state = state.setIn(['views','categoryName'],action.categoryName)
			}
			return state
		},
		[ActionTypes.GET_INCOME_EXPEND_MXB_CATEGORY]							 : () => {
			return state = state.set('runningCategoryList',fromJS(action.receivedData))
		},
		[ActionTypes.GET_INCOME_EXPEND_MXB_NO_CATEGORY]							 : () => {
			const totalAmountList = {incomeAmount: '', expenseAmount: '', realIncomeAmount: '', realExpenseAmount: '', closeARBalance: '', closeAPBalance: '' }
			return state = state.setIn(['views','issuedate'],action.issuedate)
						.set('incomeExpendDetailList',fromJS([]))
						.set('runningCategoryList',fromJS([{childList: []}]))
						.set('openDetail',fromJS({}))
						.set('totalAmountList',fromJS(totalAmountList))
						.setIn(['views','endissuedate'],'')
						.setIn(['views','categoryName'],'暂无可选类型')
						.set('pageCount',1)
						.set('currentPage',1)
		},
		[ActionTypes.CHANGE_INCOME_EXPEND_MXB_COMMON_STATE]               : () => {
			return state.setIn([action.parent, action.position], action.value)
		},
		[ActionTypes.CHANGE_INCOME_EXPEND_MXB_CHOOSE_VALUE]          : () => {
			return state = state.setIn(['views','chooseValue'],action.value)
		},

	}[action.type] || (() => state))()
}
