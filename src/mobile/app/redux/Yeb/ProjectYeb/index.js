import { fromJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'

//生产环境应当设置为空
const projectYebState = fromJS({
	views: {
		issuedate:'',
		endissuedate: '',
		bussinessShowChild:[],
		tableName: 'Income',
		currentProjectItem: {
			uuid: '',
			name: '全部',
			value: `${Limit.TREE_JOIN_STR}true`,
			top: false,
		},
		currentRunningItem: {
			jrCategoryUuid: '',
			jrCategoryName: '全部流水类别',
			value: '全部流水类别',
			direction: 'double_credit'
		},
		currentJrTypeItem: {
			jrJvTypeUuid: '',
			typeName: '全部类型',
			value: '全部类型',
			direction: 'double_credit'
		},
		chooseValue: 'ISSUE',
	},
	projectCategory:[{
		label:'全部',
		key:'-:-',
		childList:[]
	}],
	runningCategory:[{
		label:'全部流水类别',
		key:'-:-',
		childList:[]
	}],
	typeCategory:[{
		label:'全部类型',
		key:'-:-',
		childList:[]
	}],

	issues:[],
	balanceReport: {
		childList:[]
	}
})


export default function handleProjectYeb(state = projectYebState, action) {
	return ({
		[ActionTypes.INIT_PROJECT_YEB]							 : () => projectYebState,
		[ActionTypes.GET_PERIOD_AND_PROJECT_YEB_BALANCE_LIST]		                      : () => {
			if(action.needPeriod === 'true'){
				state = state.set('issues',fromJS(action.issues))
			}
			const initProjectItem = {
				uuid: '',
				name: '全部',
				value: `${Limit.TREE_JOIN_STR}true`,
				top: false,
			}
			const initRunningItem = {
				jrCategoryUuid: '',
				jrCategoryName: '全部流水类别',
				value: '全部流水类别',
				direction: 'double_credit'
			}
			const initJrTypeItem = {
				jrJvTypeUuid: '',
				typeName: '全部类型',
				value: '全部类型',
				direction: 'double_credit'
			}
			return state = state.setIn(['views','issuedate'], action.issuedate)
								.setIn(['views','endissuedate'], action.endissuedate)
								.set('balanceReport', fromJS(action.receivedData))
								.setIn(['views','currentProjectItem'], fromJS(initProjectItem))
								.setIn(['views','currentRunningItem'], fromJS(initRunningItem))
								.setIn(['views','currentJrTypeItem'], fromJS(initJrTypeItem))
								.setIn(['views','tableName'], action.tableName)
		},
		[ActionTypes.GET_PROJECT_YEB_CATEGORY_FETCH]		                              : () => {

			const initCategory = [{label:'全部',key:'-:-',childList:[]}]
			const initRunningCategory = [{label:'全部流水类别',key:'-:-全部流水类别-:-double_credit',childList:[]}]
			const loop = (item) => item && item.map((v, i) => {
				if (v.childList && v.childList.length) {
					return {
						key: `${v.uuid}${Limit.TREE_JOIN_STR}${v.top ? true : false}`,
						label: v.name,
						childList: loop(v.childList)
					}
				} else {
					return {
						key: `${v.uuid}${Limit.TREE_JOIN_STR}${v.top ? true : false}`,
						label: v.name,
						childList: [],
					}
				}
			})
			const runningLoop = (item) => item.map((v, i) => {
				if (v.childList && v.childList.length) {
					return {
						key: `${v.jrCategoryUuid}${Limit.TREE_JOIN_STR}${v.jrCategoryName}${Limit.TREE_JOIN_STR}${v.direction}`,
						label: v.jrCategoryName,
						childList: runningLoop(v.childList)
					}
				} else {
					return {
						key: `${v.jrCategoryUuid}${Limit.TREE_JOIN_STR}${v.jrCategoryName}${Limit.TREE_JOIN_STR}${v.direction}`,
						label: v.jrCategoryName,
						childList: [],
					}
				}
			})
			const categoryList = loop(action.categoryList)
			const projectCategory = initCategory.concat(categoryList)
			const jrCategory = runningLoop(action.jrCategory)
			const runningCategoryList = initRunningCategory.concat(jrCategory)
			if(action.categoryList){
				state = state.set('projectCategory', fromJS(projectCategory))
			}
			if(action.jrCategory){
				state = state.set('runningCategory', fromJS(runningCategoryList))
			}
			return state

		},
		[ActionTypes.GET_PROJECT_YEB_TYPE_CATEGORY_FETCH]		                              : () => {

			const initCategory = [{label:'全部',key:'-:-',childList:[]}]
			const initRunningCategory = [{label:'全部类型',key:'-:-全部类型-:-double_credit-:-全部类型',childList:[]}]
			const loop = (item) => item && item.map((v, i) => {
				if (v.childList && v.childList.length) {
					return {
						key: `${v.uuid}${Limit.TREE_JOIN_STR}${v.top ? true : false}`,
						label: v.name,
						childList: loop(v.childList)
					}
				} else {
					return {
						key: `${v.uuid}${Limit.TREE_JOIN_STR}${v.top ? true : false}`,
						label: v.name,
						childList: [],
					}
				}
			})
			const typeLoop = (item) => item && item.map((v, i) => {
				if (v.childList && v.childList.length) {
					return {
						key: `${v.jrJvTypeUuid}${Limit.TREE_JOIN_STR}${v.typeName}${Limit.TREE_JOIN_STR}${v.direction}${Limit.TREE_JOIN_STR}${v.mergeName}`,
						label: v.typeName,
						childList: typeLoop(v.childList)
					}
				} else {
					return {
						key: `${v.jrJvTypeUuid}${Limit.TREE_JOIN_STR}${v.typeName}${Limit.TREE_JOIN_STR}${v.direction}${Limit.TREE_JOIN_STR}${v.mergeName}`,
						label: v.typeName,
						childList: [],
					}
				}
			})
			const categoryList = loop(action.categoryList)
			const projectCategory = initCategory.concat(categoryList)
			const jrType = typeLoop(action.jrType)
			const typeCategory = initRunningCategory.concat(jrType)
			if(action.categoryList){
				state = state.set('projectCategory', fromJS(projectCategory))
			}
			if(action.jrType){
				state = state.set('typeCategory', fromJS(typeCategory))
			}

			return state
		},
		[ActionTypes.GET_PROJECT_YEB_BALANCE_LIST_FROM_SWITCH_PERIOD_OR_PROJECT]		  : () => {
			if(action.tableName === 'Income') {
				state = state.setIn(['views', 'currentRunningItem'], action.runningItem)
				if(action.category){
					const initRunningCategory = [{label:'全部流水类别',key:'-:-全部流水类别-:-double_credit',childList:[]}]
					const runningLoop = (item) => item.map((v, i) => {
						if (v.childList && v.childList.length) {
							return {
								key: `${v.jrCategoryUuid}${Limit.TREE_JOIN_STR}${v.jrCategoryName}${Limit.TREE_JOIN_STR}${v.direction}`,
								label: v.jrCategoryName,
								childList: runningLoop(v.childList)
							}
						} else {
							return {
								key: `${v.jrCategoryUuid}${Limit.TREE_JOIN_STR}${v.jrCategoryName}${Limit.TREE_JOIN_STR}${v.direction}`,
								label: v.jrCategoryName,
								childList: [],
							}
						}
					})
					const jrCategory = runningLoop(action.category)
					const runningCategoryList = initRunningCategory.concat(jrCategory)

					state = state.set('runningCategory', fromJS(runningCategoryList))

				}
			}else{
				state = state.setIn(['views', 'currentJrTypeItem'], action.typeItem)
				if(action.category){
					const initRunningCategory = [{label:'全部类型',key:'-:-全部类型-:-double_credit',childList:[]}]
					const typeLoop = (item) => item.map((v, i) => {
						if (v.childList && v.childList.length) {
							return {
								key: `${v.jrJvTypeUuid}${Limit.TREE_JOIN_STR}${v.typeName}${Limit.TREE_JOIN_STR}${v.direction}${Limit.TREE_JOIN_STR}${v.mergeName}`,
								label: v.typeName,
								childList: typeLoop(v.childList)
							}
						} else {
							return {
								key: `${v.jrJvTypeUuid}${Limit.TREE_JOIN_STR}${v.typeName}${Limit.TREE_JOIN_STR}${v.direction}${Limit.TREE_JOIN_STR}${v.mergeName}`,
								label: v.typeName,
								childList: [],
							}
						}
					})
					const jrType = typeLoop(action.category)
					const typeCategory = initRunningCategory.concat(jrType)

					return state = state.set('typeCategory', fromJS(typeCategory))
				}
			}

			return state = state.setIn(['views','issuedate'], action.issuedate)
								.setIn(['views','endissuedate'], action.endissuedate)
								.set('balanceReport', fromJS(action.receivedData))
								.setIn(['views', 'currentProjectItem'], action.projectItem)
								// .setIn(['views', 'currentRunningItem'], action.runningItem)
								.setIn(['views', 'bussinessShowChild'], fromJS([]))

		},
		[ActionTypes.CHANGE_PROJECT_YEB_TABLE]                             : () => {
			return state.setIn(['views', 'tableName'], action.value)
		},
		[ActionTypes.PROJECT_BALANCE_TRIANGLE_SWITCH]          : () => {
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
		[ActionTypes.CHANGE_PROJECT_YEB_CHOOSE_VALUE]          : () => {
			return state = state.setIn(['views','chooseValue'],action.value)
		},

	}[action.type] || (() => state))()
}
