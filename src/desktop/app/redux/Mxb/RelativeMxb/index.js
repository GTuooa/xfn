import { fromJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'

//生产环境应当设置为空
const relativeMxbState = fromJS({
	views: {
		chooseValue: 'MONTH',
		currentRelativeItem: {
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
			jrTypeUuid: '',
			jrTypeName: '',
			jrDirection: 'debit'
		},
		chooseDirection : 'double_credit',
		needBranch: false,
		mergeStockBranch: false,
		showStock: false,
		showProject: false,
		showAccount: false,
		analysisType: ''

	},
	issuedate: '',
	endissuedate: '',

	reportData: {
		balance: 0,
		credit: 0,
		debit: 0,
		currentPage: 1,
		pages: 1,
		direction: "credit",
		detailList: [],
		openDetail: {
			balance: 0
		}
	},
	// 往来类别
	relativeCategoryList: [{
		childList: []
	}],
	// 往来卡片
	cardList: [],

	// 流水类别
	runningCategoryList: [
		{
			jrCategoryName: '全部',
			jrCategoryUuid: '',
			direction: 'double_credit',
			childList:[]
		}
	],
	// 流水类型
	runningTypeList: [],

	// 卡片分页
	// cardPagination: {
	// 	currentPage: 1,
	// 	pages: 1,
	// },
	cardPages: 1,
	cardPageNum: 1,

	// 筛选弹框
	commonCardObj: {
		memberList:[],
		thingsList:[],
		modalName:'',
		showCommonModal: false,

		// 筛选项目
		projectCardList:[],
		chooseProjectCard:[],
		curSelectProjectUuid: [],

		// 筛选存货
		stockCardList:[],
		chooseStockCard:[],
		curSelectStockUuid: [],

		// 筛选账户
		accountCardList: [],
		chooseAccountCard:[],
		curSelectAccountUuid: [],

		// 筛选流水类别
		jrCategoryList: [],
		chooseJrCategoryCard:[],
		curSelectJrCategoryUuid: [],
		checkedKeys: [],

	},
})


export default function handleRelativeMxb(state = relativeMxbState, action) {
	return ({
		[ActionTypes.INIT_RELATIVEMXB]							       : () => relativeMxbState,
		[ActionTypes.RELATIVE_MXB_CLEAR_CATEGORY_OR_TYPE]                             : () => {
			return state = state.set('runningTypeList', fromJS([]))
								.set('runningCategoryList', fromJS([{
									jrCategoryName: '全部',
									jrCategoryUuid: '',
									direction: 'double_credit',
									childList:[]
								}]))
		},

		[ActionTypes.GET_RELATIVE_MXB_CATEGORY_FETCH]			       : () => {
			return state = state.set('relativeCategoryList', fromJS(action.receivedData))
		},
		[ActionTypes.GET_RELATIVE_MXB_CATEGORY_AND_TYPE_FETCH]	       : () => {
			if(action.receivedData.categoryList.length > 0){
				state = state.setIn(['views','direction'], 'double_debit')
			}
			const oldCategoryList = [
				{
					jrCategoryName: '全部',
					jrCategoryUuid: '',
					direction: 'double_credit',
					childList:[]
				}
			]
			const newCategoryList = oldCategoryList.concat(action.receivedData.categoryList)
			return state = state.set('runningCategoryList', fromJS(newCategoryList))
								.set('runningTypeList', fromJS(action.receivedData.typeList))
								.setIn(['views', 'currentRunningCategoryItem'], action.currentRunningCategoryItem)
								// .setIn(['views', 'currentRunningTypeItem'], relativeMxbState.getIn(['views', 'currentRunningTypeItem']))



		},
		[ActionTypes.GET_PERIOD_AND_RELATIVE_MXB_BALANCE_LIST]         : () => {

			state = state.set('issuedate', action.issuedate)
						.set('endissuedate', action.endissuedate)
						.set('cardList', fromJS(action.receivedData.cardList))
						.set('cardPages', fromJS(action.receivedData.pages))
						.set('cardPageNum', fromJS(action.receivedData.currentPage))
						.setIn(['views', 'currentCardItem'], action.cardItem ? fromJS(action.cardItem) : relativeMxbState.getIn(['views', 'currentCardItem']))
						.setIn(['views', 'currentRunningCategoryItem'], action.currentRunningCategoryItem ? action.currentRunningCategoryItem : relativeMxbState.getIn(['views', 'currentRunningCategoryItem']))
						.setIn(['views', 'currentRunningTypeItem'], action.currentRunningTypeItem ? action.currentRunningTypeItem : relativeMxbState.getIn(['views', 'currentRunningTypeItem']))
						.setIn(['views', 'analysisType'], action.analysisType)

			if (action.reportData) {
				if(action.reportData.stockList !== null){
					state = state.setIn(['commonCardObj', 'stockCardList'], fromJS(action.reportData.stockList))
				}
				if(action.reportData.projectList !== null){
					state = state.setIn(['commonCardObj', 'projectCardList'], fromJS(action.reportData.projectList))
				}
				if(action.reportData.accountList !== null){
					state = state.setIn(['commonCardObj', 'accountCardList'], fromJS(action.reportData.accountList))
				}
				if(action.reportData.jrCategoryList !== null){
					state = state.setIn(['commonCardObj', 'jrCategoryList'], fromJS(action.reportData.jrCategoryList))
				}
				state = state.set('reportData', fromJS(action.reportData))
			} else {
				state = state.set('reportData', relativeMxbState.get('reportData'))
			}

			return state
		},
		[ActionTypes.GET_RELATIVEMXB_BALANCE_LIST_FROM_RELATIVEYEB]         : () => {
			state = state.set('issuedate', action.issuedate)
						.set('endissuedate', action.endissuedate)
						.setIn(['views', 'chooseperiods'], action.issuedate === action.endissuedate ? false : true)
						.set('cardList', fromJS(action.receivedData.cardList))
						.set('cardPages', fromJS(action.receivedData.pages))
						.set('cardPageNum', fromJS(action.receivedData.currentPage))
						.setIn(['views', 'currentCardItem'], action.relativeCardItem)
						.setIn(['views', 'currentRelativeItem'], action.currentRelativeItem)
						// 清数据
						.setIn(['views', 'searchContent'], '')
						.setIn(['views', 'selectType'], 'category')
						.setIn(['views', 'currentRunningCategoryItem'], relativeMxbState.getIn(['views', 'currentRunningCategoryItem']))
						.setIn(['views', 'currentRunningTypeItem'], relativeMxbState.getIn(['views', 'currentRunningTypeItem']))

			if (action.reportData) {
				if(action.reportData.stockList !== null){
					state = state.setIn(['commonCardObj', 'stockCardList'], fromJS(action.reportData.stockList))
				}
				if(action.reportData.projectList !== null){
					state = state.setIn(['commonCardObj', 'projectCardList'], fromJS(action.reportData.projectList))
				}
				if(action.reportData.accountList !== null){
					state = state.setIn(['commonCardObj', 'accountCardList'], fromJS(action.reportData.accountList))
				}
				if(action.reportData.jrCategoryList !== null){
					state = state.setIn(['commonCardObj', 'jrCategoryList'], fromJS(action.reportData.jrCategoryList))
				}
				state = state.set('reportData', fromJS(action.reportData))
			} else {
				state = state.set('reportData', relativeMxbState.get('reportData'))
			}

			return state
		},
		[ActionTypes.GET_RELATIVE_MXB_BALANCE_LIST_REFRESH]            : () => {
			state = state.set('cardList', fromJS(action.receivedData.cardList))
						.set('cardPages', fromJS(action.receivedData.pages))
						.set('cardPageNum', fromJS(action.receivedData.currentPage))

			if (action.reportData) {
				if(action.reportData.stockList !== null){
					state = state.setIn(['commonCardObj', 'stockCardList'], fromJS(action.reportData.stockList))
				}
				if(action.reportData.projectList !== null){
					state = state.setIn(['commonCardObj', 'projectCardList'], fromJS(action.reportData.projectList))
				}
				if(action.reportData.accountList !== null){
					state = state.setIn(['commonCardObj', 'accountCardList'], fromJS(action.reportData.accountList))
				}
				if(action.reportData.jrCategoryList !== null){
					state = state.setIn(['commonCardObj', 'jrCategoryList'], fromJS(action.reportData.jrCategoryList))
				}
				state = state.set('reportData', fromJS(action.reportData))
			} else {
				state = state.set('reportData', relativeMxbState.get('reportData'))
			}

			return state
		},
		[ActionTypes.GET_RELATIVE_MXB_BALANCE_LIST_FROM_CHANGE_PERIOD]         : () => {

			state = state.set('issuedate', action.issuedate)
						.set('endissuedate', action.endissuedate)
						.set('cardList', fromJS(action.receivedData.cardList))
						.set('cardPages', fromJS(action.receivedData.pages))
						.set('cardPageNum', fromJS(action.receivedData.currentPage))
						.setIn(['views', 'currentCardItem'], action.cardItem ? fromJS(action.cardItem) : relativeMxbState.getIn(['views', 'currentCardItem']))

						.setIn(['views', 'selectType'], 'category')
						.setIn(['views', 'chooseDirection'], action.direction)
						.setIn(['views', 'currentRelativeItem'], action.currentRelativeItem ? action.currentRelativeItem : relativeMxbState.getIn(['views', 'currentRelativeItem']))
						.setIn(['views', 'currentRunningCategoryItem'], action.currentRunningCategoryItem ? action.currentRunningCategoryItem : relativeMxbState.getIn(['views', 'currentRunningCategoryItem']))
						.setIn(['views', 'currentRunningTypeItem'], action.currentRunningTypeItem ? action.currentRunningTypeItem :  relativeMxbState.getIn(['views', 'currentRunningTypeItem']))

			if (action.reportData) {
				if(action.reportData.stockList !== null){
					state = state.setIn(['commonCardObj', 'stockCardList'], fromJS(action.reportData.stockList))
				}
				if(action.reportData.projectList !== null){
					state = state.setIn(['commonCardObj', 'projectCardList'], fromJS(action.reportData.projectList))
				}
				if(action.reportData.accountList !== null){
					state = state.setIn(['commonCardObj', 'accountCardList'], fromJS(action.reportData.accountList))
				}
				if(action.reportData.jrCategoryList !== null){
					state = state.setIn(['commonCardObj', 'jrCategoryList'], fromJS(action.reportData.jrCategoryList))
				}
				state = state.set('reportData', fromJS(action.reportData))
			} else {
				state = state.set('reportData', relativeMxbState.get('reportData'))
			}

			return state
		},
		[ActionTypes.GET_RELATIVE_MXB_BALANCE_LIST_FROM_RELATIVE]      : () => {

			state = state.set('cardList', fromJS(action.receivedData.cardList))
						.set('cardPages', fromJS(action.receivedData.pages))
						.set('cardPageNum', fromJS(action.receivedData.currentPage))
						.setIn(['views', 'currentCardItem'], action.cardItem ? fromJS(action.cardItem) : relativeMxbState.getIn(['views', 'currentCardItem']))
						.setIn(['views', 'currentRelativeItem'], action.relativeItem)

			if (action.reportData) {
				if(action.reportData.stockList !== null){
					state = state.setIn(['commonCardObj', 'stockCardList'], fromJS(action.reportData.stockList))
				}
				if(action.reportData.projectList !== null){
					state = state.setIn(['commonCardObj', 'projectCardList'], fromJS(action.reportData.projectList))
				}
				if(action.reportData.accountList !== null){
					state = state.setIn(['commonCardObj', 'accountCardList'], fromJS(action.reportData.accountList))
				}
				if(action.reportData.jrCategoryList !== null){
					state = state.setIn(['commonCardObj', 'jrCategoryList'], fromJS(action.reportData.jrCategoryList))
				}
				state = state.set('reportData', fromJS(action.reportData))
			} else {
				state = state.set('reportData', relativeMxbState.get('reportData'))
			}

			return state
		},
		[ActionTypes.GET_RELATIVE_MXB_BALANCE_LIST_FROM_CARD_ITEM]    : () => {
			if(action.receivedData.stockList !== null){
				state = state.setIn(['commonCardObj', 'stockCardList'], fromJS(action.receivedData.stockList))
			}
			if(action.receivedData.projectList !== null){
				state = state.setIn(['commonCardObj', 'projectCardList'], fromJS(action.receivedData.projectList))
			}
			if(action.receivedData.accountList !== null){
				state = state.setIn(['commonCardObj', 'accountCardList'], fromJS(action.receivedData.accountList))
			}
			if(action.receivedData.jrCategoryList !== null){
				state = state.setIn(['commonCardObj', 'jrCategoryList'], fromJS(action.receivedData.jrCategoryList))
			}
			state = state.setIn(['views', 'currentCardItem'], action.cardItem)
						.set('reportData', fromJS(action.receivedData))
						// .setIn(['views', 'currentRunningCategoryItem'], action.currentRunningCategoryItem ? action.currentRunningCategoryItem : relativeMxbState.getIn(['views', 'currentRunningCategoryItem']))
						// .setIn(['views', 'currentRunningTypeItem'], action.currentRunningTypeItem ? action.currentRunningTypeItem :  relativeMxbState.getIn(['views', 'currentRunningTypeItem']))
						.setIn(['views', 'chooseDirection'], action.chooseDirection)

			return state
		},
		[ActionTypes.CHANGE_RELATIVE_MXB_SELECT_TYPE]    : () => {
			if(action.receivedData.stockList !== null){
				state = state.setIn(['commonCardObj', 'stockCardList'], fromJS(action.receivedData.stockList))
			}
			if(action.receivedData.projectList !== null){
				state = state.setIn(['commonCardObj', 'projectCardList'], fromJS(action.receivedData.projectList))
			}
			if(action.receivedData.accountList !== null){
				state = state.setIn(['commonCardObj', 'accountCardList'], fromJS(action.receivedData.accountList))
			}
			if(action.receivedData.jrCategoryList !== null){
				state = state.setIn(['commonCardObj', 'jrCategoryList'], fromJS(action.receivedData.jrCategoryList))
			}
			state = state.set('reportData', fromJS(action.receivedData))
						.setIn(['views', 'selectType'], action.categoryOrType)
						.setIn(['views', 'currentRunningCategoryItem'], relativeMxbState.getIn(['views', 'currentRunningCategoryItem']))
						.setIn(['views', 'currentRunningTypeItem'], relativeMxbState.getIn(['views', 'currentRunningTypeItem']))

			return state
		},
		[ActionTypes.GET_RELATIVE_MXB_BALANCE_LIST_FROM_CATEGORY_OR_TYPE]    : () => {
			if(action.receivedData.stockList !== null){
				state = state.setIn(['commonCardObj', 'stockCardList'], fromJS(action.receivedData.stockList))
			}
			if(action.receivedData.projectList !== null){
				state = state.setIn(['commonCardObj', 'projectCardList'], fromJS(action.receivedData.projectList))
			}
			if(action.receivedData.accountList !== null){
				state = state.setIn(['commonCardObj', 'accountCardList'], fromJS(action.receivedData.accountList))
			}
			if(action.receivedData.jrCategoryList !== null){
				state = state.setIn(['commonCardObj', 'jrCategoryList'], fromJS(action.receivedData.jrCategoryList))
			}
			state = state.set('reportData', fromJS(action.receivedData))
						.setIn(['views', action.selectType === 'category' ? 'currentRunningCategoryItem' : 'currentRunningTypeItem'], action.currentItem)

			return state
		},
		[ActionTypes.GET_RELATIVE_MXB_BALANCE_LIST_FROM_FILTER_OR_PAGE]          : () => {
			if(action.receivedData.stockList !== null){
				state = state.setIn(['commonCardObj', 'stockCardList'], fromJS(action.receivedData.stockList))
			}
			if(action.receivedData.projectList !== null){
				state = state.setIn(['commonCardObj', 'projectCardList'], fromJS(action.receivedData.projectList))
			}
			if(action.receivedData.accountList !== null){
				state = state.setIn(['commonCardObj', 'accountCardList'], fromJS(action.receivedData.accountList))
			}
			if(action.receivedData.jrCategoryList !== null){
				state = state.setIn(['commonCardObj', 'jrCategoryList'], fromJS(action.receivedData.jrCategoryList))
			}
			state = state.set('reportData', fromJS(action.receivedData))
			return state
		},
		[ActionTypes.CHANGE_RELATIVE_MXB_CHOOSE_VALUE]           : () => {
			return state.setIn(['views', 'chooseValue'], action.chooseValue)
		},
		[ActionTypes.CHANGE_RELATIVE_MXB_SEARCH_CONTENT]               : () => {
			return state.setIn(['views', 'searchContent'], action.value)
		},
		[ActionTypes.RELATIVE_MXB_CHANGE_COMMON_VALUE]               : () => {
			return state.setIn(['views', action.name], action.value)
		},
		[ActionTypes.CHANGE_RELATIVE_MXB_REPORT_DIRECTION]             : () => {
			if(action.changeData){
				if (state.getIn(['reportData', 'openDetail'])) {
					state = state.updateIn(['reportData', 'openDetail', 'balance'], v => -v)
				}
				state = state.updateIn(['reportData', 'balance'], v => -v)
			}


			return state.setIn(['views', 'chooseDirection'], action.direction)


		},
		[ActionTypes.GET_RELATIVE_MXB_CARD_LIST]         : () => {

			state = state.set('cardList', fromJS(action.receivedData.cardList))
						.set('cardPages', fromJS(action.receivedData.pages))
						.set('cardPageNum', fromJS(action.receivedData.currentPage))

			return state
		},
		[ActionTypes.CHANGE_RELATIVE_MXB_ANALYSIS_VALUE]                             : () => {
			state = state.setIn(['views', 'analysisType'], action.value)
						.setIn(['views', 'mergeStockBranch'], false)
						.setIn(['views', 'needBranch'], false)
						.setIn(['views', 'showAccount'], false)
						.setIn(['views', 'showProject'], false)
						.setIn(['views', 'showStock'], false)
						.setIn(['views', 'showJrCategory'], false)
						.setIn(['commonCardObj', 'chooseStockCard'], fromJS([]))
						.setIn(['commonCardObj', 'chooseProjectCard'], fromJS([]))
						.setIn(['commonCardObj', 'chooseAccountCard'], fromJS([]))
						.setIn(['commonCardObj', 'chooseJrCategoryCard'], fromJS([]))
			return state
		},

		[ActionTypes.RELATIVE_MXB_CHANGE_FILTER_CARD]               : () => {
			return state.setIn(['commonCardObj', action.name], action.value)
		},
		[ActionTypes.RELATIVE_MXB_CHANGE_ITEM_CHECKBOX_CHECKED]               : () => {
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
		[ActionTypes.RELATIVE_MXB_FILTER_CARD_CLEAR]         : () => {

			state = state.setIn(['commonCardObj','chooseStockCard'], fromJS([]))
						.setIn(['commonCardObj','chooseProjectCard'], fromJS([]))
						.setIn(['commonCardObj','chooseAccountCard'], fromJS([]))
						.setIn(['commonCardObj','chooseJrCategoryCard'], fromJS([]))

			return state
		},
		[ActionTypes.RELATIVE_MXB_NEED_BRANCH_CLEAR]         : () => {

			state = state.setIn(['views','mergeStockBranch'], false)
						.setIn(['views','needBranch'], false)

			return state
		},
	}[action.type] || (() => state))()
}
