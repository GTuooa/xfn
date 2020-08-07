import { fromJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'

//生产环境应当设置为空
const relativeYebState = fromJS({
	views: {
		issuedate:'',
		endissuedate: '',
		categoryName: '全部往来类别',
		categoryUuid: '',
		runningCategoryName: '全部流水类别',
		runningCategoryUuid: '',
		categoryTop: '',
		bussinessShowChild:[],
		chooseValue: 'ISSUE',
		chooseDirection: ''

	},
	issues:[],
	contactCategory:[{
		label:'全部往来类别',
		key:'-:-',
		childList:[]
	}],
	runningCategory:[{
		label:'全部流水类别',
		key:'-:-',
		childList:[]
	}],
	balanceReport: {
		childList:[]
	}

})


export default function handleRelativeYeb(state = relativeYebState, action) {
	return ({
		[ActionTypes.INIT_RELATIVE_YEB]							 : () => relativeYebState,
		[ActionTypes.GET_RELATIVE_YEB_BALANCE_LIST]		                      : () => {
			state = state.setIn(['views','issuedate'], action.issuedate)
							.setIn(['views','endissuedate'], action.endissuedate)
							.set('balanceReport', fromJS(action.receivedData))
			if(action.needPeriod === 'true'){
				state = state.set('issues',fromJS(action.issues))
			}
			return state


		},
		[ActionTypes.GET_RELATIVE_BALANCE_CATEGORY]		                              : () => {
			const initCategory = [{label:'全部往来类别',key:'-:-',childList:[]}]
			const initRunningCategory = [{label:'全部流水类别',key:'-:-:-',childList:[]}]
			const loop = (item,uuidString,nameString) => item.map((v, i) => {
				if (v.childList && v.childList.length) {
					return {
						key: `${v[uuidString]}${Limit.TREE_JOIN_STR}${v.top ? true : false}${Limit.TREE_JOIN_STR}${v.direction}`,
						label: v[nameString],
						childList: loop(v.childList,uuidString,nameString)
					}
				} else {
					return {
						key: `${v[uuidString]}${Limit.TREE_JOIN_STR}${v.top ? true : false}${Limit.TREE_JOIN_STR}${v.direction}`,
						label: v[nameString],
						childList: [],
					}
				}
			})
			const cardCategory = loop(action.cardCategory,'uuid','name')
			const jrCategory = loop(action.jrCategory,'jrCategoryUuid','jrCategoryName')
			const contactCategory = initCategory.concat(cardCategory)
			const runningCategory = initRunningCategory.concat(jrCategory)
			return state = state.set('contactCategory', fromJS(contactCategory))
								.set('runningCategory', fromJS(runningCategory))
		},
		[ActionTypes.CHANGE_RELATIVE_CATEGORY_STRING]				: () => {
			return state.setIn(['views','categoryName'], action.categoryName)
						.setIn(['views','categoryUuid'], action.categoryUuid)
						.setIn(['views','categoryTop'], action.categoryTop)
						.setIn(['views','categoryValue'], action.categoryValue)
		},
		[ActionTypes.CHANGE_RUNNING_CATEGORY_STRING]				: () => {
			return state.setIn(['views','runningCategoryName'], action.categoryName)
						.setIn(['views','runningCategoryUuid'], action.categoryUuid)
						.setIn(['views','runningCategoryValue'], action.categoryValue)
		},
		[ActionTypes.RELATIVE_BALANCE_TRIANGLE_SWITCH]          : () => {
            const showLowerList = state.getIn(['views', 'bussinessShowChild'])
            if (!action.showChild) {
                // 原来不显示
                const newShowLowerList = showLowerList.push(action.uuid)
                return state.setIn(['views', 'bussinessShowChild'], newShowLowerList)
            } else {
                // 原来显示
                const newShowLowerList = showLowerList.splice(showLowerList.findIndex(v => v === action.uuid), 1)
                return state.setIn(['views', 'bussinessShowChild'], newShowLowerList)
            }
        },
		[ActionTypes.CHANGE_RELATIVE_YEB_CHOOSE_DIRCTION]          : () => {
			return state = state.setIn(['views','chooseDirection'],action.value)
		},
		[ActionTypes.CHANGE_RELATIVE_YEB_CHOOSE_VALUE]          : () => {
			return state = state.setIn(['views','chooseValue'],action.value)
		},

	}[action.type] || (() => state))()
}
