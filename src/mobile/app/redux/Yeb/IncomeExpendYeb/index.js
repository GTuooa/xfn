import { fromJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'

//生产环境应当设置为空
const incomeExpendYebState = fromJS({
	views: {
		runningShowChild: [],
		chooseValue: 'ISSUE',
	},
	issues:[{
		value:'',
		key:''
	}],
	issuedate: '',
	endissuedate: '',
	incomeExpendBalanceList:[],
})


export default function handleProjectYeb(state = incomeExpendYebState, action) {
	return ({
		[ActionTypes.INIT_INCOME_EXPEND_YEB]							 : () => incomeExpendYebState,
		[ActionTypes.GET_INCOME_EXPEND_YEB_BALANCE_LIST]  : () => {

			if (action.getPeriod === 'true') {
				const period = action.period

				state = state.set('period',fromJS(action.period))
							.set('issues',fromJS(action.issues))
			}
			let runningShowChild = []
			// action.receivedData.childList.forEach(v => runningShowChild.push(v.jrCategoryUuid))

			return state.set('incomeExpendBalanceList',fromJS(action.receivedData.childList))
						.set('issuedate',fromJS(action.issuedate))
						.set('endissuedate',fromJS(action.endissuedate))
						.setIn(['views','runningShowChild'],fromJS(runningShowChild))
		},
		// 流水类别是否显示下级
		[ActionTypes.INCOME_EXPEND_YEB_BALANCE_TRIANGLE_SWITCH]          : () => {
			const showLowerList = state.getIn(['views', 'runningShowChild'])

			if (!action.showChild) {
				// 原来不显示
				const newShowLowerList = showLowerList.push(action.uuid)
				return state.setIn(['views', 'runningShowChild'], newShowLowerList)
			} else {
				// 原来显示
				const newShowLowerList = showLowerList.splice(showLowerList.findIndex(v => v === action.uuid), 1)
				return state.setIn(['views', 'runningShowChild'], newShowLowerList)
			}
		},
		[ActionTypes.CHANGE_INCOME_EXPEND_YEB_CHOOSE_VALUE]          : () => {
			return state = state.setIn(['views','chooseValue'],action.value)
		},
	}[action.type] || (() => state))()
}
