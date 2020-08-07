import { fromJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'

//生产环境应当设置为空
const projectMxbState = fromJS({
	views: {
		issuedate:'',
		endissuedate: '',
		tableName: 'Income',
		currentProjectItem: {
			uuid: '',
			name: '全部',
			value: '全部',
			top: false,
		},
		currentCardItem: {
			uuid: '',
			name: '全部',
			code: '',
		},
		currentRunningCategoryItem: {
			jrCategoryUuid: '',
			jrCategoryName: '全部流水类别',
			direction: 'double_credit'
		},
		currentRunningTypeItem: {
			jrJvTypeUuid: '',
			typeName: '全部类型',
			direction: 'double_credit'
		},
		chooseDirection : 'double_credit',
		chooseValue: 'ISSUE',

	},
	issues:[],
	projectCategoryList:[{
		key:`${Limit.TREE_JOIN_STR}0`,
		label:'全部',
		childList:[]
	}], //项目卡片类别
	cardList:[], //项目卡片列表
	runningCategoryList: [{key:'',label:'',childList:[]}], //流水类别
	runningTypeList: [{key:'',label:'',childList:[]}], //流水类别
	QcData:[],
	QmData: {

	},
	currentPage: 1,
	pages: 1,
	detailsTemp: []
})


export default function handleProjectMxb(state = projectMxbState, action) {
	return ({
		[ActionTypes.INIT_PROJECT_MXB]							 : () => projectMxbState,
		[ActionTypes.GET_PROJECTMXB_BALANCE_LIST_FROM_PROJECTYEB]         : () => {
			state = state.setIn(['views','issuedate'], action.issuedate)
						.setIn(['views','endissuedate'], action.endissuedate)
						.setIn(['views', 'currentCardItem'], action.projectCardItem)
						.setIn(['views', 'currentProjectItem'], action.currentProjectItem)
						.setIn(['views', 'tableName'], action.tableName)
						// 清数据
						.setIn(['views', 'chooseDirection'], action.runningJrTypeItem.get('direction'))
			if(action.receivedData.cardList){
				let cardListArr = [{name: '全部',uuid: ''}]
				action.receivedData.cardList && action.receivedData.cardList.map(item => {
					cardListArr.push({
						name: `${item.name}`,
						uuid: item.uuid
					})
				})
				state = state.set('cardList',fromJS(cardListArr))
				// state = state.setIn(['views','cardList'],fromJS(action.receivedData.cardList))
			}
			if(action.tableName === 'Income'){
				state = state.setIn(['views', 'currentRunningCategoryItem'], action.runningJrTypeItem)
								.setIn(['views', 'currentRunningTypeItem'], projectMxbState.getIn(['views', 'currentRunningTypeItem']))
			}else{
				state = state.setIn(['views', 'currentRunningTypeItem'], action.runningJrTypeItem)
								.setIn(['views', 'currentRunningCategoryItem'], projectMxbState.getIn(['views', 'currentRunningCategoryItem']))
			}
			if(action.needPeriod === 'true'){
				state = state.set('issues',fromJS(action.issues))
			}
			if (action.reportData) {
				const {incomeAmount, expenseAmount, realIncomeAmount, realExpenseAmount, balance, direction} = action.reportData
				const QmData = {incomeAmount, expenseAmount, realIncomeAmount, realExpenseAmount, balance, direction}
				state = state.set('detailsTemp', fromJS(action.reportData.detailList))
							.set('QcData', fromJS(action.reportData.openDetail))
							.set('QmData', fromJS(QmData))
							.set('currentPage', action.reportData.currentPage)
							.set('pages', action.reportData.pages)
			} else {
				state = state.set('detailsTemp', projectMxbState.get('detailsTemp'))
			}

			return state
		},
		[ActionTypes.GET_PROJECT_MXB_RUNNING_CATEGORY]	       : () => {
			if(action.receivedData.categoryList.length > 0){
				state = state.setIn(['views','direction'], 'double_debit')
			}
			const loop = (item) => item.map((v, i) => {
				if (v.childList && v.childList.length) {
					return {
						key: `${v.jrCategoryUuid}${Limit.TREE_JOIN_STR}${v.direction}`,
						label: v.jrCategoryName,
						childList: loop(v.childList)
					}
				} else {
					return {
						key: `${v.jrCategoryUuid}${Limit.TREE_JOIN_STR}${v.direction}`,
						label: v.jrCategoryName,
						childList: [],
					}
				}
			})
			let initCategoryList = [{
				key:`${Limit.TREE_JOIN_STR}double_credit`,
				label:'全部流水类别',
				childList:[]
			}]
			const categoryList = loop(action.receivedData.categoryList)
			const newCategoryList = initCategoryList.concat(categoryList)

			return state = state.set('runningCategoryList', fromJS(newCategoryList))
								.setIn(['views', 'currentRunningCategoryItem'], action.currentRunningCategoryItem)
								.setIn(['views', 'currentRunningTypeItem'], projectMxbState.getIn(['views', 'currentRunningTypeItem']))



		},
		[ActionTypes.GET_PROJECT_MXB_CATEGORY_FETCH]			       : () => {
			let initCategory = [{
				key:`${Limit.TREE_JOIN_STR}true`,
				label:'全部',
				childList:[]
			}]
			const projectLoop = (item) => item.map((v, i) => {
				if (v.childList && v.childList.length) {
					return {
						key: `${v.uuid}${Limit.TREE_JOIN_STR}${v.top ? v.top : false}`,
						label: v.name,
						childList: projectLoop(v.childList)
					}
				} else {
					return {
						key: `${v.uuid}${Limit.TREE_JOIN_STR}${v.top ? v.top : false}`,
						label: v.name,
						childList: [],
					}
				}
			})

			const projectCategory = projectLoop(action.receivedData)
			const newProjectCategoryList = initCategory.concat(projectCategory)
			return state = state.set('projectCategoryList', fromJS(newProjectCategoryList))
		},
		[ActionTypes.GET_PROJECT_MXB_TYPE_FETCH]	       : () => {
			if(action.receivedData.childList.length > 0){
				state = state.setIn(['views','direction'], 'double_debit')
			}

			const loop = (item) => item.map((v, i) => {
				if (v.childList && v.childList.length) {
					return {
						key: `${v.jrJvTypeUuid}${Limit.TREE_JOIN_STR}${v.direction}${Limit.TREE_JOIN_STR}${v.mergeName}`,
						label: v.typeName,
						childList: loop(v.childList)
					}
				} else {
					return {
						key: `${v.jrJvTypeUuid}${Limit.TREE_JOIN_STR}${v.direction}${Limit.TREE_JOIN_STR}${v.mergeName}`,
						label: v.typeName,
						childList: [],
					}
				}
			})
			let initCategoryList = [{
				key:`${Limit.TREE_JOIN_STR}double_credit${Limit.TREE_JOIN_STR}全部类型`,
				label:'全部类型',
				childList:[]
			}]
			const categoryList = loop(action.receivedData.childList)
			const newCategoryList = initCategoryList.concat(categoryList)

			return state = state.set('runningTypeList', fromJS(newCategoryList))
								.setIn(['views', 'currentRunningTypeItem'], action.currentRunningTypeItem)
								.setIn(['views', 'currentRunningCategoryItem'], projectMxbState.getIn(['views', 'currentRunningCategoryItem']))



		},
		[ActionTypes.GET_PERIOD_AND_PROJECT_MXB_BALANCE_LIST]         : () => {
			if(action.receivedData.cardList){
				let cardListArr = [{name: '全部',uuid: ''}]
				action.receivedData.cardList && action.receivedData.cardList.map(item => {
					cardListArr.push({
						name: `${item.name}`,
						uuid: item.uuid
					})
				})
				state = state.set('cardList',fromJS(cardListArr))
				// state = state.setIn(['views','cardList'],fromJS(action.receivedData.cardList))
			}

			state = state.setIn(['views','issuedate'], action.issuedate)
						.setIn(['views','endissuedate'], action.endissuedate)
						.setIn(['views', 'currentCardItem'], action.cardItem ? fromJS(action.cardItem) : projectMxbState.getIn(['views', 'currentCardItem']))
						.setIn(['views', 'currentRunningCategoryItem'], action.currentRunningCategoryItem ? action.currentRunningCategoryItem : projectMxbState.getIn(['views', 'currentRunningCategoryItem']))
						.setIn(['views', 'currentRunningTypeItem'], action.currentRunningTypeItem ? action.currentRunningTypeItem : projectMxbState.getIn(['views', 'currentRunningTypeItem']))
			if(action.needPeriod === 'true'){
				state = state.set('issues',fromJS(action.issues))
			}
			if (action.reportData) {
				const {incomeAmount, expenseAmount, realIncomeAmount, realExpenseAmount, balance, direction} = action.reportData
				const QmData = {incomeAmount, expenseAmount, realIncomeAmount, realExpenseAmount, balance, direction}
				state = state.set('detailsTemp', fromJS(action.reportData.detailList))
							.set('QcData', fromJS(action.reportData.openDetail))
							.set('QmData', fromJS(QmData))
							.set('currentPage', action.reportData.currentPage)
							.set('pages', action.reportData.pages)
			} else {
				state = state.set('detailsTemp', projectMxbState.get('detailsTemp'))
			}

			return state
		},
		[ActionTypes.GET_PROJECT_MXB_BALANCE_LIST_FROM_CHANGE_PERIOD]         : () => {
			if(action.receivedData.cardList){
				let cardListArr = [{name: '全部',uuid: ''}]
				action.receivedData.cardList && action.receivedData.cardList.map(item => {
					cardListArr.push({
						name: `${item.name}`,
						uuid: item.uuid
					})
				})
				state = state.set('cardList',fromJS(cardListArr))
				// state = state.setIn(['views','cardList'],fromJS(action.receivedData.cardList))
			}

			state = state.setIn(['views','issuedate'], action.issuedate)
						.setIn(['views','endissuedate'], action.endissuedate)
						.setIn(['views', 'chooseDirection'], action.direction)
						.setIn(['views', 'currentCardItem'], action.cardItem ? fromJS(action.cardItem) : projectMxbState.getIn(['views', 'currentCardItem']))
						.setIn(['views', 'currentProjectItem'], action.currentProjectItem)
						.setIn(['views', 'currentRunningCategoryItem'], action.currentRunningCategoryItem ? action.currentRunningCategoryItem : projectMxbState.getIn(['views', 'currentRunningCategoryItem']))
						.setIn(['views', 'currentRunningTypeItem'], action.currentRunningTypeItem ? action.currentRunningTypeItem :  projectMxbState.getIn(['views', 'currentRunningTypeItem']))

			if (action.reportData) {
				const {incomeAmount, expenseAmount, realIncomeAmount, realExpenseAmount, balance, direction} = action.reportData
				const QmData = {incomeAmount, expenseAmount, realIncomeAmount, realExpenseAmount, balance, direction}
				state = state.set('detailsTemp', fromJS(action.reportData.detailList))
							.set('QcData', fromJS(action.reportData.openDetail))
							.set('QmData', fromJS(QmData))
							.set('currentPage', action.reportData.currentPage)
							.set('pages', action.reportData.pages)
			} else {
				state = state.set('detailsTemp', projectMxbState.get('detailsTemp'))
			}

			return state
		},
		[ActionTypes.CHANGE_PROJECT_MXB_TABLE]                             : () => {
			return state.setIn(['views', 'tableName'], action.value)
						.setIn(['views', 'chooseDirection'], 'double_credit')
		},
		[ActionTypes.PROJECT_MXB_CLEAR_CATEGORY_OR_TYPE]                             : () => {
			const runningCategoryList = [{
				key:`${Limit.TREE_JOIN_STR}double_credit`,
				label:'全部流水类别',
				childList:[]
			}]
			const runningTypeList = [{
				key:`${Limit.TREE_JOIN_STR}double_credit${Limit.TREE_JOIN_STR}全部类型`,
				label:'全部类型',
				childList:[]
			}]
			return state.set('runningCategoryList', fromJS(runningCategoryList))
						.set('runningTypeList', fromJS(runningTypeList))
						.set('QcData', fromJS([]))
						.set('QmData', fromJS({}))

		},
		[ActionTypes.GET_PROJECT_MXB_BALANCE_LIST_FROM_PROJECT]      : () => {
			if(action.receivedData.cardList){
				let cardListArr = [{name: '全部',uuid: ''}]
				action.receivedData.cardList && action.receivedData.cardList.map(item => {
					cardListArr.push({
						name: `${item.name}`,
						uuid: item.uuid
					})
				})
				state = state.set('cardList',fromJS(cardListArr))
				// state = state.setIn(['views','cardList'],fromJS(action.receivedData.cardList))
			}

			state = state.setIn(['views', 'currentCardItem'], action.cardItem ? fromJS(action.cardItem) : projectMxbState.getIn(['views', 'currentCardItem']))
						.setIn(['views', 'currentProjectItem'], action.projectItem)

			if (action.reportData) {
				const {incomeAmount, expenseAmount, realIncomeAmount, realExpenseAmount, balance, direction} = action.reportData
				const QmData = {incomeAmount, expenseAmount, realIncomeAmount, realExpenseAmount, balance, direction}
				state = state.set('detailsTemp', fromJS(action.reportData.detailList))
							.set('QcData', fromJS(action.reportData.openDetail))
							.set('QmData', fromJS(QmData))
							.set('currentPage', action.reportData.currentPage)
							.set('pages', action.reportData.pages)
			} else {
				state = state.set('detailsTemp', projectMxbState.get('detailsTemp'))
			}

			return state
		},
		[ActionTypes.GET_PROJECT_MXB_BALANCE_LIST_FROM_FILTER_OR_PAGE]          : () => {
			let newList = []
			if(action.shouldConcat){
				let oldList = state.get('detailsTemp').toJS()
				newList = oldList.concat(action.receivedData.detailList)
			}else{
				newList = action.receivedData.detailList
			}
			const {incomeAmount, expenseAmount, realIncomeAmount, realExpenseAmount, balance, direction} = action.receivedData
			const QmData = {incomeAmount, expenseAmount, realIncomeAmount, realExpenseAmount, balance, direction}
			state = state.set('detailsTemp', fromJS(newList))
						.set('QcData', fromJS(action.receivedData.openDetail))
						.set('QmData', fromJS(QmData))
						.set('currentPage', action.receivedData.currentPage)
						.set('pages', action.receivedData.pages)
			return state
		},
		[ActionTypes.GET_PROJECT_MXB_BALANCE_LIST_FROM_CARD_ITEM]    : () => {
			if (action.receivedData) {
				const {incomeAmount, expenseAmount, realIncomeAmount, realExpenseAmount, balance, direction} = action.receivedData
				const QmData = {incomeAmount, expenseAmount, realIncomeAmount, realExpenseAmount, balance, direction}
				state = state.set('detailsTemp', fromJS(action.receivedData.detailList))
							.set('QcData', fromJS(action.receivedData.openDetail))
							.set('QmData', fromJS(QmData))
							.set('currentPage', action.receivedData.currentPage)
							.set('pages', action.receivedData.pages)
			} else {
				state = state.set('detailsTemp', projectMxbState.get('detailsTemp'))
			}

			state = state.setIn(['views', 'currentCardItem'], action.cardItem)
						.setIn(['views', 'chooseDirection'], action.chooseDirection)
						.setIn(['views', 'currentRunningCategoryItem'], action.currentRunningCategoryItem ? action.currentRunningCategoryItem : projectMxbState.getIn(['views', 'currentRunningCategoryItem']))
						.setIn(['views', 'currentRunningTypeItem'], action.currentRunningTypeItem ? action.currentRunningTypeItem : projectMxbState.getIn(['views', 'currentRunningTypeItem']))

			return state
		},
		[ActionTypes.GET_PROJECT_MXB_BALANCE_LIST_FROM_CATEGORY_OR_TYPE]    : () => {
			const {incomeAmount, expenseAmount, realIncomeAmount, realExpenseAmount, balance, direction} = action.receivedData
			const QmData = {incomeAmount, expenseAmount, realIncomeAmount, realExpenseAmount, balance, direction}
			state = state.set('detailsTemp', fromJS(action.receivedData.detailList))
						.set('QcData', fromJS(action.receivedData.openDetail))
						.set('QmData', fromJS(QmData))
						.set('currentPage', action.receivedData.currentPage)
						.set('pages', action.receivedData.pages)
						.setIn(['views', action.selectType === 'Income' ? 'currentRunningCategoryItem' : 'currentRunningTypeItem'], action.currentItem)

			return state
		},
		[ActionTypes.CHANGE_PROJECT_MXB_REPORT_DIRECTION]             : () => {

			if (state.get('QcData')) {
				state = state.updateIn(['QcData', 'balance'], v => -v)
			}

			return state.setIn(['views', 'chooseDirection'], action.direction)
						.updateIn(['QmData', 'balance'], v => -v)

		},
		[ActionTypes.CHANGE_PROJECT_MXB_CHOOSE_VALUE]          : () => {
			return state = state.setIn(['views','chooseValue'],action.value)
		},

	}[action.type] || (() => state))()
}
