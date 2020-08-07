import { fromJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'

//生产环境应当设置为空
const runningTypeYebState = fromJS({
	views: {
		chooseValue: 'MONTH',
		showChildList:[],

	},

	issuedate: '',
	endissuedate: '',
	runningTypeBalanceList:[],
	totalBalance:{},

})


export default function handleRelativeYeb(state = runningTypeYebState, action) {
	return ({
		[ActionTypes.INIT_RUNNING_TYPEYEB]							 : () => runningTypeYebState,
		// 首次获取到数据
		[ActionTypes.AFTER_GET_PERIOD_AND_RUNNING_TYPE_YEB_BALANCE_LIST]              : () => {
			const { allBeginDebitAmount, allBeginCreditAmount, allMonthDebitAmount, allMonthCreditAmount, allYearDebitAmount, allYearCreditAmount,allEndDebitAmount,allEndCreditAmount } = action.receivedData.balance
			const totalBalance = { allBeginDebitAmount, allBeginCreditAmount, allMonthDebitAmount, allMonthCreditAmount, allYearDebitAmount, allYearCreditAmount,allEndDebitAmount,allEndCreditAmount }
			let showChildList = []
			// action.receivedData.balance.childList && action.receivedData.balance.childList.map( v => {
			// 	showChildList.push(v.acId)
			// })
            return state.set('issuedate', action.issuedate)
						.set('endissuedate', action.endissuedate)
						.set('runningTypeBalanceList', fromJS(action.receivedData.balance.childList))
						.set('totalBalance', fromJS(totalBalance))
						.setIn(['views','showChildList'], fromJS(showChildList))

		},
		// 流水类别是否显示下级expenseAmount
		[ActionTypes.RUNNING_TYPE_BALANCE_TRIANGLE_SWITCH]          : () => {
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
		[ActionTypes.RUNNING_TYPE_BALANCE_TRIANGLE_SWITCH_ALL]          : () => {
			const runningTypeBalanceList = state.get('runningTypeBalanceList')
            if (action.isShowAll) {
				let showChildList = []
				const loop = (data) => data.map(item => {
					if(item.childList && item.childList.length){
						loop(item.childList)
						showChildList.push(item.acId)
					}
				})

				loop(runningTypeBalanceList ? runningTypeBalanceList.toJS() : [])
				return state.setIn(['views', 'showChildList'], fromJS(showChildList))
            } else {
				return state.setIn(['views', 'showChildList'], fromJS([]))
            }
		},

		// 修改是否多选账期修改
		[ActionTypes.CHANGE_RUNNING_TYPE_YEB_CHOOSE_VALUE] 	 : () => {
			return state.setIn(['views', 'chooseValue'], action.chooseValue)
		}

	}[action.type] || (() => state))()
}
