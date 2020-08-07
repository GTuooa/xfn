import { fromJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'

//生产环境应当设置为空
const projectYebState = fromJS({
	views: {
		showChildList: [],
		currentProjectItem: {
			uuid: '',
			name: '全部',
			value: '全部',
			top: false,
		},
		currentRunningItem: {
			jrCategoryUuid: '',
			jrCategoryName: '全部',
			value: '全部',
			direction: 'double_credit'
		},
		currentJrTypeItem: {
			jrJvTypeUuid: '',
			typeName: '全部',
			value: '全部',
			direction: 'double_credit',
			mergeName: '全部'
		},
		chooseValue: 'MONTH',
		tableName: 'Income',//收支、类型
		analysisValue: '0'
	},
	issuedate: '',
	endissuedate: '',

	balanceReport: {
		categoryUuid: null,
		childList: [],
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
	categoryList: [],
	runningCategoryList: [],
	jrTypeList: [],
	// contactTypeTree: [
	// 	{
	// 		"childList": [],
	// 	}
	// ],

})


export default function handleProjectYeb(state = projectYebState, action) {
	return ({
		[ActionTypes.INIT_PROJECTYEB]							 : () => projectYebState,
		[ActionTypes.GET_PERIOD_AND_PROJECT_YEB_BALANCE_LIST]		                      : () => {

			return state = state.set('issuedate', action.issuedate)
								.set('endissuedate', action.endissuedate)
								.set('balanceReport', fromJS(action.receivedData))
		},
		[ActionTypes.GET_PROJECT_YEB_BALANCE_LIST_FROM_SWITCH_PERIOD_OR_PROJECT]		  : () => {
			if(action.tableName === 'Income') {
				state = state.setIn(['views', 'currentRunningItem'], action.runningItem)
				if(action.category){
					state = state.set('runningCategoryList', fromJS(action.category))
				}
			}else{
				state = state.setIn(['views', 'currentJrTypeItem'], action.typeItem)
				if(action.category){
					state = state.set('jrTypeList', fromJS(action.category))
				}
			}

			return state = state.set('issuedate', action.issuedate)
								.set('endissuedate', action.endissuedate)
								.set('balanceReport', fromJS(action.receivedData))
								.setIn(['views', 'currentProjectItem'], action.projectItem)
								// .setIn(['views', 'currentRunningItem'], action.runningItem)
								.setIn(['views', 'showChildList'], fromJS([]))

		},
		[ActionTypes.GET_PROJECT_YEB_BALANCE_LIST_REFRESH]		                          : () => {
			if(action.tableName === 'Income' ){
				if(action.category){
					state = state.set('runningCategoryList', fromJS(action.category))
				}
			}else{
				if(action.category){
					state = state.set('jrTypeList', fromJS(action.category))
				}
			}
			return state = state.set('balanceReport', fromJS(action.receivedData))
		},
		[ActionTypes.GET_PROJECT_YEB_CATEGORY_FETCH]		                              : () => {
			if(!action.fromReflash && action.jrCategory !== undefined){
				state = state.set('runningCategoryList', fromJS(action.jrCategory))
			}
			if(action.categoryList !== undefined){
				state = state.set('categoryList', fromJS([{top:true,name:'全部',uuid:''}].concat(action.categoryList)))
			}
			return state

		},
		[ActionTypes.GET_PROJECT_YEB_TYPE_CATEGORY_FETCH]		                              : () => {
			if(!action.fromReflash && action.jrType){
				state = state.set('jrTypeList', fromJS(action.jrType))
			}
			if(action.categoryList){
				state = state.set('categoryList', fromJS([{top:true,name:'全部',uuid:''}].concat(action.categoryList)))
			}
			return state
		},
		[ActionTypes.CHANGE_PROJECT_YEB_CHILD_ITEM_SHOW]	                              : () => {

			// 分页  超过500条收拢其他 未做

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
		[ActionTypes.CHANGE_PROJECT_YEB_CHOOSE_VALUE]                             : () => {
			return state.setIn(['views', 'chooseValue'], action.chooseValue)
		},
		[ActionTypes.CHANGE_PROJECT_YEB_TABLE]                             : () => {
			return state.setIn(['views', 'tableName'], action.value)
		},
		[ActionTypes.CHANGE_PROJECT_YEB_ANALYSIS_VALUE]                             : () => {
			return state.setIn(['views', 'analysisValue'], action.value)
		}

	}[action.type] || (() => state))()
}
