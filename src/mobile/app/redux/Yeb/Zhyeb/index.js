import { fromJS, toJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'

//生产环境应当设置为空
const zhyebState = fromJS({
	issues:[{
		value:'',
		key:''
	}],
	issuedate: '',
	endissuedate:'',
	showedLowerAcIdList: [],
	balanceTemp: [],
	runningShowChild:[],
	allBeginAmount: 0,
	allIncomeAmount: 0,
	allExpenseAmount: 0,
	allBalanceAmount: 0
})

export default function handleLsyeb(state = zhyebState, action) {
	return ({
		[ActionTypes.INIT_ZHYEB]				: () => zhyebState,
		[ActionTypes.GET_ZH_BALANCE_LIST]  : () => {
            if(action.isReflash) {
                // yezi
                state = state.set('balanceTemp', zhyebState)
            }

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
                  .set('allBeginAmount',action.allBeginAmount)
                  .set('allExpenseAmount',action.allExpenseAmount)
                  .set('allIncomeAmount',action.allIncomeAmount)
                  .set('allBalanceAmount',action.allBalanceAmount)
    },
		// 流水类别是否显示下级
		[ActionTypes.ACCOUNTCONF_ZH_BALANCE_TRIANGLE_SWITCH]          : () => {
			const showLowerList = state.get('runningShowChild')
			if (!action.showChild) {
				// 原来不显示
				const newShowLowerList = showLowerList.push(action.uuid)
				return state.set('runningShowChild', newShowLowerList)
			} else {
				// 原来显示
				const newShowLowerList = showLowerList.splice(showLowerList.findIndex(v => v === action.uuid), 1)
				return state.set('runningShowChild', newShowLowerList)
			}
		},

	}[action.type] || (() => state))()
}
