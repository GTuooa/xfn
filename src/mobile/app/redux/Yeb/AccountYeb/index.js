import { fromJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'

//生产环境应当设置为空
const accountYebState = fromJS({
	views: {
		chooseValue: 'ISSUE'
	},
	issues:[{
		value:'',
		key:''
	}],
	issuedate: '',
	endissuedate:'',
	balanceTemp: [],

})


export default function handleAccountYeb(state = accountYebState, action) {
	return ({
		[ActionTypes.INIT_ACCOUNT_YEB]							 : () => accountYebState,
		[ActionTypes.GET_ACCOUNT_BALANCE_LIST]  : () => {

            if (action.getPeriod === 'true') {
                const period = action.period

                state = state.set('period',fromJS(action.period))
                            .set('issues',fromJS(action.issues))
            }
            let selectList = []
            action.receivedData.forEach(v => selectList.push(v.categoryUuid))

            return state.set('balanceTemp',fromJS(action.receivedData))
                  .set('issuedate',fromJS(action.issuedate))
                  .set('endissuedate',fromJS(action.endissuedate))
    },
	[ActionTypes.CHANGE_ACCOUNT_YEB_CHOOSE_VALUE]          : () => {
		return state = state.setIn(['views','chooseValue'],action.value)
	},

	}[action.type] || (() => state))()
}
