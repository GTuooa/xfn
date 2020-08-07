import { fromJS, toJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'

//生产环境应当设置为空
const lsyebState = fromJS({
	issues:[{
		value:'',
		key:''
	}],
	issuedate: '',
	endissuedate:'',
	showedLowerAcIdList: [],
	balanceTemp: [],
	runningShowChild:[]
})

export default function handleLsyeb(state = lsyebState, action) {
	return ({
		[ActionTypes.INIT_LSYEB]				: () => lsyebState,
		[ActionTypes.GET_BALANCE_LIST]		: () => {
			if (action.getPeriod === 'true') {
				const period = action.period.data
				const firstyear = Number(period.firstyear)
				const lastyear = Number(period.lastyear)
				const firstmonth = Number(period.firstmonth)
				const lastmonth = Number(period.lastmonth)
				const issues= []

				for (let year = lastyear; year >= firstyear; -- year) {
					if (firstyear === 0)
						break
					for (let month = (year === lastyear ? lastmonth : 12); month >= (year === firstyear ? firstmonth : 1); --month) {
						issues.push({value:`${year}-${month < 10 ? '0' + month : month}`,key:`${year}年第${month < 10 ? '0' + month : month}期`})
					}
				}
				state = state.set('period',fromJS(action.period))
							.set('issues',fromJS(issues))
			}

			let selectList = []
			const data = action.receivedData.data
            data.forEach(v => selectList.push(v.categoryUuid))
			return state.set('issuedate', action.issuedate)
			            .set('endissuedate', action.endissuedate)
						.set('balanceTemp', fromJS(data))
                        .set('runningShowChild',fromJS(selectList))
		},
		[ActionTypes.CHANGE_KMYEB_BEGIN_DATE]	: () => {
			if(action.bool){
				state = state.set('endissuedate', action.begin)
				return state
			}
			state = state.set('issuedate', action.begin)
			return state
		},
		// 流水类别是否显示下级
		[ActionTypes.ACCOUNTCONF_BALANCE_TRIANGLE_SWITCH]          : () => {
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
