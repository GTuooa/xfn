import { fromJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'

//生产环境应当设置为空
const relativeYebState = fromJS({
	views: {
		showChildList: [],
		currentRelativeItem: {
			uuid: '',
			name: '全部',
			value: '全部',
			top: false,
		},
		currentRunningItem: {
			uuid: '',
			name: '全部',
			value: '全部',
		},

		chooseValue: 'MONTH',
		orderBy: '',
		analysisType: ''
	},
	issuedate: '',
	endissuedate: '',

	balanceReport: {
		categoryUuid: null,
		childList: [
		// 	{
		// 		categoryUuid: '111',
		// 		childList: [
		// 			{
		// 				categoryUuid: '234',
		// 				childList: [
		// 					{
		// 						categoryUuid: '234234',
		// 						childList: [],
		// 						closeCredit: 0,
		// 						closeDebit: 0,
		// 						currentCredit: 13,
		// 						currentDebit: 13,
		// 						name: "003",
		// 						openCredit: 0,
		// 						openDebit: 0,
		// 						yearCredit: 13,
		// 						yearDebit: 13,
		// 					}
		// 				],
		// 				closeCredit: 0,
		// 				closeDebit: 0,
		// 				currentCredit: 13,
		// 				currentDebit: 13,
		// 				name: "002",
		// 				openCredit: 0,
		// 				openDebit: 0,
		// 				yearCredit: 13,
		// 				yearDebit: 13,
		// 			},
		// 			{
		// 				categoryUuid: '23wee42',
		// 				childList: [
		// 					{
		// 						categoryUuid: '234234',
		// 						childList: [],
		// 						closeCredit: 0,
		// 						closeDebit: 0,
		// 						currentCredit: 13,
		// 						currentDebit: 13,
		// 						name: "003",
		// 						openCredit: 0,
		// 						openDebit: 0,
		// 						yearCredit: 13,
		// 						yearDebit: 13,
		// 					},
		// 					{
		// 						categoryUuid: '234234',
		// 						childList: [],
		// 						closeCredit: 0,
		// 						closeDebit: 0,
		// 						currentCredit: 13,
		// 						currentDebit: 13,
		// 						name: "003",
		// 						openCredit: 0,
		// 						openDebit: 0,
		// 						yearCredit: 13,
		// 						yearDebit: 13,
		// 					},
		// 					{
		// 						categoryUuid: '234234',
		// 						childList: [],
		// 						closeCredit: 0,
		// 						closeDebit: 0,
		// 						currentCredit: 13,
		// 						currentDebit: 13,
		// 						name: "003",
		// 						openCredit: 0,
		// 						openDebit: 0,
		// 						yearCredit: 13,
		// 						yearDebit: 13,
		// 					}
		// 				],
		// 				closeCredit: 0,
		// 				closeDebit: 0,
		// 				currentCredit: 13,
		// 				currentDebit: 13,
		// 				name: "002-0034-23",
		// 				openCredit: 0,
		// 				openDebit: 0,
		// 				yearCredit: 13,
		// 				yearDebit: 13,
		// 			}
		// 		],
		// 		closeCredit: 0,
		// 		closeDebit: 0,
		// 		currentCredit: 13,
		// 		currentDebit: 13,
		// 		name: "001",
		// 		openCredit: 0,
		// 		openDebit: 0,
		// 		yearCredit: 13,
		// 		yearDebit: 13,
		// 	},
		// 	{
		// 		categoryUuid: '2222',
		// 		childList: [],
		// 		closeCredit: 0,
		// 		closeDebit: 0,
		// 		currentCredit: 13,
		// 		currentDebit: 13,
		// 		name: "002-002",
		// 		openCredit: 0,
		// 		openDebit: 0,
		// 		yearCredit: 13,
		// 		yearDebit: 13,
		// 	}
		//
		//
		],
		closeCredit: 0,
		closeDebit: 0,
		currentCredit: 0,
		currentDebit: 0,
		name: "全部",
		openCredit: 0,
		openDebit: 0,
		yearCredit: 0,
		yearDebit: 0,
	},
	// 流水类别
	categoryList: [


	],
	runningCategoryList:[]
	// contactTypeTree: [
	// 	{
	// 		"childList": [],
	// 	}
	// ],
})


export default function handleRelativeYeb(state = relativeYebState, action) {
	return ({
		[ActionTypes.INIT_RELATIVEYEB]							                          : () => relativeYebState,

		[ActionTypes.GET_PERIOD_AND_RELATIVE_YEB_BALANCE_LIST]		                      : () => {

			return state = state.set('issuedate', action.issuedate)
								.set('endissuedate', action.endissuedate)
								.set('balanceReport', fromJS(action.receivedData))
								.setIn(['views', 'orderBy'], action.orderBy ? action.orderBy : '')
		},
		[ActionTypes.GET_RELATIVE_YEB_BALANCE_LIST_FROM_SWITCH_PERIOD_OR_RELATIVE]		  : () => {

			return state = state.set('issuedate', action.issuedate)
								.set('endissuedate', action.endissuedate)
								.set('balanceReport', fromJS(action.receivedData))
								.setIn(['views', 'currentRelativeItem'], action.relativeItem)
								.setIn(['views', 'currentRunningItem'], action.runningItem)
								.setIn(['views', 'showChildList'], fromJS([]))
								.setIn(['views', 'orderBy'], action.orderBy ? action.orderBy : '')
		},
		[ActionTypes.GET_RELATIVE_YEB_BALANCE_LIST_REFRESH]		                          : () => {

			return state = state.set('balanceReport', fromJS(action.receivedData))
			.setIn(['views', 'orderBy'], action.orderBy ? action.orderBy : '')
		},
		[ActionTypes.GET_RELATIVE_YEB_CATEGORY_FETCH]		                              : () => {

			return state = state.set('categoryList', fromJS(action.cardCategory))
								.set('runningCategoryList', fromJS(action.runningCategory))
		},
		[ActionTypes.CHANGE_RELATIVE_YEB_CHILD_ITEM_SHOW]	                              : () => {

			const showChildList = state.getIn(['views', 'showChildList'])
			const position = showChildList.indexOf(action.key)
			if (position > -1) {
				state = state.updateIn(['views', 'showChildList'], v => v.delete(position))
			} else {
				if(action.totalNumber > Limit.YEB_EXPAND_MAX_NUMBER){
					state = state.setIn(['views', 'showChildList'], fromJS(action.parentKey))
				}else{
					state = state.updateIn(['views', 'showChildList'], v => v.set(v.size, action.key))
				}

			}
			return state
		},
		[ActionTypes.CHANGE_RELATIVE_YEB_CHOOSE_VALUE]                             : () => {
			return state.setIn(['views', 'chooseValue'], action.chooseValue)
		},
		[ActionTypes.CHANGE_RELATIVE_YEB_ANALYSIS_VALUE]                             : () => {
			return state.setIn(['views', 'analysisType'], action.value)
		}

	}[action.type] || (() => state))()
}
