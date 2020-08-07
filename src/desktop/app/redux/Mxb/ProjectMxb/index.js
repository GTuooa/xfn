import { fromJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'

//生产环境应当设置为空
const projectMxbState = fromJS({
	views: {
		tableName: 'Income',
		chooseValue: 'MONTH',
		currentProjectItem: {
			uuid: '',
			name: '全部',
			value: '全部',
			top: false,
		},
		searchContent: '',
		selectType: 'category',

		currentCardItem: {
			uuid: '',
			name: '',
			code: '',
		},
		currentRunningCategoryItem: {
			jrCategoryUuid: '',
			jrCategoryName: '全部',
			direction: 'double_credit'
		},
		currentRunningTypeItem: {
			jrJvTypeUuid: '',
			typeName: '全部',
			direction: 'double_credit',
			mergeName: '全部'

		},
		chooseDirection : 'double_credit',
		analysisValue:'0',
		showAll: false,
		mergeStock: false,
	},
	issuedate: '',
	endissuedate: '',

	reportData: {
		balance: 0,
		credit: 0,
		debit: 0,
		direction: "credit",
		currentPage: 1,
		pages: 1,
		detailList: [],
		openDetail: {
			balance: 0
		}
	},
	// 往来类别
	projectCategoryList: [{
		childList: []
	}],
	// 往来卡片
	cardList: [],
	cardPages: 1,
	cardPageNum: 1,

	// 流水类别
	runningCategoryList: [],
	// 流水类型
	runningTypeList: [],

	// 筛选弹框
	commonCardObj: {
		memberList:[],
		thingsList:[],
		selectItem: [],
		selectList: [],
		selectedKeys: [`all${Limit.TREE_JOIN_STR}1`],
		selectThingsList:[],
		showSingleModal: false,
		selectI: '',
		modalName:'',
		showCommonModal: false,
		// chooseProjectCategory:[],
		// chooseProjectCard:[],

		// 筛选往来
		showCurrent: false,
		contactCardList:[],
		chooseContactCard:[],
		curSelectContactUuid: [],

		// 筛选存货
		showStock: false,
		stockCardList:[],
		chooseStockCard:[],
		curSelectStockUuid: [],

		// 筛选账户
		showAccount: false,
		accountCardList: [],
		chooseAccountCard:[],
		curSelectAccountUuid: [],



	},

})


export default function handleProjectMxb(state = projectMxbState, action) {
	return ({
		[ActionTypes.INIT_PROJECTMXB]							 : () => projectMxbState,
		[ActionTypes.GET_PROJECT_MXB_CATEGORY_FETCH]			       : () => {
			if(action.currentProjectItem){
				state = state.setIn(['views','currentProjectItem'],fromJS(action.currentProjectItem))
			}
			return state = state.set('projectCategoryList', fromJS([{top:true,name:'全部',uuid:''}].concat(action.receivedData)))
		},
		[ActionTypes.GET_PROJECT_MXB_RUNNING_CATEGORY]	       : () => {
			if(action.receivedData.categoryList.length > 0){
				state = state.setIn(['views','direction'], 'double_debit')
			}
			const initCategoryList = [{
				jrCategoryName: '全部',
				jrCategoryUuid: '',
				direction: 'double_credit',
				childList:[]
			}]
			const categoryList = action.receivedData.categoryList
			const newCategoryList = initCategoryList.concat(categoryList)

			return state = state.set('runningCategoryList', fromJS(newCategoryList))
								.setIn(['views', 'currentRunningCategoryItem'], action.currentRunningCategoryItem)
								.setIn(['views', 'currentRunningTypeItem'], projectMxbState.getIn(['views', 'currentRunningTypeItem']))



		},
		[ActionTypes.GET_PROJECT_MXB_TYPE_FETCH]	       : () => {
			if(action.receivedData.childList.length > 0){
				state = state.setIn(['views','direction'], 'double_debit')
			}
			const initCategoryList = [{
				jrJvTypeUuid: '',
				typeName: '全部',
				direction: 'double_credit'
			}]
			const categoryList = action.receivedData.childList
			const newCategoryList = initCategoryList.concat(categoryList)

			return state = state.set('runningTypeList', fromJS(newCategoryList))
								.setIn(['views', 'currentRunningTypeItem'], action.currentRunningTypeItem)
								.setIn(['views', 'currentRunningCategoryItem'], projectMxbState.getIn(['views', 'currentRunningCategoryItem']))



		},
		[ActionTypes.GET_PERIOD_AND_PROJECT_MXB_BALANCE_LIST]         : () => {
			state = state.set('issuedate', action.issuedate)
						.set('endissuedate', action.endissuedate)
						.set('cardList', fromJS(action.receivedData.cardList))
						.set('cardPages', action.receivedData.pages)
						.set('cardPageNum', action.receivedData.currentPage)
						.setIn(['views', 'currentCardItem'], action.cardItem ? fromJS(action.cardItem) : projectMxbState.getIn(['views', 'currentCardItem']))
						.setIn(['views', 'currentRunningCategoryItem'], action.currentRunningCategoryItem ? action.currentRunningCategoryItem : projectMxbState.getIn(['views', 'currentRunningCategoryItem']))
						.setIn(['views', 'currentRunningTypeItem'], action.currentRunningTypeItem ? action.currentRunningTypeItem : projectMxbState.getIn(['views', 'currentRunningTypeItem']))

			if (action.reportData) {
				if(action.reportData.stockList !== null){
					state = state.setIn(['commonCardObj', 'stockCardList'], fromJS(action.reportData.stockList))
				}
				if(action.reportData.contactList !== null){
					state = state.setIn(['commonCardObj', 'contactCardList'], fromJS(action.reportData.contactList))
				}
				if(action.reportData.accountList !== null){
					state = state.setIn(['commonCardObj', 'accountCardList'], fromJS(action.reportData.accountList))
				}
				state = state.set('reportData', fromJS(action.reportData))
			} else {
				state = state.set('reportData', projectMxbState.get('reportData'))
			}

			return state
		},
		[ActionTypes.GET_PROJECT_MXB_CARD_LIST]         : () => {

			state = state.set('cardList', fromJS(action.receivedData.cardList))
						.set('cardPages', fromJS(action.receivedData.pages))
						.set('cardPageNum', fromJS(action.receivedData.currentPage))

			return state
		},
		[ActionTypes.GET_PROJECTMXB_BALANCE_LIST_FROM_PROJECTYEB]         : () => {
			state = state.set('issuedate', action.issuedate)
						.set('endissuedate', action.endissuedate)
						.setIn(['views', 'chooseperiods'], action.issuedate === action.endissuedate ? false : true)
						.set('cardList', fromJS(action.receivedData.cardList))
						.setIn(['views', 'currentCardItem'], action.projectCardItem)
						.setIn(['views', 'currentProjectItem'], action.currentProjectItem)
						.setIn(['views', 'tableName'], action.tableName)
						.setIn(['views', 'analysisValue'], action.analysisValue)
						.set('cardPages', action.receivedData.pages)
						.set('cardPageNum', action.receivedData.currentPage)
						// 清数据
						.setIn(['views', 'searchContent'], '')
						.setIn(['views', 'selectType'], 'category')
						.setIn(['views', 'chooseDirection'], action.runningJrTypeItem.get('direction'))
			if(action.tableName === 'Income'){
				state = state.setIn(['views', 'currentRunningCategoryItem'], action.runningJrTypeItem)
								.setIn(['views', 'currentRunningTypeItem'], projectMxbState.getIn(['views', 'currentRunningTypeItem']))
			}else{
				state = state.setIn(['views', 'currentRunningTypeItem'], action.runningJrTypeItem)
								.setIn(['views', 'currentRunningCategoryItem'], projectMxbState.getIn(['views', 'currentRunningCategoryItem']))
			}
			if (action.reportData) {
				if(action.reportData.stockList !== null){
					state = state.setIn(['commonCardObj', 'stockCardList'], fromJS(action.reportData.stockList))
				}
				if(action.reportData.contactList !== null){
					state = state.setIn(['commonCardObj', 'contactCardList'], fromJS(action.reportData.contactList))
				}
				if(action.reportData.accountList !== null){
					state = state.setIn(['commonCardObj', 'accountCardList'], fromJS(action.reportData.accountList))
				}
				state = state.set('reportData', fromJS(action.reportData))
			} else {
				state = state.set('reportData', projectMxbState.get('reportData'))
			}

			return state
		},
		[ActionTypes.GET_PROJECT_MXB_BALANCE_LIST_REFRESH]            : () => {
			state = state.set('cardList', fromJS(action.receivedData.cardList))
							.set('cardPages', action.receivedData.pages)
							.set('cardPageNum', action.receivedData.currentPage)

			if (action.reportData) {
				state = state.set('reportData', fromJS(action.reportData))
				if(action.reportData.stockList !== null){
					state = state.setIn(['commonCardObj', 'stockCardList'], fromJS(action.reportData.stockList))
				}
				if(action.reportData.contactList !== null){
					state = state.setIn(['commonCardObj', 'contactCardList'], fromJS(action.reportData.contactList))
				}
				if(action.reportData.accountList !== null){
					state = state.setIn(['commonCardObj', 'accountCardList'], fromJS(action.reportData.accountList))
				}
			} else {
				state = state.set('reportData', projectMxbState.get('reportData'))
			}


			return state
		},
		[ActionTypes.GET_PROJECT_MXB_BALANCE_LIST_FROM_CHANGE_PERIOD]         : () => {

			state = state.set('issuedate', action.issuedate)
						.set('endissuedate', action.endissuedate)
						.set('cardList', fromJS(action.receivedData.cardList))
						.set('cardPages', action.receivedData.pages)
						.set('cardPageNum', action.receivedData.currentPage)
						.setIn(['views', 'currentCardItem'], action.cardItem ? fromJS(action.cardItem) : projectMxbState.getIn(['views', 'currentCardItem']))

						.setIn(['views', 'selectType'], 'category')
						.setIn(['views', 'chooseDirection'], action.direction)
						.setIn(['views', 'currentProjectItem'], action.currentProjectItem ? action.currentProjectItem : projectMxbState.getIn(['views', 'currentProjectItem']))
						.setIn(['views', 'currentRunningCategoryItem'], action.currentRunningCategoryItem ? action.currentRunningCategoryItem : projectMxbState.getIn(['views', 'currentRunningCategoryItem']))
						.setIn(['views', 'currentRunningTypeItem'], action.currentRunningTypeItem ? action.currentRunningTypeItem :  projectMxbState.getIn(['views', 'currentRunningTypeItem']))

			if (action.reportData) {
				if(action.reportData.stockList !== null){
					state = state.setIn(['commonCardObj', 'stockCardList'], fromJS(action.reportData.stockList))
				}
				if(action.reportData.contactList !== null){
					state = state.setIn(['commonCardObj', 'contactCardList'], fromJS(action.reportData.contactList))
				}
				if(action.reportData.accountList !== null){
					state = state.setIn(['commonCardObj', 'accountCardList'], fromJS(action.reportData.accountList))
				}
				state = state.set('reportData', fromJS(action.reportData))
			} else {
				state = state.set('reportData', projectMxbState.get('reportData'))
			}

			return state
		},
		[ActionTypes.GET_PROJECT_MXB_BALANCE_LIST_FROM_PROJECT]      : () => {

			state = state.set('cardList', fromJS(action.receivedData.cardList))
						.set('cardPages', action.receivedData.pages)
						.set('cardPageNum', action.receivedData.currentPage)
						.setIn(['views', 'currentCardItem'], action.cardItem ? fromJS(action.cardItem) : projectMxbState.getIn(['views', 'currentCardItem']))
						.setIn(['views', 'currentProjectItem'], action.projectItem)

			if (action.reportData) {
				if(action.reportData.stockList !== null){
					state = state.setIn(['commonCardObj', 'stockCardList'], fromJS(action.reportData.stockList))
				}
				if(action.reportData.contactList !== null){
					state = state.setIn(['commonCardObj', 'contactCardList'], fromJS(action.reportData.contactList))
				}
				if(action.reportData.accountList !== null){
					state = state.setIn(['commonCardObj', 'accountCardList'], fromJS(action.reportData.accountList))
				}
				state = state.set('reportData', fromJS(action.reportData))
			} else {
				state = state.set('reportData', projectMxbState.get('reportData'))
			}

			return state
		},
		[ActionTypes.GET_PROJECT_MXB_BALANCE_LIST_FROM_CARD_ITEM]    : () => {

			state = state.setIn(['views', 'currentCardItem'], action.cardItem)
						.set('reportData', fromJS(action.receivedData))
						.setIn(['views', 'chooseDirection'], action.chooseDirection)
						.setIn(['views', 'currentRunningCategoryItem'], action.currentRunningCategoryItem ? action.currentRunningCategoryItem : projectMxbState.getIn(['views', 'currentRunningCategoryItem']))
						.setIn(['views', 'currentRunningTypeItem'],action.currentRunningTypeItem ? action.currentRunningTypeItem : projectMxbState.getIn(['views', 'currentRunningTypeItem']))
			if(action.receivedData.stockList !== null){
				state = state.setIn(['commonCardObj', 'stockCardList'], fromJS(action.receivedData.stockList))
			}
			if(action.receivedData.contactList !== null){
				state = state.setIn(['commonCardObj', 'contactCardList'], fromJS(action.receivedData.contactList))
			}
			if(action.receivedData.accountList !== null){
				state = state.setIn(['commonCardObj', 'accountCardList'], fromJS(action.receivedData.accountList))
			}
			return state
		},
		[ActionTypes.CHANGE_PROJECT_MXB_SELECT_TYPE]    : () => {

			state = state.set('reportData', fromJS(action.receivedData))
						.setIn(['views', 'selectType'], action.categoryOrType)
						.setIn(['views', 'currentRunningCategoryItem'], projectMxbState.getIn(['views', 'currentRunningCategoryItem']))
						.setIn(['views', 'currentRunningTypeItem'], projectMxbState.getIn(['views', 'currentRunningTypeItem']))
			if(action.receivedData.stockList !== null){
				state = state.setIn(['commonCardObj', 'stockCardList'], fromJS(action.receivedData.stockList))
			}
			if(action.receivedData.contactList !== null){
				state = state.setIn(['commonCardObj', 'contactCardList'], fromJS(action.receivedData.contactList))
			}
			if(action.receivedData.accountList !== null){
				state = state.setIn(['commonCardObj', 'accountCardList'], fromJS(action.receivedData.accountList))
			}
			return state
		},
		[ActionTypes.GET_PROJECT_MXB_BALANCE_LIST_FROM_CATEGORY_OR_TYPE]    : () => {

			state = state.set('reportData', fromJS(action.receivedData))
						.setIn(['views', action.selectType === 'Income' ? 'currentRunningCategoryItem' : 'currentRunningTypeItem'], action.currentItem)
			if(action.receivedData.stockList !== null){
				state = state.setIn(['commonCardObj', 'stockCardList'], fromJS(action.receivedData.stockList))
			}
			if(action.receivedData.contactList !== null){
				state = state.setIn(['commonCardObj', 'contactCardList'], fromJS(action.receivedData.contactList))
			}
			if(action.receivedData.accountList !== null){
				state = state.setIn(['commonCardObj', 'accountCardList'], fromJS(action.receivedData.accountList))
			}
			return state
		},
		[ActionTypes.GET_PROJECT_MXB_BALANCE_LIST_FROM_FILTER_OR_PAGE]          : () => {

			state = state.set('reportData', fromJS(action.receivedData))
			if(action.receivedData.stockList !== null){
				state = state.setIn(['commonCardObj', 'stockCardList'], fromJS(action.receivedData.stockList))
			}
			if(action.receivedData.contactList !== null){
				state = state.setIn(['commonCardObj', 'contactCardList'], fromJS(action.receivedData.contactList))
			}
			if(action.receivedData.accountList !== null){
				state = state.setIn(['commonCardObj', 'accountCardList'], fromJS(action.receivedData.accountList))
			}
			return state
		},
		[ActionTypes.CHANGE_PROJECT_MXB_CHOOSE_VALUE]           : () => {
			return state.setIn(['views', 'chooseValue'], action.chooseValue)
		},
		[ActionTypes.CHANGE_PROJECT_MXB_SEARCH_CONTENT]               : () => {
			return state.setIn(['views', 'searchContent'], action.value)
		},
		[ActionTypes.CHANGE_PROJECT_MXB_REPORT_DIRECTION]             : () => {

			if (state.getIn(['reportData', 'openDetail'])) {
				state = state.updateIn(['reportData', 'openDetail', 'balance'], v => -v)
			}
			if(action.tableName === 'Income'){
				state = state.setIn(['views', 'currentRunningCategoryItem','direction'], action.direction)
			}else{
				state = state.setIn(['views', 'currentRunningTypeItem','direction'], action.direction)
			}

			return state.setIn(['views', 'chooseDirection'], action.direction)
						.updateIn(['reportData', 'balance'], v => -v)

		},
		[ActionTypes.CHANGE_PROJECT_MXB_TABLE]                             : () => {
			return state.setIn(['views', 'tableName'], action.value)
						.setIn(['views', 'chooseDirection'], 'double_credit')
		},
		[ActionTypes.PROJECT_MXB_CLEAR_CATEGORY_OR_TYPE]                             : () => {
			return state = state.set('runningTypeList', fromJS([]))
								.set('runningCategoryList', fromJS([]))
		},
		[ActionTypes.CHANGE_PROJECT_MXB_ANALYSIS_VALUE]                             : () => {
			return state.setIn(['views', 'analysisValue'], action.value)
						.setIn(['views', 'mergeStock'], false)
						.setIn(['views', 'showAll'], false)
						.setIn(['commonCardObj', 'showAccount'], false)
						.setIn(['commonCardObj', 'showCurrent'], false)
						.setIn(['commonCardObj', 'showStock'], false)
						.setIn(['commonCardObj', 'chooseStockCard'], fromJS([]))
						.setIn(['commonCardObj', 'chooseContactCard'], fromJS([]))
						.setIn(['commonCardObj', 'chooseAccountCard'], fromJS([]))
		},
		[ActionTypes.PROJECT_MXB_CHANGE_COMMON_VALUE]               : () => {
			return state.setIn(['views', action.name], action.value)
		},
		[ActionTypes.PROJECT_MXB_CHANGE_FILTER_CARD]               : () => {
			return state.setIn(['commonCardObj', action.name], action.value)
		},
		[ActionTypes.PROJECT_MXB_CHANGE_ITEM_CHECKBOX_CHECKED]               : () => {
                const showLowerList = state.getIn(['commonCardObj', action.curSelectUuidName])
                if (!action.checked) {
                        // 原来没选
                        const newShowLowerList = showLowerList.indexOf(action.uuid) === -1 ? showLowerList.push(action.uuid) : showLowerList
                        return state.setIn(['commonCardObj', action.curSelectUuidName], newShowLowerList)
                } else {
                        // 原来选了
                        const newShowLowerList = showLowerList.splice(showLowerList.findIndex(v => v === action.uuid), 1)
                        return state.setIn(['commonCardObj', action.curSelectUuidName], newShowLowerList)
                }

        },
		[ActionTypes.PROJECT_MXB_FILTER_CARD_CLEAR]         : () => {

			state = state.setIn(['commonCardObj','chooseStockCard'], fromJS([]))
						.setIn(['commonCardObj','chooseContactCard'], fromJS([]))
						.setIn(['commonCardObj','chooseAccountCard'], fromJS([]))

			return state
		},
		[ActionTypes.PROJECT_MXB_NEED_BRANCH_CLEAR]         : () => {

			state = state.setIn(['views','mergeStock'], false)
						.setIn(['views','showAll'], false)

			return state
		},


	}[action.type] || (() => state))()
}
