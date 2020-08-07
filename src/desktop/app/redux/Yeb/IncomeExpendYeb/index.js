import { fromJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'

//生产环境应当设置为空
const incomeExpendYebState = fromJS({
	views: {
		chooseValue: 'MONTH',
		showChildList:[],

	},

	issuedate: '',
	endissuedate: '',
	incomeExpendBalanceList:[],
	totalBalance:{},

})


export default function handleRelativeYeb(state = incomeExpendYebState, action) {
	return ({
		[ActionTypes.INIT_INCOME_EXPENDYEB]							 : () => incomeExpendYebState,
		// 首次获取到数据
		[ActionTypes.AFTER_GET_PERIOD_AND_INCOME_EXPEND_YEB_BALANCE_LIST]              : () => {
			const { openAPBalance, openARBalance, realExpenseAmount, realIncomeAmount, closeAPBalance, closeARBalance, expenseAmount, incomeAmount } = action.receivedData.result
			const totalBalance = {openAPBalance, openARBalance, realExpenseAmount, realIncomeAmount, closeAPBalance, closeARBalance, expenseAmount, incomeAmount}
			let showChildList = []
			// action.receivedData.result.childList && action.receivedData.result.childList.map( v => {
			// 	showChildList.push(v.jrCategoryUuid)
			// })
            return state.set('issuedate', action.issuedate)
						.set('endissuedate', action.endissuedate)
						.set('incomeExpendBalanceList', fromJS(action.receivedData.result.childList))
						.set('totalBalance', fromJS(totalBalance))
						// .setIn(['views','showChildList'], fromJS(showChildList))

		},
		// 流水类别是否显示下级expenseAmount
		[ActionTypes.INCOME_EXPEND_BALANCE_TRIANGLE_SWITCH]          : () => {
            const showLowerList = state.getIn(['views', 'showChildList'])

            if (!action.showChild) {
				// 原来不显示
				const newShowLowerList = showLowerList.push(action.uuid)
				return state.setIn(['views', 'showChildList'], newShowLowerList)
            } else {
				// 原来显示
				const newShowLowerList = showLowerList.splice(showLowerList.findIndex(v => v === action.uuid), 1)
				return state.setIn(['views', 'showChildList'], newShowLowerList)
            }
		},

		// 修改是否多选账期修改
		[ActionTypes.CHANGE_INCOME_EXPEND_YEB_CHOOSE_VALUE] 	 : () => {
			return state.setIn(['views', 'chooseValue'], action.chooseValue)
		},

		[ActionTypes.CHANGE_INCOME_EXPEND_YEB_ITEM_SHOW]               : () => {
			const incomeExpendBalanceList = state.get('incomeExpendBalanceList').toJS()
			let showChildList = []
			if(action.value){
				incomeExpendBalanceList && incomeExpendBalanceList.map( v => {
					showChildList.push(v.jrCategoryUuid)
				})
			}
			return state = state.setIn(['views','showChildList'],fromJS(showChildList))
								.setIn(['views','allItemShow'],fromJS(action.value))
		},

	}[action.type] || (() => state))()
}
