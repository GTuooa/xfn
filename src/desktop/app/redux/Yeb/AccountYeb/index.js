import { fromJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'

//生产环境应当设置为空
const accountYebState = fromJS({
	views: {
		chooseValue: 'MONTH',
    },
	issuedate: '',
	endissuedate: '',
    accountBalanceList: {

    },
	totalBalance: {

	},
})


export default function handleAccountYeb(state = accountYebState, action) {
	return ({
		[ActionTypes.INIT_ACCOUNTYEB]							                 : () => accountYebState,
		// 首次获取到数据
		[ActionTypes.AFTER_GET_PERIOD_AND_ACCOUNT_YEB_BALANCE_LIST]              : () => {

            return state.set('issuedate', action.issuedate)
						.set('endissuedate', action.endissuedate)
						.set('accountBalanceList', fromJS(action.receivedData.accountBalanceList))
						.set('totalBalance', fromJS(action.receivedData.totalBalance))

		},
		// 修改是否多选账期修改
		[ActionTypes.CHANGE_ACCOUNT_YEB_CHOOSE_VALUE] 	 : () => {
			return state.setIn(['views', 'chooseValue'], action.chooseValue)
		}
	}[action.type] || (() => state))()
}
