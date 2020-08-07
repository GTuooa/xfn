import { fromJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'

//生产环境应当设置为空
const runningTypeYebState = fromJS({
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
	balanceReport: {
		childList:[]
	}
})


export default function handleProjectYeb(state = runningTypeYebState, action) {
	return ({
		[ActionTypes.INIT_RUNNING_TYPE_YEB]							 : () => runningTypeYebState,
		[ActionTypes.AFTER_GET_PERIOD_AND_RUNNING_TYPE_YEB_BALANCE_LIST]              : () => {
			let showChildList = []
			// action.receivedData.balance.childList && action.receivedData.balance.childList.map( v => {
			// 	showChildList.push(v.acId)
			// })
			if (action.getPeriod === 'true') {
				state = state.set('issues',fromJS(action.issues))
			}
            return state.set('issuedate', action.issuedate)
						.set('endissuedate', action.endissuedate)
						.set('balanceReport', fromJS(action.receivedData.balance))
						.setIn(['views','runningShowChild'], fromJS(showChildList))

		},
		// 流水类别是否显示下级
		[ActionTypes.RUNNING_TYPE_YEB_BALANCE_TRIANGLE_SWITCH]          : () => {
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
		[ActionTypes.CHANGE_RUNNING_TYPE_YEB_CHOOSE_VALUE]          : () => {
			return state = state.setIn(['views','chooseValue'],action.value)
		},

	}[action.type] || (() => state))()
}
